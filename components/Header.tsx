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
    <header className="neuro-card border-0 border-b border-gray-800/50 px-4 sm:px-6 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center">
            <div>
              <span className="text-white font-black text-lg sm:text-2xl tracking-tight">SirkupAI</span>
              <span className="gradient-text font-black text-lg sm:text-2xl tracking-tight ml-1">Vision</span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white neuro-button font-semibold text-sm sm:text-lg px-3 sm:px-6 py-2 sm:py-3 rounded-xl">
              <User className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Hi, </span>{userDisplayName}
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