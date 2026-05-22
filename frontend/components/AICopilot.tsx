'use client'

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrainCircuit, Bot, FileText, Image, Paperclip, Send, X } from 'lucide-react'
import { requestApi } from '../lib/api'
import type { CurrentUser } from '../lib/currentUser'

type ChatUser = {
  id: number
  name: string
  role: string
  skills: string[]
}

type ToolInvocation = {
  toolName: 'findUsersBySkill'
  text: string
  args?: {
    skill?: string
    status?: string
  }
  users: ChatUser[]
}

type ChatMessage = {
  sender: 'user' | 'gemini'
  text: string
  toolInvocation?: ToolInvocation
}

export default function AICopilot({ user }: { user: CurrentUser | null }) {
  const greetingName = user?.displayName?.trim().split(/\s+/)[0] || ''
  const greetingText = greetingName
    ? `Hi ${greetingName}, how can I help you find your next skill swap?`
    : 'Hi, how can I help you find your next skill swap?'

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'gemini',
      text: greetingText,
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [requestingUserIds, setRequestingUserIds] = useState<number[]>([])
  const [requestedUserIds, setRequestedUserIds] = useState<number[]>([])
  const historyRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMessages([
      {
        sender: 'gemini',
        text: greetingText,
      },
    ])
  }, [greetingText])

  useEffect(() => {
    historyRef.current?.scrollTo({
      top: historyRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isLoading])

  const convertFileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const result = reader.result

        if (typeof result !== 'string') {
          reject(new Error('Unable to read the selected file.'))
          return
        }

        resolve(result.split(',')[1] || result)
      }

      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setSelectedFile(file)

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setFilePreview(typeof reader.result === 'string' ? reader.result : null)
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    setFilePreview(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSend = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()

    const trimmedMessage = inputValue.trim()

    if ((!trimmedMessage && !selectedFile) || isLoading) {
      return
    }

    const attachedFile = selectedFile
    const fileLabel = attachedFile ? `\n\nAttached file: ${attachedFile.name}` : ''
    const userMessage: ChatMessage = {
      sender: 'user',
      text: `${trimmedMessage || 'Please review this attachment.'}${fileLabel}`,
    }
    const assistantPlaceholder: ChatMessage = { sender: 'gemini', text: '' }

    setMessages((currentMessages) => [...currentMessages, userMessage, assistantPlaceholder])
    setInputValue('')
    clearSelectedFile()
    setIsLoading(true)

    try {
      const base64Data = attachedFile ? await convertFileToBase64(attachedFile) : null
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: messages,
          message: trimmedMessage,
          file: base64Data,
          mimeType: attachedFile?.type,
        }),
      })

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null)
        const replyText =
          data?.error ||
          'I could not get a Gemini response right now. Please check the API key and try again.'
        setMessages((currentMessages) => {
          const updated = [...currentMessages]
          const lastIndex = updated.length - 1
          updated[lastIndex] = {
            ...updated[lastIndex],
            text: replyText,
          }
          return updated
        })
        return
      }

      const responseType = response.headers.get('content-type') || ''

      if (responseType.includes('application/json')) {
        const data = (await response.json()) as Partial<ToolInvocation> & { type?: string }

        if (data.type === 'tool-invocation' && data.toolName === 'findUsersBySkill') {
          setMessages((currentMessages) => {
            const updated = [...currentMessages]
            const lastIndex = updated.length - 1
            updated[lastIndex] = {
              sender: 'gemini',
              text: data.text || 'Here are matching users.',
              toolInvocation: {
                toolName: 'findUsersBySkill',
                text: data.text || 'Here are matching users.',
                args: data.args,
                users: Array.isArray(data.users) ? data.users : [],
              },
            }
            return updated
          })
          return
        }
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let currentText = ''
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) {
          currentText += decoder.decode(value, { stream: true })
          setMessages((currentMessages) => {
            const updated = [...currentMessages]
            const lastIndex = updated.length - 1
            updated[lastIndex] = {
              ...updated[lastIndex],
              text: currentText,
            }
            return updated
          })
        }
      }
    } catch {
      setMessages((currentMessages) => {
        const updated = [...currentMessages]
        const lastIndex = updated.length - 1
        updated[lastIndex] = {
          sender: 'gemini',
          text: 'I could not reach the AI service right now. Please try again in a moment.',
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestSwap = async (user: ChatUser, requestedSkill?: string) => {
    if (requestingUserIds.includes(user.id) || requestedUserIds.includes(user.id)) {
      return
    }

    setRequestingUserIds((ids) => [...ids, user.id])

    try {
      const skill = requestedSkill || user.skills[0] || 'Skill swap'
      await requestApi.send({
        receiverId: user.id,
        skill,
        title: `Swap request for ${skill}`,
        description: `Sent from SwapSkill Copilot to ${user.name}.`,
      })
      setRequestedUserIds((ids) => (ids.includes(user.id) ? ids : [...ids, user.id]))
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          sender: 'gemini',
          text: 'I could not send that swap request. Please sign in and try again.',
        },
      ])
    } finally {
      setRequestingUserIds((ids) => ids.filter((id) => id !== user.id))
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-end justify-end">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, x: 48, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 48, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 flex h-[500px] w-[350px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl shadow-secondary-dark/40 backdrop-blur-2xl"
          >
            <header className="flex items-center justify-between bg-primary px-4 py-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-white" aria-hidden="true" />
                <h2 className="font-display text-base font-semibold text-white">
                  SwapSkill Copilot
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-label="Close SwapSkill Copilot"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <div
              ref={historyRef}
              className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((message, index) => (
                <div
                  key={`${message.sender}-${index}`}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.toolInvocation?.toolName === 'findUsersBySkill' ? (
                    <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-slate-800 px-3 py-3 text-sm text-white">
                      <p className="mb-3 px-1 text-sm font-semibold text-slate-100">
                        {message.toolInvocation.text}
                      </p>
                      <div className="grid gap-3">
                        {message.toolInvocation.users.length ? (
                          message.toolInvocation.users.map((user) => (
                            <ChatUserCard
                              key={user.id}
                              user={user}
                              requestedSkill={message.toolInvocation?.args?.skill}
                              isRequesting={requestingUserIds.includes(user.id)}
                              isRequested={requestedUserIds.includes(user.id)}
                              onRequestSwap={handleRequestSwap}
                            />
                          ))
                        ) : (
                          <p className="px-1 text-xs font-medium text-slate-300">
                            Try another skill or update profiles with teach skills.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed text-white ${
                        message.sender === 'user'
                          ? 'rounded-br-md bg-white/10'
                          : 'rounded-bl-md bg-slate-800'
                      }`}
                    >
                      {message.text}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-slate-800 px-4 py-2.5 text-sm text-slate-200">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />
                    Gemini is thinking...
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSend}
              className="flex flex-col gap-2 border-t border-white/10 bg-slate-950/40 p-3"
            >
              {selectedFile && (
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-slate-200">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt={selectedFile.name}
                      className="h-9 w-9 rounded-lg object-cover"
                    />
                  ) : (
                    <FileText className="h-5 w-5 text-teal-300" aria-hidden="true" />
                  )}
                  <span className="min-w-0 flex-1 truncate">{selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={clearSelectedFile}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70"
                    aria-label="Remove attachment"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload image or photo"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                  className="flex h-10 min-w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-teal-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Attach image or photo"
              >
                  {selectedFile?.type.startsWith('image/') ? (
                    <Image className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Paperclip className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Ask about skills..."
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30"
                  aria-label="Message SwapSkill Copilot"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || (inputValue.trim().length === 0 && !selectedFile)}
                  className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-secondary px-3 text-sm font-semibold text-white shadow-lg shadow-secondary-dark/30 transition hover:bg-secondary-light focus:outline-none focus:ring-2 focus:ring-secondary-light disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl shadow-slate-900/50 transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-700/40"
        aria-label="Open SwapSkill Copilot"
        animate={{
          scale: [1, 1.06, 1],
          boxShadow: [
            '0 20px 35px rgba(15, 23, 42, 0.5)',
            '0 20px 45px rgba(30, 41, 59, 0.7)',
            '0 20px 35px rgba(15, 23, 42, 0.5)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Bot className="h-7 w-7 text-white" aria-hidden="true" />
      </motion.button>
    </div>
  )
}

function ChatUserCard({
  user,
  requestedSkill,
  isRequesting,
  isRequested,
  onRequestSwap,
}: {
  user: ChatUser
  requestedSkill?: string
  isRequesting: boolean
  isRequested: boolean
  onRequestSwap: (user: ChatUser, requestedSkill?: string) => void
}) {
  return (
    <article className="rounded-xl border border-white/10 bg-white px-3 py-3 text-slate-900 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-sm font-bold text-teal-700">
          {user.name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-950">{user.name}</h3>
          <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">{user.role}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {user.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
            {skill}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onRequestSwap(user, requestedSkill)}
        disabled={isRequesting || isRequested}
        className="mt-3 min-h-10 w-full rounded-xl bg-teal-100 px-3 text-sm font-bold text-teal-700 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      >
        {isRequested ? 'Swap Requested' : isRequesting ? 'Requesting...' : 'Request Swap'}
      </button>
    </article>
  )
}
