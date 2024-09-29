import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'  
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', "500", "600", "700"],
  variable: '--font-inter'  
})

const APP_NAME = "Nuwell";
const APP_DEFAULT_TITLE = "Nuwell";
const APP_TITLE_TEMPLATE = "%s - Nuwell";
const APP_DESCRIPTION = "A nutritional app";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  icons: {
    icon: '/favicon.ico',
  },
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}