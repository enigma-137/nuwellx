'use client'

import React, { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Button } from './ui/button'
import { CameraIcon, SwitchCameraIcon, InfoIcon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CameraProps {
  onCapture: (imageData: string, imageUrl: string) => void
}

export default function Camera({ onCapture }: CameraProps) {
  const webcamRef = useRef<Webcam>(null)
  const [facingMode, setFacingMode] = useState('environment')

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      const imageData = imageSrc.split(',')[1]
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
    <div className="flex flex-col bg-transparent items-center relative w-full" style={{ aspectRatio: '3/4' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full h-full object-cover"
        videoConstraints={{ 
          facingMode,
          aspectRatio: 3/4
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="border-2 border-white w-64 h-64 rounded-lg"></div>
      </div>
      <div className='absolute bottom-4 left-0 right-0 flex justify-between items-center px-4'>
        <Button
          onClick={switchCamera}
          className="rounded-full p-2"
          variant="ghost"
        >
          <SwitchCameraIcon className='w-6 h-6 text-white' />
        </Button>
        <Button
          onClick={capture}
          className="rounded-full p-4 bg-white"
        >
          <CameraIcon className='w-8 h-8 text-black' />
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="rounded-full p-2" variant="ghost">
                <InfoIcon className='w-6 h-6 text-white' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Place the camera on any food substance to get nutritional information</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}