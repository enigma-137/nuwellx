import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Food Analyzer',
  description: 'Analyze food images using AI',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Correctly include the manifest link */}
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
