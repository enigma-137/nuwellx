'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation' // Note: use 'next/navigation' for 'useRouter'
import React from 'react'

const Page = () => {
  const router = useRouter()

  const handleRedirect = () => {
    router.push('/home')
  }

  return (
    <div className=" flex flex-col gap-3 items-center justify-center min-h-screen">
     <p className='p-12'>Scan foods to get their nutritional and other information!</p> 

     <div>
     <Button onClick={handleRedirect} className="px-6 py-3">
        Get started
      </Button>
     </div>
     
    </div>
  )
}

export default Page
