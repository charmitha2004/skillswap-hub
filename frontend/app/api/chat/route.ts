import {
  GoogleGenerativeAI,
  type Content,
  type Part,
} from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { retrieveContext } from '../../../lib/ragEngine'

require('dotenv').config({ path: path.resolve(process.cwd(), '..', '.env'), override: true, quiet: true })

export const runtime = 'nodejs'

type QueryResult<Row> = {
  rows: Row[]
}

type PgPool = {
  query<Row = Record<string, unknown>>(text: string, params?: unknown[]): Promise<QueryResult<Row>>
  on?(event: 'error', listener: (error: Error) => void): void
}

const { Pool } = require('pg') as {
  Pool: new (config: {
    connectionString?: string
    user?: string
    host?: string
    database?: string
    password?: string
    port?: number
    ssl?: { rejectUnauthorized: boolean }
  }) => PgPool
}

declare global {
  // eslint-disable-next-line no-var
  var skillswapChatDbPool: PgPool | undefined
}

type ChatMessage = {
  sender?: 'user' | 'gemini'
  text?: string
}

type ChatRequestBody = {
  history?: ChatMessage[]
  message?: string
  file?: string | null
  mimeType?: string | null
}

type ChatUser = {
  id: number
  name: string
  role: string
  skills: string[]
}

type FindUsersArgs = {
  skill?: string
  status?: string
}

type PlatformData = {
  dynamicContext: string
  liveUserCount: number
  liveSkillsArray: string[]
}

function buildHistoryContents(history: ChatMessage[] = []): Content[] {
  const contents = history
    .filter((message) => typeof message.text === 'string' && message.text.trim().length > 0)
    .map((message) => ({
      role: message.sender === 'gemini' ? 'model' : 'user',
      parts: [{ text: message.text?.trim() || '' }],
    }))
    .filter((content) => content.parts[0].text.length > 0)

  while (contents.length > 0 && contents[0].role !== 'user') {
    contents.shift()
  }

  return contents
}

function getDatabasePool() {
  if (!globalThis.skillswapChatDbPool) {
    const hasConnectionString = Boolean(process.env.DATABASE_URL)

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      user: hasConnectionString ? undefined : process.env.DB_USER || 'postgres',
      host: hasConnectionString ? undefined : process.env.DB_HOST || 'localhost',
      database: hasConnectionString ? undefined : process.env.DB_NAME || 'skillswap',
      password: hasConnectionString ? undefined : process.env.DB_PASSWORD || 'postgres',
      port: hasConnectionString ? undefined : Number(process.env.DB_PORT || 5432),
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    })

    pool.on?.('error', (error) => {
      console.error('Unexpected database pool error', error)
    })

    globalThis.skillswapChatDbPool = pool
  }

  return globalThis.skillswapChatDbPool
}

async function getPlatformData(): Promise<PlatformData> {
  try {
    const db = getDatabasePool()

    const [userCountResult, skillsResult] = await Promise.all([
      db.query<{ total: number }>('SELECT COUNT(*)::int AS total FROM users'),
      db.query<{ skill: string }>(`
        SELECT DISTINCT skill
        FROM (
          SELECT unnest(teach_skills) AS skill FROM users
          UNION
          SELECT unnest(learn_skills) AS skill FROM users
        ) platform_skills
        WHERE NULLIF(trim(skill), '') IS NOT NULL
        ORDER BY skill ASC
        LIMIT 50
      `),
    ])

    const liveUserCount = userCountResult.rows[0]?.total ?? 0
    const liveSkillsArray = skillsResult.rows.map((row) => row.skill).filter(Boolean)
    const skillsText = liveSkillsArray.length ? liveSkillsArray.join(', ') : 'none listed yet'

    return {
      dynamicContext: `CURRENT PLATFORM DATA: There are currently ${liveUserCount} registered users. The available skills on the platform include: ${skillsText}.`,
      liveUserCount,
      liveSkillsArray,
    }
  } catch (error) {
    console.error('Unable to load dynamic platform context', error)
    return {
      dynamicContext: 'CURRENT PLATFORM DATA: Live platform data is currently unavailable from the database.',
      liveUserCount: 0,
      liveSkillsArray: [],
    }
  }
}

