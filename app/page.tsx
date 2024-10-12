"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ContactForm } from '@/components/ContactForm';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; 
  }
const router = useRouter()
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navbar */}
      <header className="bg-blue-600 py-4 shadow-md fixed w-full z-10">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-white text-3xl font-bold">Nuwell</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="#about" className="text-white">About</Link></li>
              <li><Link href="#features" className="text-white">Contact</Link></li>
              <li><Link href="#faq" className="text-white">FAQ</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-400 to-purple-500 min-h-screen flex items-center justify-center relative overflow-hidden" id="hero">
        
      {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full mix-blend-screen filter blur-xl"
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)`,
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
        
        <div className="container mx-auto text-center px-4 z-10">

          <motion.h2 
            className="text-5xl md:text-6xl font-extrabold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Track Your Nutrient Intake Easily
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-blue-100 mt-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Scan food, Get Recipes, track nutrients, and get personalized advice from our AI Dietician.
          </motion.p>
          <motion.button 
            className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}

            onClick={()=> {router.push('/dashboard')}}
          >  
              Get Started Now
            
          </motion.button>
        </div>
      
      </section>

      {/* Features Section */}
      <section className="py-20" id="features">
        <div className="container mx-auto text-center px-4">
          <h3 className="text-3xl font-bold text-blue-900">What you can do!</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <Image src="/scan.webp" alt="Scan Food" className="mx-auto w-20 h-20 mb-4" height={1024} width={1024}/>
              <h4 className="text-xl font-semibold text-blue-900">Scan Food</h4>
              <p className="text-gray-700 mt-2">Instantly get detailed nutrition information by scanning your food.</p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <Image src="/track.png" height={1024} width={1024} alt="Track Nutrients" className="mx-auto w-20 h-20 mb-4"/>
              <h4 className="text-xl font-semibold text-blue-900">Track Nutrients</h4>
              <p className="text-gray-700 mt-2">Keep track of your daily nutrient intake with ease.</p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <Image src="/ai.png" height={1024} width={1024}  alt="AI Dietician" className="mx-auto w-20 h-20 mb-4"/>
              <h4 className="text-xl font-semibold text-blue-900">AI Dietician</h4>
              <p className="text-gray-700 mt-2">Get personalized dietary advice from our AI Dietician.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <Image src="/recipe.png" height={1024} width={1024}  alt="Recipe Finder" className="mx-auto w-20 h-20 mb-4"/>
              <h4 className="text-xl font-semibold text-blue-900">Recipe Finder</h4>
              <p className="text-gray-700 mt-2">
               Get recipes, ingredients and preparation process of foods instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-blue-50 py-20" id="about">
        <div className="container mx-auto text-center px-4">
          <h3 className="text-3xl font-bold text-blue-900">About Nuwell</h3>
          <p className="text-lg text-gray-700 mt-4">
            Our mission is to make nutrition tracking easier for everyone. With just a simple scan, you can track your nutrient intake and get insights from our AI Dietician to improve your health.
            We're passionate about empowering individuals to make informed decisions about their nutrition. Our AI-powered food analyzer and personalized dietician chatbot are designed to make healthy eating accessible and enjoyable for everyone.
          </p>
        </div>
      </section>

      <section className='px-4 md:px-20 py-20' id="faq">
        <h3 className="text-3xl font-bold text-blue-900 text-center mb-10">Frequently Asked Questions</h3>
        <Accordion type="single" collapsible className="w-full text-black max-w-3xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>How accurate is the food scanning feature?</AccordionTrigger>
            <AccordionContent>
              Our food scanning feature uses advanced image recognition technology and a comprehensive database to provide highly accurate nutrition information. However, for homemade or custom meals, manual input may be necessary for the most precise tracking.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I set personalized nutrition goals?</AccordionTrigger>
            <AccordionContent>
              Yes! Nuwell allows you to set custom nutrition goals based on your dietary needs, fitness objectives, or health conditions. Our AI Dietician can also help you create and adjust these goals for optimal results.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How does the AI Dietician provide personalized advice?</AccordionTrigger>
            <AccordionContent>
              Our AI Dietician analyzes your food intake, nutrition goals, and any health information you provide to offer tailored dietary recommendations. It uses machine learning algorithms to continuously improve its advice based on your progress and feedback.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Is my data secure and private?</AccordionTrigger>
            <AccordionContent>
              Absolutely. We take your privacy seriously. All your personal and health data is encrypted and stored securely. We never share your information with third parties without your explicit consent. You can review our privacy policy for more details.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

   

      <section className='px-20 py-20'>
<ContactForm />
      </section>
      <footer className="bg-blue-600 py-6">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2024  Nuwell. All rights reserved.</p>
         
        </div>
      </footer>
    </div>
  )
}