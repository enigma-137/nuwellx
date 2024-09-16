'use client'

import React from 'react'
import Link from 'next/link'
import { User, MessageSquare, LogOut, LucideCookie, ScanFaceIcon, Info } from 'lucide-react'
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
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Nuwell</h2>

          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2 ">
              <li className='p-4 '>
                <div className='flex gap-3'>

                  <div className=' p-4'>  <UserButton /> <span className='font-medium text-black  ml-4'>{firstName}</span>
                    <p className='text-blue-600 font-medium pt-3 text-sm'>My account  </p>
                  </div>
                </div>


              </li>

              <li className=''>
                <Link href="/home" className="flex items-center p-2 gap-6 rounded shadow-sm  hover:bg-gray-100">

                  <ScanFaceIcon className="mr-2 ml-2 " size={20} />
                  <p> Scan</p>

                </Link>
              </li>
              <li>
                <Link href="/dietician" className="flex items-center p-2 gap-6 rounded shadow-sm hover:bg-gray-100">
                  <MessageSquare className="mr-2 ml-2" size={20} />
                  <p>AI Dietician </p>

                </Link>
              </li>
              {/* o */}
              <li className=''>
                <Link href="/scannedfoods" className="flex items-center p-2 gap-6 rounded shadow-sm  hover:bg-gray-100">

                  <LucideCookie className="mr-2 ml-2" size={20} />
                  <p>My Foods </p>

                </Link>
              </li>

              <li className=''>
                <Link href="/about" className="flex items-center p-2 gap-6 rounded shadow-sm hover:bg-gray-100">

                  <Info className="mr-2 ml-2" size={20} />
                  <p>About </p>

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