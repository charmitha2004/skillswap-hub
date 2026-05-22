import { mockKnowledgeBase } from './mockKnowledgeBase'

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'can',
  'do',
  'for',
  'from',
  'how',
  'i',
  'in',
  'is',
  'it',
  'me',
  'my',
  'of',
  'on',
  'or',
  'the',
  'to',
  'what',
  'with',
  'you',
])

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
}

export function retrieveContext(userQuery, limit = 3) {
  const queryTerms = tokenize(userQuery)

  if (queryTerms.length === 0) {
    return mockKnowledgeBase.slice(0, limit)
  }

  const scoredChunks = mockKnowledgeBase.map((chunk, index) => {
    const chunkTerms = tokenize(chunk)
    const chunkTermSet = new Set(chunkTerms)
    const score = queryTerms.reduce((total, term) => {
      if (chunkTermSet.has(term)) {
        return total + 3
      }

      const partialMatch = chunkTerms.some(
        (chunkTerm) => chunkTerm.includes(term) || term.includes(chunkTerm)
      )

      return partialMatch ? total + 1 : total
    }, 0)

    return { chunk, index, score }
  })

  const matchedChunks = scoredChunks
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((item) => item.chunk)

  return matchedChunks.length > 0 ? matchedChunks : mockKnowledgeBase.slice(0, limit)
}
