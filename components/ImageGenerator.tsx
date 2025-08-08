'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Download, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { saveAs } from 'file-saver'

interface Generation {
  id: string
  prompt: string
  format: string
  style: string
  lighting?: string
  art_style?: string
  film_type?: string
  aspect_ratio: string
  image_urls: string[]
  created_at: string
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('Landscape')
  const [generations, setGenerations] = useState<Generation[]>([])
  const [currentMessage, setCurrentMessage] = useState(0)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const { toast } = useToast()

  // Get Supabase bucket images for scrolling effect
  const [scrollingImages, setScrollingImages] = useState<string[]>([])

  useEffect(() => {
    // Load images from Supabase bucket for scrolling effect
    import('@/lib/images').then(({ getSliderImages }) => {
      const images = getSliderImages()
      setScrollingImages(images)
    })
  }, [])

  // Messages timed for 2-minute generation process
  const messages = [
    { text: "Understanding your vision...", icon: "🎯", duration: 15 },
    { text: "Analyzing artistic elements...", icon: "🎨", duration: 15 },
    { text: "Preparing neural pathways...", icon: "🧠", duration: 15 },
    { text: "Generating initial concepts...", icon: "✨", duration: 15 },
    { text: "Refining details and textures...", icon: "🖌️", duration: 15 },
    { text: "Applying finishing touches...", icon: "💎", duration: 15 },
    { text: "Optimizing color balance...", icon: "🎭", duration: 15 },
    { text: "Finalizing your masterpiece...", icon: "🚀", duration: 15 },
  ]

  useEffect(() => {
    loadGenerations()
  }, [])

