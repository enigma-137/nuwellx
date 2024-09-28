import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"

export default function AboutUs() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-sky-800 mb-12">About Nuwell</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-64 md:h-full">
            <Image
              src="/imagen.png"
              alt="Team working together"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
          
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-sky-700 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                At NuWellX, we're passionate about empowering individuals to make informed decisions about their nutrition. Our AI-powered food analyzer and personalized dietician chatbot are designed to make healthy eating accessible and enjoyable for everyone.
              </p>
              <h3 className="text-xl font-semibold text-sky-600 mb-3">What We Offer</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Instant food analysis with our advanced AI</li>
                <li>Personalized dietary advice from our AI dietician</li>
                <li>Easy-to-use interface for tracking your nutrition</li>
                <li>Up-to-date information on healthy eating habits</li>
              </ul>
            </CardContent>
          </Card>
        </div>
     
      </div> 
    </div>
  )
}