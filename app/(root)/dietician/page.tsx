'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { Bot, MessageCircleMoreIcon, Send, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
      const response = await axios.get('/api/chathistory')
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

  const askAboutScannedFoods = async () => {
    const question = "Can you tell me about the foods I've recently scanned and provide some dietary advice based on that?"
    setInput(question)
    await sendMessage({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <div className="flex flex-col h-screen   w-full p-1 bg-white">
    <div className="w-full mx-auto bg-white rounded-none md:rounded-lg shadow-lg p-1 max-w-full md:max-w-xl">
      <h1 className="text-2xl font-bold mb-4 pt-4 shadow-inner text-center">
        Nuwell AI Dietician <Bot className="inline" /> <Stethoscope className="inline" />
      </h1>
      <div className="flex-1 overflow-y-auto border border-gray-300 rounded-none md:rounded-lg p-1 bg-gray-100 max-h-[80vh] min-h-[60vh]"> 
        {messages.length === 0 ? (
          <div className="flex items-center  justify-center h-full text-gray-400">
           <p className='pt-8 items-center flex justify-center'>No messages yet</p> 
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
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
      {/* Input form container with sticky positioning */}
      <form onSubmit={sendMessage} className="flex items-center mt-4 sticky bottom-0 bg-white p-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ask about food recommendations..."
        />
        <button
          type="submit"
          className="p-3 text-sky-600 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Send className="w-8 h-6 text-sky-600" fill='skyblue' />
        </button>
      </form>
    </div>
  </div>  

  
  )
}
