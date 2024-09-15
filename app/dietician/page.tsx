'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { Bot, DessertIcon, Send, Stethoscope } from 'lucide-react'

interface Message {
  role: string
  content: string
}

export default function DieticianPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchChatHistory()
  }, [])

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get('/api/chat-history')
      setMessages(response.data.messages)
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

  return (
    <div className="flex flex-col min-h-screen max-w-full p-4 bg-gray-50 items-center justify-center">
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-4 p-4 shadow-inner text-center">
        Nuwell AI Dietician <Bot className="inline" /> <Stethoscope className="inline" />
      </h1>
      <div className="flex-1 overflow-y-auto mb-4 border border-gray-300 rounded-lg p-2 bg-gray-100 h-80">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-center">
            Thinking<span className="animate-pulse">...</span>
          </div>
        )}
      </div>
      <form onSubmit={sendMessage} className="flex items-center mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ask about food recommendations..."
        />
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Send className="w-5 h-6" />
        </button>
      </form>
    </div>
  </div>
  )
}
