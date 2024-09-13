'use client'

import { Button } from '@/components/ui/button'
import React, { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'

interface CameraProps {
  onCapture: (imageData: string) => void
}

export default function Camera({ onCapture }: CameraProps) {
  const webcamRef = useRef<Webcam>(null)
  const [facingMode, setFacingMode] = useState('user') // 'user' for front camera, 'environment' for back camera

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      onCapture(imageSrc.split(',')[1]) // Remove the data URL prefix
    }
  }, [webcamRef, onCapture])

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'))
  }

  return (
    <div className="flex flex-col items-center">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="mb-4"
        videoConstraints={{ facingMode }}
      />
      <Button
        onClick={capture}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
      >
        Capture Image
      </Button>
      <Button variant="ghost"
        onClick={switchCamera}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Switch Camera
      </Button>
    </div>
  )
}
