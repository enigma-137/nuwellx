'use client'

import React, { useState } from 'react'
import Camera from '@/components/Camera'
import Results from '@/components/Results'


import axios from 'axios'
import { CameraIcon, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCapture = async (imageData: string) => {
    setLoading(true)
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
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 ">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center">Nuwell Food Analyzer </h1>

      {!analysis && !loading && (
        <p className="text-base md:text-lg font-medium mb-6 p-5 rounded-xl shadow-inner  text-center">
          Place the camera on any food substance to get nutritional information
        </p>
      )}

      {/* Conditionally render the Camera component if there's no analysis */}
      {!analysis && !loading && (
        <div className="w-full max-w-md p-4  rounded-lg shadow-md border border-gray-200">
          <Camera onCapture={handleCapture} />
        </div>
      )}

      {/* Display loading message */}
      {loading && (
        <div className="flex items-center justify-center w-full max-w-md p-1 rounded-lg shadow-md border border-gray-200">
          <Loader className="text-gray-500 animate-spin" />
        </div>
      )}

      {/* Display results if analysis is available */}
      {analysis && (
        <div className="w-full max-w-md p-4  rounded-lg shadow-md text-center">
          <Results analysis={analysis} />
          <Button
            onClick={resetAnalysis}
            className="mt-4 px-4 py-2  text-white rounded-lg shadow "
          >
            
            Capture Another Image  <CameraIcon className='inline ml-2'/>
          </Button>
        </div>
      )}
    </main>
  )
}
