"use client"

import React from 'react'
import Link from 'next/link'
import { User, MessageSquare, LogOut, LucideCookie, ScanFaceIcon, Info, CookingPot, XIcon, Flame, BarChartBig, Home } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { SignOutButton, UserButton, useUser } from '@clerk/nextjs'
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useUser();
  const { setTheme, theme } = useTheme()

  const { firstName, lastName, imageUrl } = user || {
    firstName: '',
    lastName: '',
    imageUrl: '',
  }

  return (
    <>
      {/* Overlay for small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 shadow-lg z-50 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 bg-white  dark:bg-gray-900 border-r border-gray-800 dark:border-gray-800`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Nuwell</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
                <XIcon className="h-6 w-6" />
                <span className="sr-only">Close sidebar</span>
              </Button>

              <DropdownMenu >
              <DropdownMenuTrigger asChild >
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" >
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
  
            </div>
            
          
          </div>

          <nav className="flex-1 p-4 overflow-y-auto bg-background dark:bg-gray-800">
            <div className="mb-6">
              <div className="flex items-center gap-3 p-2">
                <UserButton />
                <div>
                  <span className="font-medium text-foreground">{firstName}</span>
                  <p className="text-sky-600 font-bold text-sm">My account</p>
                </div>
              </div>
            </div>

            <ul className="space-y-2">
              {[
                 { path: "/dashboard", label: "Home", icon: Home },
                { path: "/scan", label: "Scan", icon: ScanFaceIcon },
                { path: "/dietician", label: "AI Dietician", icon: MessageSquare },
                { path: "/scannedfoods", label: "My Foods", icon: LucideCookie },
                { path: "/food-finder", label: "Find Recipes", icon: CookingPot },
                { path: "/nutrient-tracking", label: "Track Nutrient", icon: BarChartBig, extraIcon: <Flame fill="orange" className="inline ml-2" /> },
                { path: "/about", label: "About", icon: Info },
              ].map(({ path, label, icon: Icon, extraIcon }) => (
                <li key={path}>
                  <Link 
                    href={path} 
                    className="flex items-center p-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200" 
                    onClick={onClose}
                  >
                    <Icon className="mr-3" size={20} />
                    <span>{label}</span>
                    {extraIcon}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-background dark:bg-gray-800">
            <SignOutButton>
              <Button variant="outline" className="w-full">
                <LogOut className="mr-2" size={20} />
                Sign Out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </>
  )
}