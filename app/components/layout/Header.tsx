"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "../../../components/ui/button"
import {
  Sparkles,
  Palette,
  Menu,
  X,
  Upload,
  RotateCcw,
  Layers,
  Zap,
  Shield,
} from "lucide-react"

// Add hydration safety
const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

interface HeaderProps {
  title?: string
  subtitle?: string
  showActions?: boolean
  onReplacePhoto?: () => void
  onReset?: () => void
  showBackButton?: boolean
}

export default function Header({
  title = "PhotoEdit Pro",
  subtitle = "AI-Powered Photo Editor",
  showActions = false,
  onReplacePhoto,
  onReset,
  showBackButton = false,
}: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [scrollY, setScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const hydrated = useHydrated()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle mobile menu body scroll lock
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [mobileMenuOpen])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const scrollToSection = (sectionId: string) => {
    closeMobileMenu()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const isHomePage = pathname === "/"

  // Don't render until hydrated to prevent hydration mismatches
  if (!hydrated) {
    return (
      <header className="relative z-50 transition-all duration-300 bg-background/95 backdrop-blur-xl border-b border-slate-200/50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl"></div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">{subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      {/* Header */}
      <header className={`relative z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-background/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 transform group-hover:scale-105">
                  <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>

            {/* Desktop Navigation - Only show on home page */}
            {isHomePage && (
              <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                <a href="#features" className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                  Features
                </a>
                <a href="#how-it-works" className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                  How it Works
                </a>
                <a href="#templates" className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                  Templates
                </a>
                <a href="#faq" className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                  FAQ
                </a>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 text-sm px-3 py-2"
                >
                  Sign Up
                </Button>
              </nav>
            )}

            {/* Action Buttons - Show when provided */}
            {showActions && (
              <div className="hidden sm:flex items-center space-x-2 sm:space-x-3">
                {onReplacePhoto && (
                  <button
                    onClick={onReplacePhoto}
                    className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-slate-700 rounded-lg sm:rounded-xl font-medium hover:bg-slate-50 transition-all duration-200 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md text-xs sm:text-sm"
                  >
                    <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Replace</span>
                  </button>
                )}
                {onReset && (
                  <button
                    onClick={onReset}
                    className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl font-medium hover:bg-slate-200 transition-all duration-200 text-xs sm:text-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-all duration-200 rounded-lg hover:bg-slate-100 hover:shadow-md transform hover:scale-105"
              aria-label="Toggle mobile menu"
            >
              <div className={`transition-transform duration-200 ${mobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
                <Menu className="w-6 h-6" />
              </div>
            </button>
          </div>

          {/* Subtitle - Show when provided and not on home page */}
          {!isHomePage && subtitle && (
            <div className="mt-3 sm:mt-4">
              <p className="text-xs sm:text-sm text-slate-500">
                {subtitle}
              </p>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
              mobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeMobileMenu}
          />
          
          {/* Sliding Menu */}
          <div className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background/95 backdrop-blur-xl shadow-2xl border-l border-slate-200/50 transform transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {title}
                  </h2>
                  <p className="text-xs text-slate-500">Navigation Menu</p>
                </div>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-200"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="p-6 space-y-2">
              {isHomePage ? (
                <>
                  <a 
                    href="#features" 
                    onClick={() => scrollToSection('features')}
                    className="flex items-center gap-3 p-4 text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-200 font-medium group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Layers className="w-5 h-5 text-purple-600" />
                    </div>
                    <span>Features</span>
                  </a>
                  <a 
                    href="#how-it-works" 
                    onClick={() => scrollToSection('how-it-works')}
                    className="flex items-center gap-3 p-4 text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 rounded-xl transition-all duration-200 font-medium group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <span>How it Works</span>
                  </a>
                  <a 
                    href="#templates" 
                    onClick={() => scrollToSection('templates')}
                    className="flex items-center gap-3 p-4 text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 rounded-xl transition-all duration-200 font-medium group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Palette className="w-5 h-5 text-pink-600" />
                    </div>
                    <span>Templates</span>
                  </a>
                  <a 
                    href="#faq" 
                    onClick={() => scrollToSection('faq')}
                    className="flex items-center gap-3 p-4 text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all duration-200 font-medium group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <span>FAQ</span>
                  </a>
                  
                  {/* Divider */}
                  <div className="border-t border-slate-200 my-6" />
                  
                  {/* CTA Button */}
                  <Button
                    onClick={closeMobileMenu}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg text-white font-medium py-4 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  {/* Back to Home */}
                  <button
                    onClick={() => {
                      closeMobileMenu()
                      router.push("/")
                    }}
                    className="w-full flex items-center gap-3 p-4 text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 rounded-xl transition-all duration-200 font-medium group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Sparkles className="w-5 h-5 text-slate-600" />
                    </div>
                    <span>Back to Home</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}