  useEffect(() => {
    if (loading && startTime) {
      const messageInterval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000 // seconds
        const messageIndex = Math.min(
          Math.floor(elapsed / 15), // Change message every 15 seconds
          messages.length - 1
        )
        setCurrentMessage(messageIndex)
        
        // Update progress (0 to 100% over 120 seconds)
        const progress = Math.min((elapsed / 120) * 100, 100)
        setGenerationProgress(progress)
      }, 1000)
      
      return () => clearInterval(messageInterval)
    }
  }, [loading, startTime])

  const loadGenerations = async () => {
    if (!supabase) {
      console.log('Supabase client not initialized - skipping generation load')
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) {
        // If table doesn't exist, just log and continue without loading
        if (error.message?.includes('does not exist') || error.message?.includes('schema cache')) {
          console.log('⚠️ Generations table not found - app will work without persistence')
          return
        }
        console.error('Supabase query error:', error.message || error)
        return
      }
      
      setGenerations(data || [])
    } catch (error) {
      console.error('Error loading generations:', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  // Convert blob to base64
  const blobToBase64 = async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const LoadingAnimation = () => {
    return (
      <div className="flex justify-center items-center min-h-[400px] w-full">
        <div className="neuro-card rounded-3xl p-6 sm:p-12 max-w-xs sm:max-w-md mx-4 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-pink-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-60 animate-bounce"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2 + i * 0.2}s`
                }}
              />
            ))}
          </div>
          
          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Enhanced Icon with Multiple Glow Layers */}
            <div className="mb-8 relative">
              <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-orange-500 via-yellow-500 to-pink-500 opacity-40 animate-pulse scale-150"></div>
              <div className="absolute inset-0 blur-lg bg-gradient-to-r from-orange-400 to-yellow-400 opacity-60 animate-ping"></div>
              <div className="relative text-6xl animate-bounce" style={{ animationDuration: '2s' }}>
                {messages[currentMessage].icon}
              </div>
              
              {/* Orbiting Dots */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
                <div className="absolute -top-2 left-1/2 w-3 h-3 bg-orange-400 rounded-full transform -translate-x-1/2 animate-pulse"></div>
                <div className="absolute -bottom-2 left-1/2 w-3 h-3 bg-yellow-400 rounded-full transform -translate-x-1/2 animate-pulse"></div>
                <div className="absolute left-0 top-1/2 w-3 h-3 bg-pink-400 rounded-full transform -translate-y-1/2 animate-pulse"></div>
                <div className="absolute right-0 top-1/2 w-3 h-3 bg-purple-400 rounded-full transform -translate-y-1/2 animate-pulse"></div>
              </div>
            </div>
            
            {/* Status Text with Glow */}
            <h3 className="text-white font-bold text-2xl mb-4 transition-all duration-500 text-center drop-shadow-lg">
              {messages[currentMessage].text}
            </h3>
            
            {/* Enhanced ChatGPT-style dots */}
            <div className="flex space-x-2 mb-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full animate-bounce shadow-lg"
                  style={{ 
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1.4s'
                  }}
                />
              ))}
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-sm text-gray-300 mb-3 font-medium">
                <span>Progress</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${generationProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-3 text-center font-medium">
                ✨ Creating your masterpiece...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    setStartTime(Date.now())
    setGenerationProgress(0)
    setCurrentMessage(0)

    // Create a timeout for the 2-minute generation
    const timeoutId = setTimeout(() => {
      toast({
        title: 'Generation is taking longer than expected',
        description: 'Please wait a bit more or try again',
      })
    }, 150000) // 2.5 minutes

    try {
      console.log('🚀 Starting image generation with prompt:', prompt)
      
      // Call the n8n webhook
      const webhookUrl = 'https://sweet-connection.up.railway.app/webhook/v1/api/image-gen'
      
      console.log('📡 Calling webhook:', webhookUrl)
      const response = await fetch(`${webhookUrl}?prompt=${encodeURIComponent(prompt)}`, {
        method: 'GET',
        headers: {
          'Accept': 'image/png, image/jpeg, application/json',
        },
      })

      console.log('📨 Response status:', response.status)
      console.log('📨 Response headers:', response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error response:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to generate images'}`)
      }

      // Get the response as blob (single PNG image)
      const responseBlob = await response.blob()
      console.log('📦 Received blob size:', responseBlob.size, 'bytes')
      console.log('📦 Blob type:', responseBlob.type)
      
      // Check if we received an image
      if (responseBlob.size === 0) {
        throw new Error('Received empty response from server')
      }
      
      // Verify it's an image
      if (!responseBlob.type.startsWith('image/')) {
        console.error('❌ Expected image, got:', responseBlob.type)
        // Try to read as text to see what we actually got
        try {
          const responseText = await responseBlob.text()
          console.log('📄 Response content (first 500 chars):', responseText.substring(0, 500))
        } catch (e) {
          console.error('Could not read response as text')
        }
        throw new Error(`Expected image file, but received: ${responseBlob.type}`)
      }
      
      // Convert the single image to base64
      console.log('🎨 Converting image to base64...')
      const base64Data = await blobToBase64(responseBlob)
      const base64Images = [base64Data] // Single image in array
      
      console.log('✅ Image converted to base64 successfully')
      console.log('🎯 Generated 1 image')

      // Create a new generation object
      const aspectRatio = selectedFormat === 'Portrait' ? '9:16' : selectedFormat === 'Square' ? '1:1' : '16:9'
      const newGeneration: Generation = {
        id: `temp-${Date.now()}`,
        prompt,
        format: selectedFormat,
        style: 'Photographic',
        aspect_ratio: aspectRatio,
        image_urls: base64Images,
        created_at: new Date().toISOString(),
      }

      // Add to local state immediately
      setGenerations(prev => [newGeneration, ...prev.slice(0, 2)])

      // Save to database if available
      if (supabase) {
        try {
          const { data: userData } = await supabase.auth.getUser()
          if (userData.user) {
            console.log('💾 Saving to database...')
            const { data, error } = await supabase
              .from('generations')
              .insert([
                {
                  user_id: userData.user.id,
                  prompt,
                  format: selectedFormat,
                  style: 'Photographic',
                  aspect_ratio: aspectRatio,
                  image_urls: base64Images,
                },
              ])
              .select()

            if (error) {
              if (error.message?.includes('does not exist') || error.message?.includes('schema cache')) {
                console.log('⚠️ Database table not found - images displayed locally only')
              } else {
                console.error('⚠️ Database save error (non-critical):', error)
              }
              // Don't throw here - images are already displayed
            } else {
              console.log('✅ Saved to database:', data)
              // Update with real ID from database
              if (data && data[0]) {
                setGenerations(prev => 
                  prev.map(g => g.id === newGeneration.id ? data[0] : g)
                )
              }
            }
          }
        } catch (dbError) {
          console.error('⚠️ Database operation failed (non-critical):', dbError)
        }
      }

      toast({
        title: 'Success! 🎉',
        description: 'Generated 1 stunning image!',
      })
      
      // Clear the prompt after successful generation
      setPrompt('')
      
    } catch (error) {
      console.error('❌ Generation error:', error)
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate images. Please try again.',
        variant: 'destructive',
      })
    } finally {
      clearTimeout(timeoutId)
      setLoading(false)
      setStartTime(null)
      setGenerationProgress(0)
    }
  }

  const downloadIndividualImage = async (imageUrl: string, index: number, prompt: string) => {
    try {
      let blob: Blob
      
      // Check if it's a base64 data URL or a regular URL
      if (imageUrl.startsWith('data:')) {
        // Convert base64 to blob
        const response = await fetch(imageUrl)
        blob = await response.blob()
      } else {
        // Fetch from URL
        const response = await fetch(imageUrl)
        blob = await response.blob()
      }
      
      // Create filename from prompt (sanitized)
      const sanitizedPrompt = prompt.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 30).trim()
      const filename = `sirkupai_${sanitizedPrompt}_${index + 1}.png`
      
      saveAs(blob, filename)
      
      toast({
        title: 'Download Started',
        description: `Image ${index + 1} is being downloaded`,
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: 'Error',
        description: 'Failed to download image',
        variant: 'destructive',
      })
    }
  }

  const handleDownload = async (generation: Generation) => {
    try {
      // Since we now have only one image, download it directly
      if (generation.image_urls.length > 0) {
        await downloadIndividualImage(generation.image_urls[0], 0, generation.prompt)
      }
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: 'Error',
        description: 'Failed to download image',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0f0f0f] text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 relative z-20">

        {/* Generated Images or Loading Animation */}
        {loading ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Generating Your Vision...</h2>
            <LoadingAnimation />
          </div>
        ) : generations.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Creations</h2>
            <div className="space-y-8">
              {generations.map((generation) => (
                <div key={generation.id} className="text-center">
                  {/* Images in horizontal row */}
                  <div className="flex justify-center gap-2 sm:gap-4 mb-4 flex-wrap">
                    {generation.image_urls.map((url, index) => (
                      <div
                        key={index}
                        onClick={() => downloadIndividualImage(url, index, generation.prompt)}
                        className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
                      >
                        <div className="neuro-card rounded-2xl overflow-hidden w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 relative">
                          <img
                            src={url}
                            alt={`Generated image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          {/* Download overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="text-white text-center">
                              <Download className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-sm font-medium">Click to Download</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Prompt and bulk download */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 flex-wrap">
                    <p className="text-gray-400 text-center max-w-2xl italic text-sm sm:text-base">
                      "{generation.prompt}"
                    </p>
                    <Button
                      onClick={() => handleDownload(generation)}
                      size="sm"
                      className="neuro-button text-white font-semibold px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 relative z-10">
        {/* Controls */}
        <div className="space-y-6">
          {/* Prompt Input */}
          <div className="neuro-card rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Dimension Selection */}
            <div>
              <label className="block text-white font-bold text-lg mb-3">
                Choose Dimensions
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { name: 'Portrait', aspect: '9:16', width: 'w-4', height: 'h-6' },
                  { name: 'Landscape', aspect: '16:9', width: 'w-6', height: 'h-4' },
                  { name: 'Square', aspect: '1:1', width: 'w-5', height: 'h-5' }
                ].map((format) => (
                  <button
                    key={format.name}
                    onClick={() => setSelectedFormat(format.name)}
                    className={`group relative flex flex-col items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                      selectedFormat === format.name
                        ? 'gradient-logo text-white shadow-lg'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-600'
                    }`}
                  >
                    {/* Visual representation */}
                    <div className={`${format.width} ${format.height} rounded border transition-all duration-300 ${
                      selectedFormat === format.name
                        ? 'bg-white/20 border-white/40'
                        : 'bg-gray-600/50 border-gray-500 group-hover:border-gray-400'
                    }`}>
                    </div>
                    
                    {/* Label */}
                    <div className="text-center">
                      <div className="font-bold text-xs sm:text-sm">{format.name}</div>
                    </div>
                    
                    {/* Selected indicator */}
                    {selectedFormat === format.name && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <span className="text-orange-500 text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input with Button Inside */}
            <div>
              <label className="block text-white font-bold text-lg mb-3">
                Describe Your Vision
              </label>
              <div className="relative">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
                  placeholder="A futuristic cityscape at sunset with flying cars..."
                  className={`w-full bg-gray-800/50 border-gray-600 text-white text-base sm:text-lg font-medium rounded-2xl px-4 sm:px-6 py-4 pb-16 pr-4 sm:pr-32 resize-none min-h-[120px] focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700/50'
                  }`}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="absolute right-3 bottom-3 gradient-logo text-white font-bold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl hover:scale-105 transition-all duration-300 pulse-glow"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      ✨ Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Quick Tips */}
            <div className="text-sm text-gray-400">
              <p className="mb-1">💡 <span className="font-semibold text-gray-300">Quick tips:</span></p>
              <p>• Be specific about details, colors, and style</p>
              <p>• Mention lighting, mood, or artistic style</p>
              <p>• Generation takes ~2 minutes</p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Magic Scrolling Images - Desktop Only - Landing Page Style */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="hidden lg:block relative mb-16 overflow-hidden w-full -mt-20"
      >
        <div className="flex animate-slide-left space-x-6">
          {/* First set of images */}
          <div className="flex space-x-8 min-w-full">
            {scrollingImages.map((src, index) => (
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
            {scrollingImages.map((src, index) => (
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
      
      {/* Footer - In its own full space below image scroll */}
      <footer className="relative z-10 mt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center border-t border-gray-800 pt-8">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-white font-black text-lg tracking-tight">SirkupAI</span>
              <span className="gradient-text font-black text-lg tracking-tight">Vision</span>
            </div>
            <p className="text-gray-400 text-sm">
              Transforming imagination into reality with AI-powered image generation
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © 2024 SirkupAI Vision. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}