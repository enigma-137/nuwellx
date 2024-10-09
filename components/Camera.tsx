'use client'

import React, { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Button } from './ui/button'
import { CameraIcon, SwitchCameraIcon } from 'lucide-react'

interface CameraProps {
  onCapture: (imageData: string, imageUrl: string) => void
}

export default function Camera({ onCapture }: CameraProps) {
  const webcamRef = useRef<Webcam>(null)
  const [facingMode, setFacingMode] = useState('environment') // 'user' for front camera, 'environment' for back camera

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      const imageData = imageSrc.split(',')[1] // Remove the data URL prefix
      const imageUrl = URL.createObjectURL(dataURItoBlob(imageSrc))
      onCapture(imageData, imageUrl)
    }
  }, [webcamRef, onCapture])

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'))
  }

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1])
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString })
  }

  return (
    <div className="flex flex-col items-center">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="mb-4 rounded-lg"
        videoConstraints={{ facingMode }}
      />

      <div className='flex gap-4'>
        <Button
          onClick={capture}
        >
          Capture Image <CameraIcon className='inline ml-2'/>
        </Button>
        <Button 
          className='font-semibold'
          onClick={switchCamera}
          variant="outline"
        >
          Switch Camera <SwitchCameraIcon className='inline ml-2'/>
        </Button>
      </div>
    </div>
  )
}