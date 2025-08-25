"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import {
  Upload,
  Sparkles,
  Zap,
  Shield,
  Cpu,
  Check,
  ArrowRight,
  Users,
  Download,
  Palette,
  Layers,
  Filter,
  Star,
  Clock,
  Globe,
  Award,
} from "lucide-react"

export default function HomePage() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleContinue = () => {
    if (selectedFile && previewUrl) {
      sessionStorage.setItem("selectedImage", previewUrl)
      sessionStorage.setItem("selectedImageName", selectedFile.name)
      router.push("/adjust")
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Geometric Shapes */}
        <div 
          className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="absolute top-40 right-20 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-bl from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        <div 
          className="absolute bottom-40 left-1/4 w-56 h-56 sm:w-80 sm:h-80 bg-gradient-to-tr from-pink-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '4s' }}
        />
        
        {/* Additional Geometric Elements */}
        <div 
          className="absolute top-1/3 left-1/6 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-br from-cyan-500/8 to-blue-500/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/6 w-32 h-32 sm:w-56 sm:h-56 bg-gradient-to-tl from-emerald-500/8 to-teal-500/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '3s' }}
        />
        
        {/* Modern Clip Path Shapes */}
        <div 
          className="absolute top-0 right-0 w-1/2 sm:w-1/3 h-1/2 sm:h-1/3 opacity-5"
          style={{
            clipPath: "polygon(100% 0, 0 0, 100% 100%)",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-1/3 sm:w-1/4 h-1/3 sm:h-1/4 opacity-5"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 0 0)",
            background: "linear-gradient(-45deg, #f093fb 0%, #f5576c 100%)",
          }}
        />
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 sm:w-3 sm:h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-2/3 right-1/3 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-1/4 right-1/5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '3.5s' }} />
        
        {/* Modern Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />
            </div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 xl:py-36">
        {/* Hero Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Modern Clip Path Overlays */}
          <div 
            className="absolute top-0 right-0 w-3/4 sm:w-1/2 h-full opacity-5"
            style={{
              clipPath: "polygon(100% 0, 0 0, 100% 100%, 70% 100%)",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          />
          <div 
            className="absolute bottom-0 left-0 w-1/2 sm:w-1/3 h-1/2 opacity-5"
            style={{
              clipPath: "polygon(0 100%, 100% 100%, 0 0, 30% 50%)",
              background: "linear-gradient(-45deg, #f093fb 0%, #f5576c 100%)",
            }}
          />
          <div
            className="absolute top-1/4 left-0 w-1/3 sm:w-1/4 h-1/3 opacity-5"
            style={{
              clipPath: "polygon(0 0, 100% 0, 0 100%, 50% 75%)",
              background: "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)",
            }}
          />
          
          {/* Geometric Accent Shapes */}
          <div className="absolute top-20 right-20 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tl from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute top-1/2 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div
              className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <Badge
                variant="secondary"
                className="mb-6 sm:mb-8 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium backdrop-blur-sm"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                AI-Powered Photo Editor
              </Badge>

              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold mb-6 sm:mb-8 leading-tight">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Just AI Profile
                </span>
                <br />
                <span className="text-foreground">Picture Maker</span>
              </h2>

              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-light px-2">
                Transform your photos into stunning profile pictures with our advanced AI technology. 
                Professional results in seconds, not hours.
              </p>

              <div className="mb-12 sm:mb-16">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 lg:px-10 py-6 sm:py-7 lg:py-8 text-lg sm:text-xl font-semibold rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 sm:mr-3 relative z-10" />
                  <span className="relative z-10">Upload your photo</span>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex justify-center items-center gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
                <div className="text-center group">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2 group-hover:text-purple-600 transition-colors duration-300">100k+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Happy Users</div>
                </div>
                <div className="w-px h-8 sm:h-12 bg-border"></div>
                <div className="text-center group">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2 group-hover:text-pink-600 transition-colors duration-300">4.9</div>
                  <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    Rating
                  </div>
                </div>
                <div className="w-px h-8 sm:h-12 bg-border"></div>
                <div className="text-center group">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors duration-300">30s</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Processing Time</div>
                </div>
              </div>

              {/* Profile Picture Examples */}
              <div className="flex justify-center gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative group">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 p-1 shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 transform group-hover:scale-110">
                      <div className="w-full h-full rounded-lg sm:rounded-xl bg-background flex items-center justify-center">
                        <Users className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Background Clip Path */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-muted/50 to-transparent"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 100% 0, 85% 50%, 0 0)",
          }}
        />
        
        {/* Additional Hero Clip Paths */}
        <div 
          className="absolute bottom-0 left-0 w-1/2 sm:w-1/3 h-16 sm:h-24 bg-gradient-to-t from-blue-500/10 to-transparent"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 0 0, 50% 50%)",
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-1/3 sm:w-1/4 h-12 sm:h-20 bg-gradient-to-t from-pink-500/10 to-transparent"
          style={{
            clipPath: "polygon(100% 100%, 0 100%, 100% 0, 75% 50%)",
          }}
        />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-muted/20 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 15% 85%, 0 100%)",
            background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
          }}
        />
        
        {/* Additional Clip Paths */}
        <div 
          className="absolute top-0 right-0 w-1/2 sm:w-1/3 h-1/2 opacity-5"
          style={{
            clipPath: "polygon(100% 0, 0 0, 100% 100%, 70% 100%)",
            background: "linear-gradient(-45deg, #f093fb 0%, #f5576c 100%)",
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-1/3 sm:w-1/4 h-1/3 opacity-5"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 0 0, 50% 50%)",
            background: "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)",
          }}
        />
        
        {/* Geometric Accent Shapes */}
        <div className="absolute top-10 right-10 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tl from-purple-500/15 to-pink-500/15 rounded-lg animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-md animate-pulse" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <Badge variant="secondary" className="mb-3 sm:mb-4 bg-blue-100 text-blue-700 border-blue-200 backdrop-blur-sm text-xs sm:text-sm px-3 py-1.5">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Simple Process
            </Badge>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4 sm:mb-6">How PhotoEdit Pro Works</h3>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">Four simple steps to create your perfect profile picture</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {[
              {
                step: "1",
                title: "Upload your photo",
                description: "Select and upload your photo in common image formats",
                icon: Upload,
                color: "from-green-500 to-emerald-500",
                delay: "0s",
              },
              {
                step: "2",
                title: "Remove background with AI",
                description: "Our AI automatically removes the background from your photo with precision",
                icon: Cpu,
                color: "from-yellow-500 to-orange-500",
                delay: "0.2s",
              },
              {
                step: "3",
                title: "Select pictures and save",
                description: "Choose from AI-generated backgrounds, then download your new profile picture",
                icon: Palette,
                color: "from-purple-500 to-pink-500",
                delay: "0.4s",
              },
              {
                step: "4",
                title: "Need to edit? No problem",
                description: "Use our advanced editing tools with our advanced editing tools and filters",
                icon: Filter,
                color: "from-pink-500 to-red-500",
                delay: "0.6s",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-0 bg-background/80 backdrop-blur-sm"
                style={{ animationDelay: item.delay }}
              >
                {/* Card Background Effects */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Card Border Glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                
                <CardContent className="p-6 sm:p-8 relative z-10">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-2xl`}
                  >
                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div
                    className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r ${item.color} text-white font-bold text-sm sm:text-lg mb-4 sm:mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300`}
                  >
                    {item.step}
                  </div>
                  <h4 className="font-heading font-semibold text-lg sm:text-xl mb-3 sm:mb-4 text-foreground group-hover:text-foreground transition-colors duration-300">{item.title}</h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Section Bottom Clip Path */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-12 sm:h-20 bg-gradient-to-t from-background to-transparent"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 85% 0, 15% 0)",
          }}
        />
      </section>

      {/* Why Choose Section */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            clipPath: "polygon(0 0, 85% 0, 100% 100%, 0 85%)",
            background: "linear-gradient(-45deg, #667eea 0%, #764ba2 100%)",
          }}
        />
        
        {/* Additional Clip Paths */}
        <div 
          className="absolute top-0 right-0 w-3/4 sm:w-1/2 h-1/2 opacity-5"
          style={{
            clipPath: "polygon(100% 0, 0 0, 100% 100%, 50% 100%)",
            background: "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-1/2 sm:w-1/3 h-1/2 opacity-5"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 0 0, 70% 50%)",
            background: "linear-gradient(-135deg, #4facfe 0%, #00f2fe 100%)",
          }}
        />
        <div 
          className="absolute top-1/3 left-1/4 w-1/3 sm:w-1/4 h-1/3 opacity-5"
          style={{
            clipPath: "polygon(0 0, 100% 0, 0 100%, 50% 75%)",
            background: "linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)",
          }}
        />
        
        {/* Geometric Accent Shapes */}
        <div className="absolute top-20 right-20 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500/15 to-emerald-500/15 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tl from-blue-500/15 to-cyan-500/15 rounded-lg animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-md animate-pulse" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <Badge variant="secondary" className="mb-3 sm:mb-4 bg-green-100 text-green-700 border-green-200 backdrop-blur-sm text-xs sm:text-sm px-3 py-1.5">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Why Choose Us
            </Badge>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4 sm:mb-6">Why Choose PhotoEdit Pro?</h3>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">Professional results in seconds, not hours</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Lightning Fast",
                description: "Get your professional profile picture in under 30 seconds with our optimized AI processing",
                icon: Zap,
                color: "from-blue-500 to-cyan-500",
                features: ["30-second processing", "Real-time preview", "Instant download"],
              },
              {
                title: "100% Private",
                description: "Your photos are automatically deleted after processing and are never stored permanently",
                icon: Shield,
                color: "from-green-500 to-emerald-500",
                features: ["Auto-deletion", "No storage", "Privacy first"],
              },
              {
                title: "AI Powered",
                description: "Advanced AI technology for perfect background removal and enhancement",
                icon: Cpu,
                color: "from-purple-500 to-pink-500",
                features: ["Smart detection", "Precise removal", "Quality enhancement"],
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="text-center group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-0 bg-background/80 backdrop-blur-sm relative overflow-hidden"
              >
                {/* Card Background Effects */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Card Border Glow */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                
                <CardContent className="p-6 sm:p-8 relative z-10">
                  <div
                    className={`w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-2xl`}
                  >
                    <item.icon className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white" />
                  </div>
                  <h4 className="font-heading font-semibold text-xl sm:text-2xl mb-3 sm:mb-4 text-foreground group-hover:text-foreground transition-colors duration-300">{item.title}</h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6 group-hover:text-foreground/80 transition-colors duration-300">{item.description}</p>
                  <ul className="space-y-2 sm:space-y-3">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Section Bottom Clip Path */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-background to-transparent"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 90% 0, 10% 0)",
          }}
        />
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 bg-muted/20 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 85%)",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        />
        
        {/* Additional Clip Paths */}
        <div 
          className="absolute top-0 left-0 w-1/2 sm:w-1/3 h-1/2 opacity-5"
          style={{
            clipPath: "polygon(0 0, 100% 0, 0 100%, 30% 50%)",
            background: "linear-gradient(-45deg, #f093fb 0%, #f5576c 100%)",
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-3/4 sm:w-1/2 h-1/3 opacity-5"
          style={{
            clipPath: "polygon(100% 100%, 0 100%, 100% 0, 70% 50%)",
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          }}
        />
        <div 
          className="absolute top-1/2 right-1/4 w-1/3 sm:w-1/4 h-1/4 opacity-5"
          style={{
            clipPath: "polygon(100% 0, 0 0, 100% 100%, 50% 75%)",
            background: "linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)",
          }}
        />
        
        {/* Geometric Accent Shapes */}
        <div className="absolute top-20 left-20 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tl from-blue-500/15 to-cyan-500/15 rounded-lg animate-pulse" />
        <div className="absolute top-1/3 left-1/3 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500/15 to-emerald-500/15 rounded-full blur-md animate-pulse" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <Badge variant="secondary" className="mb-3 sm:mb-4 bg-purple-100 text-purple-700 border-purple-200 backdrop-blur-sm text-xs sm:text-sm px-3 py-1.5">
              <Layers className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Advanced Features
            </Badge>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4 sm:mb-6">Advanced Photo Editing Features</h3>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">Professional tools at your fingertips</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {[
              {
                title: "Dual-Layer System",
                description: "Work with transparent images and backgrounds separately for maximum control",
                icon: Layers,
                features: ["Transparent image layer", "Custom background layer", "Independent editing"],
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "Advanced Filters",
                description: "Apply professional filters, shadows, outlines, and effects to your images",
                icon: Filter,
                features: ["20+ filter presets", "Custom shadow effects", "Gradient outlines"],
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Easy Export",
                description: "Download your edited images in high quality with transparent backgrounds preserved",
                icon: Download,
                features: ["Multiple formats", "High resolution", "Transparent backgrounds"],
                color: "from-green-500 to-emerald-500",
              },
            ].map((item, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-0 bg-background/80 backdrop-blur-sm relative overflow-hidden">
                {/* Card Background Effects */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Card Border Glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                
                <CardContent className="p-6 sm:p-8 relative z-10">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-2xl`}>
                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h4 className="font-heading font-semibold text-xl sm:text-2xl mb-3 sm:mb-4 text-foreground group-hover:text-foreground transition-colors duration-300">{item.title}</h4>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">{item.description}</p>
                  <ul className="space-y-2 sm:space-y-3">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm group-hover:text-foreground/70 transition-colors duration-300">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                        <span className="text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Section Bottom Clip Path */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 80% 0, 20% 0)",
          }}
        />
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>
        
        {/* Multiple Clip Path Overlays */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 85%)",
            background: "linear-gradient(45deg, #ffffff 0%, #f0f0f0 100%)",
          }}
        ></div>
        <div
          className="absolute top-0 right-0 w-3/4 sm:w-1/2 h-1/2 opacity-15"
          style={{
            clipPath: "polygon(100% 0, 0 0, 100% 100%, 50% 100%)",
            background: "linear-gradient(-45deg, #ffffff 0%, #e0e0e0 100%)",
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-1/2 sm:w-1/3 h-1/2 opacity-15"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 0 0, 70% 50%)",
            background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
          }}
        ></div>

        {/* Geometric Accent Shapes */}
        <div className="absolute top-20 right-20 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-20 h-20 sm:w-28 sm:h-28 bg-white/10 rounded-xl animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-lg animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-xl animate-pulse" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center text-white">
            <Badge variant="secondary" className="mb-4 sm:mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs sm:text-sm px-3 py-1.5">
              <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Ready to Start?
            </Badge>
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 sm:mb-8">Ready to create amazing photos?</h3>
            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed px-2">
              Join thousands of users who trust PhotoEdit Pro for their professional photo editing needs. 
              Start creating stunning profile pictures today.
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-6 sm:px-8 lg:px-10 py-6 sm:py-7 lg:py-8 text-lg sm:text-xl font-semibold rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Get Started Now</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ml-2 sm:ml-3 relative z-10" />
            </Button>
          </div>
        </div>
        
        {/* Section Bottom Clip Path */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-muted/50 to-transparent"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 100% 0, 85% 50%, 0 0)",
          }}
        />
        
        {/* Additional Hero Clip Paths */}
        <div 
          className="absolute bottom-0 left-0 w-1/2 sm:w-1/3 h-16 sm:h-24 bg-gradient-to-t from-blue-500/10 to-transparent"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 0 0, 50% 50%)",
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-1/3 sm:w-1/4 h-12 sm:h-20 bg-gradient-to-t from-pink-500/10 to-transparent"
          style={{
            clipPath: "polygon(100% 100%, 0 100%, 100% 0, 75% 50%)",
          }}
        />
      </section>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />

      {/* Upload Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <Card className="max-w-sm sm:max-w-md w-full border-0 shadow-2xl bg-background/95 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="flex justify-center">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-xs max-h-40 sm:max-h-48 object-contain rounded-xl sm:rounded-2xl shadow-lg"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-lg sm:text-xl font-semibold text-foreground">{selectedFile?.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    Ready to edit • {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewUrl(null)
                    }}
                    className="flex-1 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleContinue} 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2"
                  >
                    Continue to Edit
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <Footer />
    </div>
  )
}
