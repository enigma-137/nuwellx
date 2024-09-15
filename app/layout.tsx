"use client"

import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from '@/components/SideBar'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  

  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body className={inter.className}>
        <div className="">
          <div className="container mx-auto flex justify-between items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-black bg-white w shadow-lg rounded-full p-4"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
