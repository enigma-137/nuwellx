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
  const [bmi, setBmi] = useState<number | null>(null)
  const [bmiCategory, setBmiCategory] = useState<string>('')
  const [showBMI, setShowBMI] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile()
    }
  }, [isOpen])

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/user-profile')
      const { age, height, gender, activityLevel, targetCalories, weight } = response.data
      setAge(age?.toString() || '')
      setHeight(height?.toString() || '')
      setGender(gender || '')
      setActivityLevel(activityLevel || '')
      setTargetCalories(targetCalories?.toString() || '')
      setWeight(weight?.toString() || '')
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100
      const weightInKg = parseFloat(weight)
      const bmiValue = weightInKg / (heightInMeters * heightInMeters)
      setBmi(parseFloat(bmiValue.toFixed(1)))
      setBmiCategory(getBMICategory(bmiValue))
      setShowBMI(true)
    } else {
      toast({
        title: "Error",
        description: "Please enter both height and weight to calculate BMI.",
        variant: "destructive",
      })
    }
  }

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal weight'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
  }

  const calculateEstimatedCalories = () => {
    if (!age || !height || !gender || !activityLevel || !weight) {
      toast({
        title: "Error",
        description: "Please fill in all fields to calculate estimated calories.",
        variant: "destructive",
      })
      return
    }

    let bmr
    const heightInCm = parseFloat(height)
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * parseFloat(weight)) + (4.799 * heightInCm) - (5.677 * parseInt(age))
    } else {
      bmr = 447.593 + (9.247 * parseFloat(weight)) + (3.098 * heightInCm) - (4.330 * parseInt(age))
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
        weight: parseFloat(weight),
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Your Nutrition Goal</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="age" className="text-sm font-medium">Age</label>
            <Input id="age" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div className='flex flex-row gap-2'>
            <div className="grid gap-2">
          
          <label htmlFor="height" className="text-sm font-medium">Height (cm)</label>
          <Input 
            id="height" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)} 
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="weight" className="text-sm font-medium">Weight (kg)</label>
          <Input 
            id="weight" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)} 
          />
        </div>

          </div>
          
          <div className="grid gap-2">
            <label htmlFor="gender" className="text-sm font-medium">Gender</label>
            <Select value={gender} onValueChange={(value: 'male' | 'female') => setGender(value)}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="activityLevel" className="text-sm font-medium">Activity Level</label>
            <Select value={activityLevel} onValueChange={(value: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active') => setActivityLevel(value)}>
              <SelectTrigger id="activityLevel">
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
          <div className="flex flex-col gap-2">
            <Button onClick={calculateBMI}>View BMI</Button>
            <Button onClick={calculateEstimatedCalories}>Calculate Estimated Calories</Button>
          </div>
          {showBMI && bmi !== null && (
            <div className="text-center">
              <p>Your BMI: {bmi}</p>
              <p>Category: {bmiCategory}</p>
            </div>
          )}
          {estimatedCalories > 0 && (
            <div className="grid gap-2">
              <label htmlFor="targetCalories" className="text-sm font-medium">Target Calories</label>
              <Input id="targetCalories" value={targetCalories} onChange={(e) => setTargetCalories(e.target.value)} />
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