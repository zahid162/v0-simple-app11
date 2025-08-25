"use client"

import { useState, useRef, useEffect } from "react"
import { Filter, ChevronLeft, ChevronRight, Sparkles, Palette, Moon, Sun, Zap, Camera, Star } from "lucide-react"
import { Button } from "../../../components/ui/button"

interface FilterToolProps {
  onPresetChange: (preset: string) => void
}

export default function FilterTool({ onPresetChange }: FilterToolProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [showApplied, setShowApplied] = useState<string | null>(null)
  
  const desktopFiltersContainerRef = useRef<HTMLDivElement>(null)
  const mobileFiltersContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const filters = [
    {
      id: "original",
      name: "Original",
      icon: Camera,
      color: "from-slate-500 to-slate-600",
      description: "No filter applied"
    },
    {
      id: "vintage",
      name: "Vintage",
      icon: Palette,
      color: "from-amber-500 to-orange-600",
      description: "Warm, nostalgic tones"
    },
    {
      id: "dramatic",
      name: "Dramatic",
      icon: Moon,
      color: "from-purple-500 to-indigo-600",
      description: "High contrast, moody"
    },
    {
      id: "soft",
      name: "Soft",
      icon: Sun,
      color: "from-pink-500 to-rose-500",
      description: "Gentle, dreamy look"
    },
    {
      id: "monochrome",
      name: "Monochrome",
      icon: Filter,
      color: "from-gray-500 to-slate-600",
      description: "Black and white style"
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk",
      icon: Zap,
      color: "from-cyan-500 to-blue-600",
      description: "Futuristic, neon vibes"
    },
    {
      id: "warm",
      name: "Warm",
      icon: Sun,
      color: "from-yellow-500 to-orange-500",
      description: "Golden, cozy tones"
    },
    {
      id: "cool",
      name: "Cool",
      icon: Moon,
      color: "from-blue-500 to-indigo-500",
      description: "Blue-tinted, calm"
    },
    {
      id: "bright",
      name: "Bright",
      icon: Star,
      color: "from-yellow-400 to-orange-400",
      description: "Luminous, vibrant"
    },
    {
      id: "dark",
      name: "Dark",
      icon: Moon,
      color: "from-gray-700 to-black",
      description: "Mysterious, shadowy"
    }
  ]

  const scrollFiltersLeft = () => {
    if (desktopFiltersContainerRef.current) {
      desktopFiltersContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollFiltersRight = () => {
    if (desktopFiltersContainerRef.current) {
      desktopFiltersContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  const checkScrollPosition = (containerRef: React.RefObject<HTMLDivElement | null>) => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    // Check initial scroll position for both containers
    checkScrollPosition(desktopFiltersContainerRef)
    checkScrollPosition(mobileFiltersContainerRef)
  }, [])

  const handleFilterClick = async (filterId: string) => {
    if (filterId === activeFilter) return // Don't reapply the same filter
    
    setIsApplying(true)
    setActiveFilter(filterId)
    
    // Remove previous filter and apply new one
    if (filterId === "original") {
      onPresetChange("reset") // Reset to original
    } else {
      onPresetChange(filterId) // Apply new filter
    }
    
    setIsApplying(false)
    setShowApplied(filterId)
    
    setTimeout(() => setShowApplied(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Filter Header */}
     

      {/* Filters Navigation */}
      <div className="relative">
        {/* Desktop: Show arrows on larger screens */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Left Arrow */}
          <button
            onClick={scrollFiltersLeft}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
              canScrollLeft
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                : 'bg-slate-50 text-slate-300 cursor-not-allowed'
            }`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Filters Container */}
          <div
            ref={desktopFiltersContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-3 flex-1"
            onScroll={() => checkScrollPosition(desktopFiltersContainerRef)}
          >
            {filters.map((filter) => {
              const IconComponent = filter.icon
              const isActive = activeFilter === filter.id
              const isApplyingFilter = isApplying && activeFilter === filter.id
              const showSuccess = showApplied === filter.id
              
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  disabled={isApplying}
                  className={`flex flex-col items-center space-y-2 p-1 md:p-2 rounded-xl transition-all duration-200 min-w-[80px] sm:min-w-[90px] lg:min-w-[100px] ${
                    isActive
                      ? "bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 shadow-lg scale-105"
                      : "hover:bg-slate-50 hover:shadow-md border border-slate-200"
                  } ${isApplyingFilter ? "opacity-75 cursor-wait" : ""}`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-10 lg:h-10 bg-gradient-to-br ${filter.color} rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 ${
                      isActive ? "scale-110" : ""
                    }`}
                  >
                    {showSuccess ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full"></div>
                      </div>
                    ) : isApplyingFilter ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    )}
                  </div>
                  
                  <div className="text-center space-y-1">
                    <span
                      className={`text-xs font-medium capitalize ${
                        isActive ? "text-purple-700" : "text-slate-700"
                      }`}
                    >
                      {filter.name}
                    </span>
                    {/* <p className="text-xs text-slate-500 hidden sm:block">
                      {filter.description}
                    </p> */}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollFiltersRight}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
              canScrollRight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                : 'bg-slate-50 text-slate-300 cursor-not-allowed'
            }`}
            disabled={!canScrollRight}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile: No arrows, just scrollable container with indicator */}
        <div className="md:hidden relative">
          <div
            ref={mobileFiltersContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-3 pb-2"
            onScroll={() => checkScrollPosition(mobileFiltersContainerRef)}
          >
            {filters.map((filter) => {
              const IconComponent = filter.icon
              const isActive = activeFilter === filter.id
              const isApplyingFilter = isApplying && activeFilter === filter.id
              const showSuccess = showApplied === filter.id
              
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  disabled={isApplying}
                  className={`flex flex-col items-center space-y-2 p-1 md:p-2 rounded-xl transition-all duration-200 min-w-[80px] sm:min-w-[90px] lg:min-w-[100px] ${
                    isActive
                      ? "bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 shadow-lg scale-105"
                      : "hover:bg-slate-50 hover:shadow-md border border-slate-200"
                  } ${isApplyingFilter ? "opacity-75 cursor-wait" : ""}`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-10 lg:h-10 bg-gradient-to-br ${filter.color} rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 ${
                      isActive ? "scale-110" : ""
                    }`}
                  >
                    {showSuccess ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full"></div>
                      </div>
                    ) : isApplyingFilter ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    )}
                  </div>
                  
                  <div className="text-center space-y-1">
                    <span
                      className={`text-xs font-medium capitalize ${
                        isActive ? "text-purple-700" : "text-slate-700"
                      }`}
                    >
                      {filter.name}
                    </span>
                    {/* <p className="text-xs text-slate-500 hidden sm:block">
                      {filter.description}
                    </p> */}
                  </div>
                </button>
              )
            })}
            
            {/* Mobile: Show "more" indicator if there are more filters */}
            {canScrollRight && (
              <div className="flex flex-col items-center justify-center min-w-[80px] p-1 rounded-xl border border-slate-200 bg-slate-50">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-medium text-slate-600 mt-1">More</span>
              </div>
            )}
          </div>
          
          {/* Mobile: Bottom scroll indicator line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{
                width: `${Math.min(100, (mobileFiltersContainerRef.current?.scrollLeft || 0) / (mobileFiltersContainerRef.current?.scrollWidth || 1) * 100)}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter Info */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-semibold text-slate-800">
              {activeFilter ? `Active: ${filters.find(f => f.id === activeFilter)?.name}` : "No filter active"}
            </h5>
            <p className="text-xs text-slate-600">
              {activeFilter 
                ? filters.find(f => f.id === activeFilter)?.description 
                : "Select a filter to apply to your image"
              }
            </p>
          </div>
          {activeFilter && activeFilter !== "original" && (
            <Button
              onClick={() => handleFilterClick("original")}
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Remove Filter
            </Button>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
} 