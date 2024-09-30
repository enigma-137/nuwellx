'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation' 
import React from 'react'
import Image from 'next/image'
import { BarcodeIcon, ScanSearchIcon } from 'lucide-react'

const Page = () => {
  const router = useRouter()

  const handleRedirect = () => {
    router.push('/home')
  }

  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen p-8">
      <div className="text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-4">
          NuWell Food Scanner 
        </h1>
        <p className='text-lg mb-6'>
          Scan foods to get their nutritional composition and other information!
        </p>
       
      </div>

      <div className="mt-8 ">
        <Image
          src="/scan.webp" 
          alt="Food Scanner Illustration"
          className="rounded-lg shadow-lg"
          width={400}
          priority
          height={400}
        />
      </div>
<div className='flex gap-4'>
<Button 
          onClick={handleRedirect} 
          className="px-4 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Scan Food <ScanSearchIcon  className='inline  ml-2'/>
        </Button>

        
      <Button 
          onClick={()=> router.push("/barcode-scanner")} 
          className="px-4 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Scan Barcode <BarcodeIcon  className='inline  ml-2'/>
        </Button>
</div>
     
    </div>
  )
}

export default Page
