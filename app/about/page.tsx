import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4 sm:px-6 lg:px-8">
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
          
          <Card className="bg-white shadow-lg">
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
        
        {/* <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-sky-800 mb-8">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Jane Doe", role: "Founder & CEO", image: "/placeholder.svg?height=200&width=200" },
              { name: "John Smith", role: "Lead Developer", image: "/placeholder.svg?height=200&width=200" },
              { name: "Emily Brown", role: "Nutrition Specialist", image: "/placeholder.svg?height=200&width=200" },
            ].map((member, index) => (
              <Card key={index} className="bg-white shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={member.image}
                    alt={member.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-sky-700">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}
      </div> 
    </div>
  )
}