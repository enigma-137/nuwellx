'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation' 
import React from 'react'
import Image from 'next/image'
import { ScanSearchIcon } from 'lucide-react'

const Page = () => {
  const router = useRouter()

  const handleRedirect = () => {
    router.push('/home')
  }

  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="text-center max-w-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          NuWell Food Scanner <ScanSearchIcon />
        </h1>
        <p className='text-lg text-gray-700 mb-6'>
          Scan foods to get their nutritional and other information! Explore a world of healthier choices and stay informed.
        </p>
        <Button 
          onClick={handleRedirect} 
          className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Get Started
        </Button>
      </div>

      <div className="mt-8">
        <Image
          src="/image.jpeg" 
          alt="Food Scanner Illustration"
          className="rounded-lg shadow-lg"
          width={400}
          height={400}
        />
      </div>
    </div>
  )
}

export default Page
