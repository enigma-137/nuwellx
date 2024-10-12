'use client'

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CameraIcon, BarChart2, Utensils, Calendar, Stethoscope } from 'lucide-react'
import Image from 'next/image'

export default function Dashboard() {
  const { user } = useUser()
  const router = useRouter()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getEmoji = () => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 18) return '☀️' // Sun emoji for daytime
    return '🌙' // Moon emoji for nighttime
  }

  const blogPosts = [
    {
      title: 'How to scan food and get nutritional information',
      image: '/scan.webp',
      slug: 'how-to-scan-food'
    },
    {
      title: 'Chatting with the Dietician the right way',
      image: '/ai.png',
     slug: 'chatting-with-dietician'
    },
    {
      title: 'How to use the food and recipe finder',
      image: '/recipe.png',
      slug: 'food-recipe-finder'
    }
  ]
  return (
    <div className="container min-h-screen mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-base font-medium">
          Hi' {' '}{user?.firstName}
          </CardTitle>
          <div className='text-3xl font-bold mb-6'>{getGreeting()}  {getEmoji()}</div>
          
          <CardDescription>Welcome to your Nuwell Food dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              className="h-24 text-lg"
              onClick={() => router.push('/scan')}
            >
              <CameraIcon className="mr-2 h-6 w-6" />
              Scan Food
            </Button>


            <Button 
              className="h-24 text-lg"
              onClick={() => router.push('/dietician')}
            >
              <Stethoscope className="mr-2 h-6 w-6" />
              Ask Dietician
            </Button>
            <Button 
              className="h-24 text-lg"
              onClick={() => router.push('/nutrition-tracker')}
            >
              <BarChart2 className="mr-2 h-6 w-6" />
              Nutrition Tracker
            </Button>
            <Button 
              className="h-24 text-lg"
              onClick={() => router.push('/food-finder')}
            >
              <Utensils className="mr-2 h-6 w-6" />
              Food & Recipe Finder
            </Button>
           
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-4xl my-10  mx-auto">
        <h2 className="text-2xl font-bold mb-4">Get started</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {blogPosts.map((post, index) => (
            <div key={index} className="flex-none w-64 sm:w-80">
              <Card className="h-full">
                <CardContent className="p-0">
                  <div className="relative h-40 sm:h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                      
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-normal text-blue-500"
                      onClick={() => router.push(`/blog/${post.slug}`)}
                    >
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}