async function findUsersBySkill({ skill = '', status = '' }: FindUsersArgs): Promise<ChatUser[]> {
  try {
    const db = getDatabasePool()
    const normalizedSkill = skill.trim()
    const wantsActiveUsers = status.toLowerCase().includes('active')

    const result = normalizedSkill
      ? await db.query<{
          id: number
          name: string
          department: string
          teach_skills: string[]
          learn_skills: string[]
        }>(
          `SELECT id, name, department, teach_skills, learn_skills
           FROM users
           WHERE EXISTS (SELECT 1 FROM unnest(teach_skills) skill WHERE skill ILIKE $1)
              OR EXISTS (SELECT 1 FROM unnest(learn_skills) skill WHERE skill ILIKE $1)
           ORDER BY name ASC
           LIMIT 6`,
          [`%${normalizedSkill}%`]
        )
      : await db.query<{
          id: number
          name: string
          department: string
          teach_skills: string[]
          learn_skills: string[]
        }>(
          `SELECT id, name, department, teach_skills, learn_skills
           FROM users
           ORDER BY updated_at DESC, name ASC
           LIMIT 6`
        )

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      role: wantsActiveUsers ? `${row.department} member` : row.department,
      skills: Array.from(new Set([...(row.teach_skills || []), ...(row.learn_skills || [])])).slice(0, 8),
    }))
  } catch (error) {
    console.error('Unable to find users by skill', error)
    return []
  }
}

