'use client'

import React from 'react'
import Link from 'next/link'
import { User, MessageSquare, LogOut, LucideCookie, ScanFaceIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { SignOutButton, UserButton } from '@clerk/nextjs'

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Nuwell</h2>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
              <UserButton />
              </li>

              <li>
                <Link href="/home" className="flex items-center p-2 gap-12 rounded shadow-lg font-medium hover:bg-gray-100">
                Scan
                  <ScanFaceIcon className="mr-2 ml-2 text-blue-600 " size={20} />
                 
                </Link>
              </li>
              <li>
                <Link href="/dietician" className="flex items-center p-2 gap-12 rounded shadow-lg font-medium hover:bg-gray-100">
                Dietician
                  <MessageSquare className="mr-2 ml-2" size={20} />
                 
                </Link>
              </li>
              {/* o */}
              <li>
                <Link href="/scannedfoods" className="flex items-center p-2 gap-12 rounded shadow-lg font-medium hover:bg-gray-100">
                My Foods
                  <LucideCookie className="mr-2 ml-2" size={20} />
                 
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t">
            <Button variant="outline"> 
              <LogOut className="mr-2 ml-2" size={20} />
              <SignOutButton />
              
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}