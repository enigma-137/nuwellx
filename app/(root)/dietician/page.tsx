'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { ArrowUp, Bot, MessageCircleMoreIcon, Send, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Message {
  role: string
  content: string
}

interface ExampleQuestion {
  question: string
  icon: React.ReactNode
}

export default function DieticianPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showExamples, setShowExamples] = useState(true)

  const exampleQuestions: ExampleQuestion[] = [
    { question: "What's a balanced meal plan for weight loss?", icon: <Bot className="w-4 h-4" /> },
    { question: "How can I increase my protein intake?", icon: <Stethoscope className="w-4 h-4" /> },
    { question: "What are some healthy snack options?", icon: <MessageCircleMoreIcon className="w-4 h-4" /> },
  ]

  useEffect(() => {
    fetchChatHistory()
  }, [])

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get('/api/chathistory')
      setMessages(response.data.messages)
      setShowExamples(response.data.messages.length === 0)
    } catch (error) {
      console.error('Error fetching chat history:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setShowExamples(false)

    try {
      const response = await axios.post('/api/chat', {
        message: input,
        history: messages,
      })
      const botMessage: Message = { role: 'assistant', content: response.data.reply }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ])
    }

    setIsLoading(false)
  }

  const handleExampleClick = (question: string) => {
    setInput(question)
    sendMessage({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <div className="flex flex-col h-screen w-full p-1">
      <div className="w-full mx-auto rounded-none md:rounded-lg shadow-lg p-1 max-w-full md:max-w-xl">
        <h1 className="text-2xl font-bold mb-4 pt-4 shadow-inner text-center">
          Nuwell AI Dietician <Bot className="inline" /> <Stethoscope className="inline" />
        </h1>
        <div className="flex-1 pt-5 overflow-y-auto rounded-none md:rounded-lg p-1 max-h-[80vh] min-h-[70vh]">
          {messages.length === 0 && showExamples ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-400 mb-4">Try asking:</p>
              <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
                {exampleQuestions.map((eq, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-gray-100 transition-colors duration-200" onClick={() => handleExampleClick(eq.question)}>
                    <CardContent className="flex items-center p-4">
                      {eq.icon}
                      <span className="ml-2 text-sm">{eq.question}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-inherit'}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </span>
              </div>
            ))
          )}
          {isLoading && (
            <div className="text-start">
              <span className="animate-pulse"><MessageCircleMoreIcon /></span>
            </div>
          )}
        </div>
        <form onSubmit={sendMessage} className="flex items-center mt-4 sticky bottom-0 p-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ask about food recommendations..."
          />
          <button
            type="submit"
            className="p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <ArrowUp className="w-8 h-8 bg-sky-600 rounded-full text-white" />
          </button>
        </form>
      </div>
    </div>
  )
}