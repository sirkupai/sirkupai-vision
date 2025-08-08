'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, Sparkles, Zap, Download, Users, Eye, Brain, Rocket } from 'lucide-react'
import { getSliderImages, SIRKUPAI_SLIDER_IMAGES, FALLBACK_SLIDER_IMAGES } from '@/lib/images'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [sliderImages, setSliderImages] = useState(FALLBACK_SLIDER_IMAGES)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Debug: Log environment variables and image URLs
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Generated Supabase images:', SIRKUPAI_SLIDER_IMAGES.slice(0, 3))
    console.log('Using images:', getSliderImages().slice(0, 3))
    
    const images = getSliderImages()
    setSliderImages(images)
    
    // Test if first image loads
    if (images.length > 0 && images !== FALLBACK_SLIDER_IMAGES) {
      console.log('Testing first Supabase image:', images[0])
    }
  }, [])

  const features = [
    {
      icon: Brain,
      title: 'Neural Precision',
      description: 'Advanced AI that understands your creative vision with surgical precision'
    },
    {
      icon: Zap,
      title: 'Instant Magic',
      description: 'From thought to reality in seconds - no waiting, just creating'
    },
    {
      icon: Eye,
      title: 'Visual Perfection',
      description: 'Every pixel crafted with obsessive attention to detail'
    },
    {
      icon: Rocket,
      title: 'Limitless Creation',
      description: 'Break free from creative constraints and explore infinite possibilities'
    }
  ]

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supabase) {
      toast({
        title: 'Configuration Error',
        description: 'Supabase is not configured. Please set up your environment variables.',
        variant: 'destructive',
      })
      return
    }
    
    setLoading(true)

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          toast({
            title: 'Sign Up Error',
            description: error.message,
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Account Created Successfully! 🎉',
            description: 'Check your email for the confirmation link to complete your registration.',
          })
          setShowAuthModal(false)
          setEmail('')
          setPassword('')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          toast({
            title: 'Sign In Error',
            description: error.message,
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Welcome Back! 🚀',
            description: 'Successfully signed in to your account.',
          })
          onGetStarted()
        }
      }
    } catch (error) {
      toast({
        title: 'Unexpected Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
    setEmail('')
    setPassword('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0f0f0f] text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-500/5 to-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-6 py-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-white font-black text-3xl tracking-tight">SirkupAI</span>
              <span className="gradient-text font-black text-3xl tracking-tight ml-2">Vision</span>
            </motion.div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => openAuthModal('signin')}
              className="neuro-button text-white px-8 py-3 rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-300"
            >
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-16">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 neuro-card rounded-full mb-8 hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="h-5 w-5 gradient-text mr-3" />
              <span className="gradient-text text-lg font-bold">Powered by Next-Gen AI</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-none"
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-white"
              >
                THE END OF
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="gradient-text"
              >
                VISUAL
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="text-white"
              >
                GUESSWORK
              </motion.span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light leading-relaxed">
                <span className="font-bold gradient-text">Say it.</span> 
                <span className="text-white font-bold"> See it.</span> 
                <span className="font-bold gradient-text"> Use it.</span>
              </p>
              <p className="text-lg text-gray-400 font-medium">
                Transform your wildest imagination into stunning reality with AI that actually gets it.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => openAuthModal('signup')}
                  size="lg"
                  className="gradient-logo text-white px-10 py-4 text-lg font-bold rounded-2xl hover:scale-105 transition-all duration-300 pulse-glow"
                >
                  <Rocket className="mr-3 h-6 w-6" />
                  Start Creating Free
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => openAuthModal('signin')}
                  size="lg"
                  variant="outline"
                  className="neuro-button text-white px-10 py-4 text-lg font-semibold rounded-2xl hover:scale-105 transition-all duration-300"
                >
                  Sign In
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Sliding Images Hero Section - Full Width */}
        </div>
      </main>
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="relative mb-16 overflow-hidden w-full"
      >
        <div className="flex animate-slide-left space-x-6">
          {/* First set of images */}
          <div className="flex space-x-8 min-w-full">
            {sliderImages.map((src, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-96 h-[28rem] neuro-card rounded-3xl overflow-hidden flex-shrink-0"
              >
                <img 
                  src={src}
                  alt={`SirkupAI Generated Art ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
          
          {/* Duplicate set for seamless loop */}
          <div className="flex space-x-6 min-w-full" aria-hidden="true">
            {sliderImages.map((src, index) => (
              <motion.div
                key={`duplicate-${index}`}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-96 h-[28rem] neuro-card rounded-3xl overflow-hidden flex-shrink-0"
              >
                <img 
                  src={src}
                  alt={`SirkupAI Generated Art ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pb-16">


          {/* Features Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 2.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="text-center group cursor-pointer"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center transition-all duration-500 ${
                      hoveredFeature === index 
                        ? 'gradient-logo scale-110 pulse-glow' 
                        : 'neuro-card group-hover:scale-105'
                    }`}
                  >
                    <Icon className={`h-10 w-10 transition-colors duration-300 ${
                      hoveredFeature === index ? 'text-white' : 'text-orange-400'
                    }`} />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-orange-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 3.2 }}
            className="text-center"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="neuro-card rounded-3xl p-16 max-w-5xl mx-auto"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3.4 }}
                className="text-5xl md:text-6xl font-black mb-8"
              >
                <span className="text-white">Ready to</span>
                <br />
                <span className="gradient-text">REVOLUTIONIZE</span>
                <br />
                <span className="text-white">Your Creativity?</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3.6 }}
                className="text-2xl text-gray-300 mb-12 font-light"
              >
                Join the creative revolution. Your imagination is the only limit.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => openAuthModal('signup')}
                  size="lg"
                  className="gradient-logo text-white px-16 py-6 text-2xl font-black rounded-2xl hover:scale-105 transition-all duration-300 pulse-glow"
                >
                  <Brain className="mr-4 h-8 w-8" />
                  START FOR FREE
                  <ArrowRight className="ml-4 h-8 w-8" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md neuro-card rounded-3xl p-8 relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl font-bold"
            >
              ×
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-white font-black text-2xl tracking-tight">SirkupAI</span>
                <span className="gradient-text font-black text-2xl tracking-tight">Vision</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {authMode === 'signin' ? 'Welcome Back' : 'Join the Revolution'}
              </h2>
              <p className="text-gray-400">
                {authMode === 'signin' 
                  ? 'Sign in to continue creating' 
                  : 'Create your account and start generating amazing images'
                }
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="grid w-full grid-cols-2 neuro-card p-2 rounded-xl mb-6">
              <button
                onClick={() => setAuthMode('signin')}
                className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  authMode === 'signin'
                    ? 'gradient-logo text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  authMode === 'signup'
                    ? 'gradient-logo text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modal-email" className="text-white font-semibold">
                  Email
                </Label>
                <Input
                  id="modal-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modal-password" className="text-white font-semibold">
                  Password
                </Label>
                <Input
                  id="modal-password"
                  type="password"
                  placeholder={authMode === 'signup' ? 'Create a password (min 6 characters)' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="auth-input"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-logo text-white font-bold text-lg py-4 rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading 
                  ? (authMode === 'signin' ? 'Signing In...' : 'Creating Account...') 
                  : (authMode === 'signin' ? 'Sign In' : 'Create Account')
                }
              </Button>
            </form>

            {/* Additional Info */}
            {authMode === 'signup' && (
              <p className="text-sm text-gray-400 text-center mt-4">
                By creating an account, you'll receive a confirmation email to verify your address.
              </p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}