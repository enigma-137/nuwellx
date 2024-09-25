'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import RecipeFinder from '../recipe-finder/page'
import { FoodAnalyzer } from '@/components/FoodAnalyzer'

export default function FoodFinder() {
  const [activeTab, setActiveTab] = useState<'recipeFinder' | 'foodAnalyzer'>('recipeFinder')

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Food Finder</h1>
      
      <div className="flex justify-center mb-6">
        <Button
          onClick={() => setActiveTab('recipeFinder')}
          variant={activeTab === 'recipeFinder' ? 'default' : 'outline'}
          className="mr-2"
        >
          Recipe Finder
        </Button>
        <Button
          onClick={() => setActiveTab('foodAnalyzer')}
          variant={activeTab === 'foodAnalyzer' ? 'default' : 'outline'}
        >
          Food Analyzer
        </Button>
      </div>

      <Card>
        <CardContent>
          {activeTab === 'recipeFinder' ? <RecipeFinder /> : <FoodAnalyzer />}
        </CardContent>
      </Card>
    </div>
  )
}