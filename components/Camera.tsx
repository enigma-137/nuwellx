'use client'

import React, { useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Button } from './ui/button'

interface CameraProps {
  onCapture: (imageData: string) => void
}

export default function Camera({ onCapture }: CameraProps) {
  const webcamRef = useRef<Webcam>(null)

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      onCapture(imageSrc.split(',')[1]) // Remove the data URL prefix
    }
  }, [webcamRef, onCapture])

  return (
    <div className="flex flex-col items-center">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="mb-4"
      />
      <Button
        onClick={capture}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Capture Image
      </Button>
    </div>
  )
}