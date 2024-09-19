import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', "500", "600", "700"],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'Nuwell',
  description: 'Food and nutrition app',
  icons: {
    icon: '/favicon.ico', //oya
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
     <html lang="en">
      <body className={poppins.className}>
      <head>
      <link rel="manifest" href="/manifest.json" />
      </head>
        {children}</body>
    </html>
    </ClerkProvider>
   
  )
}
