'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import RecipeFinder from '../recipe-finder/page'
import { FoodAnalyzer } from '@/components/FoodAnalyzer'
import RecipeSearch from '../nigerian-foods/page'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

export default function FoodFinder() {
  const [activeTab, setActiveTab] = useState<'recipeFinder' | 'foodAnalyzer' | 'recipeSearch'>('recipeFinder')

  const tabOptions = [
    { value: 'recipeFinder', label: 'Recipe Finder' },
    { value: 'foodAnalyzer', label: 'Food Analyzer' },
    { value: 'recipeSearch', label: 'Search Recipes' },
    // add more if you want 
  ]

  const handleTabChange = (value: 'recipeFinder' | 'foodAnalyzer' | 'recipeSearch') => {
    setActiveTab(value)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Food & Recipe Finder</h1>
      
      {/* Desktop view */}
      <div className="hidden md:flex justify-center mb-6">
        {tabOptions.map((option) => (
          <Button
            key={option.value}
            onClick={() => handleTabChange(option.value as typeof activeTab)}
            variant={activeTab === option.value ? 'default' : 'outline'}
            className="mr-2 last:mr-0 text-sm"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Mobile view  YAHH   npm install -g quikcommit-cli
*/}
      <div className="md:hidden flex justify-center mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              {tabOptions.find(option => option.value === activeTab)?.label}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {tabOptions.map((option) => (
              <DropdownMenuItem key={option.value} onSelect={() => handleTabChange(option.value as typeof activeTab)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardContent>
          {activeTab === 'recipeFinder' && <RecipeFinder />}
          {activeTab === 'foodAnalyzer' && <FoodAnalyzer />}
          {activeTab === 'recipeSearch' && <RecipeSearch />}
        </CardContent>
      </Card>
    </div>
  )
}