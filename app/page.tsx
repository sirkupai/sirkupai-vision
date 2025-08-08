'use client'

import { useState } from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import Header from '@/components/Header'
import ImageGenerator from '@/components/ImageGenerator'
import LandingPage from '@/components/LandingPage'
import { Toaster } from '@/components/ui/toaster'

export default function Home() {
  const [showLanding, setShowLanding] = useState(true)

  if (showLanding) {
    return (
      <>
        <LandingPage onGetStarted={() => setShowLanding(false)} />
        <Toaster />
      </>
    )
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <main>
          <div className="text-center py-12 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                <span className="gradient-text">THE END OF</span>
                <br />
                <span className="text-white">VISUAL GUESSWORK</span>
              </h1>
              <p className="text-gray-400 text-2xl font-medium">
                <span className="gradient-text font-bold">Say it.</span> 
                <span className="text-white font-bold"> See it.</span> 
                <span className="gradient-text font-bold"> Use it.</span>
              </p>
            </div>
          </div>
          <ImageGenerator />
        </main>
        <Toaster />
      </div>
    </AuthWrapper>
  )
}