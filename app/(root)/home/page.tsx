'use client'

import React, { useState } from 'react'
import Camera from '@/components/Camera'
import Results from '@/components/Results'
import axios from 'axios'
import { CameraIcon, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null)

  const handleCapture = async (imageData: string, imageUrl: string) => {
    setLoading(true)
    setCapturedImageUrl(imageUrl)
    try {
      const response = await axios.post('/api/analyze', { imageData })
      setAnalysis(response.data.analysis)
    } catch (error) {
      console.error('Error analyzing image:', error)
      setAnalysis('Failed to analyze image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetAnalysis = () => {
    setAnalysis(null)
    setCapturedImageUrl(null)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">Nuwell Food Analyzer</h1>

      {!analysis && !loading && (
        <p className="text-base md:text-lg font-medium mb-6 p-5 rounded-xl shadow-inner text-center">
          Place the camera on any food substance to get nutritional information
        </p>
      )}

      {!analysis && !loading && (
        <div className="w-full max-w-md p-4 rounded-lg shadow-md border border-gray-200">
          <Camera onCapture={handleCapture} />
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center w-full max-w-md p-8 rounded-lg shadow-md border border-gray-200">
          <Loader className="text-gray-500 animate-spin" />
        </div>
      )}

      {capturedImageUrl && (
        <div className="w-full max-w-xl mt-6">
          <Image
            src={capturedImageUrl}
            alt="Captured food"
            width={300}
            height={200}
            layout="responsive"
            className="rounded-lg shadow-md"
          />
        </div>
      )}

      {analysis && (
        <div className="w-full max-w-xl mt-6">
          <Results analysis={analysis} />
          <Button
            onClick={resetAnalysis}
            className="mt-4 px-4 py-2 text-white rounded-lg shadow"
          >
            Retake <CameraIcon className='inline ml-2'/>
          </Button>
        </div>
      )}
    </main>
  )
}