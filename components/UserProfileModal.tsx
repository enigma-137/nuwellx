
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (targetCalories: number) => void
}

export function UserProfileModal({ isOpen, onClose, onSave }: UserProfileModalProps) {
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | ''>('')
  const [weight, setWeight] = useState('')
  const [estimatedCalories, setEstimatedCalories] = useState(0)
  const [targetCalories, setTargetCalories] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile()
    }
  }, [isOpen])

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/user-profile')
      const { age, height, gender, activityLevel, targetCalories } = response.data
      setAge(age?.toString() || '')
      setHeight(height?.toString() || '')
      setGender(gender || '')
      setActivityLevel(activityLevel || '')
      setTargetCalories(targetCalories?.toString() || '')
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const calculateEstimatedCalories = () => {
    if (!age || !height || !gender || !activityLevel || !weight) return

    let bmr
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * parseFloat(weight)) + (4.799 * parseFloat(height)) - (5.677 * parseInt(age))
    } else {
      bmr = 447.593 + (9.247 * parseFloat(weight)) + (3.098 * parseFloat(height)) - (4.330 * parseInt(age))
    }

    let activityMultiplier
    switch (activityLevel) {
      case 'sedentary': activityMultiplier = 1.2; break
      case 'light': activityMultiplier = 1.375; break
      case 'moderate': activityMultiplier = 1.55; break
      case 'active': activityMultiplier = 1.725; break
      case 'very_active': activityMultiplier = 1.9; break
      default: activityMultiplier = 1.2
    }

    const estimated = Math.round(bmr * activityMultiplier)
    setEstimatedCalories(estimated)
    setTargetCalories(estimated.toString())
  }

  const handleSave = async () => {
    try {
      await axios.post('/api/user-profile', {
        age: parseInt(age),
        height: parseFloat(height),
        gender,
        activityLevel,
        targetCalories: parseInt(targetCalories),
      })
      onSave(parseInt(targetCalories))
      onClose()
      toast({
        title: "Profile Updated",
        description: "Your profile and target calories have been updated.",
      })
    } catch (error) {
      console.error('Error saving user profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Your Nutrition Goal</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="age" className="text-right">Age</label>
            <Input id="age" value={age} onChange={(e) => setAge(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="height" className="text-right">Height (cm&sup2;)</label>
            <Input id="height" value={height} onChange={(e) => setHeight(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="weight" className="text-right">Weight (kg)</label>
            <Input id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="gender" className="text-right">Gender</label>
            <Select value={gender} onValueChange={(value: 'male' | 'female') => setGender(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="activityLevel" className="text-right">Activity Level</label>
            <Select value={activityLevel} onValueChange={(value: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active') => setActivityLevel(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="light">Light Exercise</SelectItem>
                <SelectItem value="moderate">Moderate Exercise</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="very_active">Very Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={calculateEstimatedCalories}>Calculate Estimated Calories</Button>
          {estimatedCalories > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="targetCalories" className="text-right">Target Calories</label>
              <Input id="targetCalories" value={targetCalories} onChange={(e) => setTargetCalories(e.target.value)} className="col-span-3" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}