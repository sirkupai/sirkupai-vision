'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userDisplayName, setUserDisplayName] = useState('User')

  useEffect(() => {
    if (!supabase) return

    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user?.email) {
        // Extract first name from email (before @ symbol)
        const emailName = user.email.split('@')[0]
        // Capitalize first letter and clean up
        const displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1).replace(/[._-]/g, ' ')
        setUserDisplayName(displayName)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user?.email) {
        const emailName = session.user.email.split('@')[0]
        const displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1).replace(/[._-]/g, ' ')
        setUserDisplayName(displayName)
      } else {
        setUserDisplayName('User')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return (
    <header className="neuro-card border-0 border-b border-gray-800/50 px-6 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div>
              <span className="text-white font-black text-2xl tracking-tight">SirkupAI</span>
              <span className="gradient-text font-black text-2xl tracking-tight ml-1">Vision</span>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            <button className="gradient-text font-bold text-lg border-b-2 border-orange-400 pb-2 px-4 rounded-t-lg neuro-button">
              Images
            </button>
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white neuro-button font-semibold text-lg px-6 py-3 rounded-xl">
              <User className="h-4 w-4 mr-2" />
              Hi, {userDisplayName}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="neuro-card border-0">
            <DropdownMenuItem onClick={handleSignOut} className="text-white hover:gradient-logo font-semibold">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}