function getDirectToolArgs(message: string): FindUsersArgs | null {
  const normalized = message.toLowerCase()

  if (/\b(active|available|registered)\s+users?\b/.test(normalized)) {
    return { status: 'active' }
  }

  const skillMatch =
    normalized.match(/\b(?:who knows|who teaches|show me|find|anyone knows|users? with)\s+([a-z0-9+#.\s-]+?)(?:\?|$)/i) ||
    normalized.match(/\b([a-z0-9+#.-]+)\s+(?:users|mentors|teachers|experts)\b/i)

  if (!skillMatch?.[1]) {
    return null
  }

  const skill = skillMatch[1]
    .replace(/\b(active|available|users|mentors|teachers|experts|skill|skills|for|me)\b/gi, '')
    .trim()

  return skill ? { skill } : null
}

function isSkillListQuestion(message: string) {
  return /\b(what|which|show|list).*\b(skills|available skills)\b/i.test(message)
}

function isUserCountQuestion(message: string) {
  return /\b(how many|count|number of|active|registered).*\b(users|members)\b/i.test(message)
}

function isGreeting(message: string) {
  return /^(hi|hello|hey|hii|helo|namaste)\b[!.?\s]*$/i.test(message)
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody
    const history = Array.isArray(body.history) ? body.history : []
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const file = typeof body.file === 'string' && body.file.length > 0 ? body.file : null
    const mimeType =
      typeof body.mimeType === 'string' && body.mimeType.length > 0 ? body.mimeType : null

    if (!message && !file) {
      return NextResponse.json(
        { error: 'A message or file attachment is required.' },
        { status: 400 }
      )
    }

    if (!file && isGreeting(message)) {
      return new Response('Hi! Ask me about skills, users, requests, or a topic you want to learn.', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    const platformData = await getPlatformData()
    const { dynamicContext, liveSkillsArray, liveUserCount } = platformData
    const directToolArgs = file ? null : getDirectToolArgs(message)

    if (directToolArgs) {
      const users = await findUsersBySkill(directToolArgs)
      const skillText = directToolArgs.skill ? ` for ${directToolArgs.skill}` : ''

      return NextResponse.json({
        type: 'tool-invocation',
        toolName: 'findUsersBySkill',
        text: users.length
          ? `Found ${users.length} user${users.length === 1 ? '' : 's'}${skillText}.`
          : `No users found${skillText}.`,
        args: directToolArgs,
        users,
      })
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return new Response(
        'I can answer platform stats and user searches, but Gemini is not configured for tutoring yet.',
        {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }
      )
    }

    const contextChunks = retrieveContext(message || 'uploaded file assistance')
    const ragContext = contextChunks.length
      ? `Relevant platform details:\n${contextChunks
          .map((chunk: string, index: number) => `${index + 1}. ${chunk}`)
          .join('\n')}`
      : ''

    const systemInstruction = `You are SwapSkill Copilot, the official assistant for SwapSkill Hub.

You have strict operational rules you MUST follow:

RULE 1: CONCISENESS. You are strictly forbidden from writing paragraphs. Your answers must be extremely short, direct, and conversational. Use a maximum of 1 to 3 short sentences. If listing things, use brief bullet points.

RULE 2: APPROVED TOPICS. You may ONLY answer questions related to:
A) The SwapSkill Hub platform (how to use it, active users, available skills, making requests).
B) Educational, technical, or skill-based subjects (e.g., 'What is Java', 'How does React work', 'Explain UI design').

RULE 3: STRICT REJECTION. If a user asks about ANYTHING outside of the approved topics in Rule 2 (e.g., weather, politics, recipes, general non-educational chat, writing essays), you must immediately reject the prompt. Reply exactly with: 'I am the SwapSkill Hub assistant. That topic is not valid here. I can only help with platform features and educational subjects.' Do not apologize or explain further.

RULE 4: CONTEXT USAGE. Always prioritize using the injected database context to answer questions about active users and platform stats.

RULE 5: VISION & IMAGE UPLOADS. If the user uploads an image, you must first determine if it is related to an educational subject, a technical skill, or the SwapSkill Hub platform.

IF YES: Analyze the image and help the user learn from it or solve their problem.

IF NO (e.g., a random selfie, a picture of a pet, or unrelated objects): You MUST refuse to analyze it. Reply exactly with: 'I can only analyze images related to educational subjects or platform skills. Please upload something related to your learning goals.'

${dynamicContext}

${ragContext}`

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
      systemInstruction,
    })

    const userParts: Part[] = [
      {
        text:
          message ||
          'Please analyze this uploaded file and explain how it relates to SwapSkill Hub.',
      },
    ]

    if (file && mimeType) {
      if (!mimeType.startsWith('image/')) {
        return new Response(
          'I can only analyze images related to educational subjects or platform skills. Please upload something related to your learning goals.',
          {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          }
        )
      }

      userParts.push({
        inlineData: {
          data: file,
          mimeType,
        },
      })
    }

    const contents = [
      ...buildHistoryContents(history),
      {
        role: 'user',
        parts: userParts,
      },
    ]

    if (!file && isSkillListQuestion(message)) {
      const skillsText = liveSkillsArray.length ? liveSkillsArray.join(', ') : 'No skills are listed yet.'
      return new Response(`Available skills: ${skillsText}`, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    if (!file && isUserCountQuestion(message)) {
      return new Response(`There are currently ${liveUserCount} registered users.`, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    const result = await model.generateContentStream({
      contents,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 200,
      },
    })

    let previousText = ''
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const currentText = chunk.text().trim()
            const delta = currentText.startsWith(previousText)
              ? currentText.slice(previousText.length)
              : currentText

            if (delta) {
              controller.enqueue(delta)
            }
            previousText = currentText
          }
          controller.close()
        } catch (streamError) {
          controller.enqueue(
            'I am the SwapSkill Hub assistant. That topic is not valid here. I can only help with platform features and educational subjects.'
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Unable to process chat request', error)
    return new Response(
      'I hit a chat service issue. Try asking about skills, users, requests, or a learning topic again.',
      {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      }
    )
  }
}
