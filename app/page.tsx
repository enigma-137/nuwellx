'use client'

import React, { useState } from 'react'
import Camera from '@/components/Camera'
import Results from '@/components/Results'

import axios from 'axios'

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
    <main className="flex min-h-screen bg-black flex-col items-center justify-between p-24">
      <h1 className="text-4xl text-white font-bold mb-8">Food Analyzer</h1>
      
      {/* Conditionally render the Camera component if there's no analysis */}
      {!analysis && !loading && <Camera onCapture={handleCapture} />}
      
      {/* Display loading message */}
      {loading && <p className='text-white'>Analyzing image...</p>}
      
      {/* Display results if analysis is available */}
      {analysis && (
        <>
          <Results analysis={analysis} />
          <button
            onClick={resetAnalysis}
            className="mt-4 px-4 py-2 bg-blue-900 rounded"
          >
            Capture Another Image
          </button>
        </>
      )}
    </main>
  )
}
