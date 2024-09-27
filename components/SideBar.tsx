"use client"

import React from 'react'
import Link from 'next/link'
import { User, MessageSquare, LogOut, LucideCookie, ScanFaceIcon, Info, CookingPot, XIcon, Flame, BarChartBig } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { SignOutButton, UserButton, useUser } from '@clerk/nextjs'

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useUser();

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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <p className="flex items-end justify-end lg:hidden">
              {/* Close button for small screens */}
              <XIcon onClick={onClose} />
            </p>
            <h2 className="text-xl font-semibold">Nuwell</h2>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li className="p-4">
                <div className="flex gap-3">
                  <div className="p-4">
                    <UserButton />
                    <span className="font-medium text-black ml-4">{firstName}</span>
                    <p className="text-blue-600 font-medium pt-3 text-sm">My account</p>
                  </div>
                </div>
              </li>

              {[
                { path: "/", label: "Scan", icon: ScanFaceIcon },
                { path: "/dietician", label: "AI Dietician", icon: MessageSquare },
                { path: "/scannedfoods", label: "My Foods", icon: LucideCookie },
                { path: "/food-finder", label: "Find Recipes", icon: CookingPot },
                { path: "/nutrient-tracking", label: "Track Nutrient", icon: BarChartBig, extraIcon: <Flame fill="orange" className="inline" /> },
                { path: "/about", label: "About", icon: Info },
              ].map(({ path, label, icon: Icon, extraIcon }) => (
                <li key={path}>
                  <Link href={path} className="flex items-center p-2 gap-6 rounded shadow-sm hover:bg-gray-100" onClick={onClose}>
                    <Icon className="mr-2 ml-2" size={20} />
                    <p>{label} {extraIcon && extraIcon}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <Button variant="outline" onClick={onClose}>
              <LogOut className="mr-2 ml-2" size={20} />
              <SignOutButton />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
