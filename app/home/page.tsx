'use client'

import React, { useState } from 'react'
import Camera from '@/components/Camera'
import Results from '@/components/Results'

import axios from 'axios'
import { Loader } from 'lucide-react'
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
    <main className="flex min-h-screen  flex-col items-center justify-between p-12">
      <h1 className="text-xl md:text-4xl font-bold mb-8">Nuwell Food Analyzer</h1>

      {!analysis && !loading && <p  className='text-sm font-medium py-4'> Place the camera on any food substance to get nutritional information</p>}
      
      {/* Conditionally render the Camera component if there's no analysis */}
      {!analysis && !loading && <Camera onCapture={handleCapture} />}
      
      {/* Display loading message */}
      {loading && <Loader />}
      
      {/* Display results if analysis is available */}
      {analysis && (
        <>
          <Results analysis={analysis} />
          <Button
            onClick={resetAnalysis}
         className='m-4'
          >
            Capture Another Image
          </Button>
        </>
      )}
    </main>
  )
}
