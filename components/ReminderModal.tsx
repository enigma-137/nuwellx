'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { InfoIcon } from 'lucide-react'



export function ReminderModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const { isLoaded, userId } = useAuth()

  useEffect(() => {
    if (isLoaded && userId) {
      fetch('/api/user-preference')
        .then(res => res.json())
        .then(data => {
          if (!data.hasSeenAIReminder) {
            setIsOpen(true)
          }
        })
        .catch(error => console.error('Error fetching user preferences:', error))
    }
  }, [isLoaded, userId])

  const handleClose = () => {
    setIsOpen(false)
    if (dontShowAgain) {
      fetch('/api/user-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hasSeenAIReminder: true }),
      })
        .then(res => res.json())
        .then(data => console.log('User preference updated:', data))
        .catch(error => console.error('Error updating user preferences:', error))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='bg-white'>
        <DialogHeader>
          <DialogTitle className='p-3'>Important Reminder <InfoIcon className='inline'/>  </DialogTitle>
          <DialogDescription>
            While our AI-powered features are designed to be helpful, please remember:
          </DialogDescription>
        </DialogHeader>
        <div className="py-2 bg-white">
          <ul className="list-disc pl-6 space-y-2">
            <li>AI can make mistakes or provide inaccurate information.</li>
            <li>Always verify important information from reliable sources.</li>
            <li>Use AI suggestions as a starting point, not absolute truth.</li>
            <li>Your health decisions should involve professional medical advice.</li>
          </ul>
        </div>
        <DialogFooter className="sm:justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dontShowAgain"
              checked={dontShowAgain}
              onCheckedChange={(checked: boolean) => setDontShowAgain(checked as boolean)}
            />
            <label
              htmlFor="dontShowAgain"
              className="text-sm text-center p-2  font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Don't show this again
            </label>
          </div>
          <Button onClick={handleClose}>I Understand</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}