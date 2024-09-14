'use client'

import React, { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Button } from './ui/button'

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

      <div className='flex'>
      <Button
        onClick={capture}
       
      >
        Capture Image
      </Button>
      <Button className='font-semibold'
        onClick={switchCamera}
   variant="ghost"
      >
        Switch Camera
      </Button>
      </div>
     
    </div>
  )
}
