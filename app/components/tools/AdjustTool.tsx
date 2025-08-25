"use client"

import { useState, useEffect, useRef } from "react"
import { Slider } from "../../../components/ui/slider"
import { Button } from "../../../components/ui/button"
import { ImageEffects } from "../../types/image"
import { Save, RotateCcw, Check, X, Sun, Palette, Sparkles } from "lucide-react"

interface AdjustToolProps {
  imageEffects: ImageEffects
  onSliderChange: (property: keyof ImageEffects, value: number | boolean) => void
  onPresetChange: (preset: string) => void
  onSaveChanges: (newEffects: ImageEffects) => void
}

export default function AdjustTool({ imageEffects, onSliderChange, onPresetChange, onSaveChanges }: AdjustToolProps) {
  const [localEffects, setLocalEffects] = useState(imageEffects)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [savedStates, setSavedStates] = useState<Record<string, Partial<ImageEffects>>>({})
  const [showSaved, setShowSaved] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState<string | null>(null)

  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const tabs = [
    {
      id: "basic",
      name: "Basic",
      icon: Sun,
      color: "from-blue-500 to-cyan-500",
      adjustments: [
        { key: "brightness", label: "Brightness", min: 0, max: 200, step: 1, unit: "%" },
        { key: "contrast", label: "Contrast", min: 0, max: 200, step: 1, unit: "%" },
        { key: "saturation", label: "Saturation", min: 0, max: 200, step: 1, unit: "%" },
        { key: "blur", label: "Blur", min: 0, max: 20, step: 0.5, unit: "px" }
      ]
    },
    {
      id: "advanced",
      name: "Advanced",
      icon: Palette,
      color: "from-purple-500 to-pink-500",
      adjustments: [
        { key: "hue", label: "Hue", min: -180, max: 180, step: 1, unit: "°" },
        { key: "sepia", label: "Sepia", min: 0, max: 100, step: 1, unit: "%" },
        { key: "grayscale", label: "Grayscale", min: 0, max: 100, step: 1, unit: "%" },
        { key: "invert", label: "Invert", min: 0, max: 100, step: 1, unit: "%" }
      ]
    },
    {
      id: "ai",
      name: "AI-Powered",
      icon: Sparkles,
      color: "from-indigo-500 to-purple-500",
      adjustments: [
        { key: "vibrance", label: "Vibrance", min: 0, max: 100, step: 1, unit: "%" },
        { key: "exposure", label: "Exposure", min: -50, max: 50, step: 1, unit: "" },
        { key: "highlights", label: "Highlights", min: -100, max: 100, step: 1, unit: "" },
        { key: "shadows", label: "Shadows", min: -100, max: 100, step: 1, unit: "" },
        { key: "temperature", label: "Temperature", min: -100, max: 100, step: 1, unit: "" },
        { key: "tint", label: "Tint", min: -100, max: 100, step: 1, unit: "" }
      ]
    }
  ]

  // Type guard to check if a property is numeric
  const isNumericProperty = (key: string): key is keyof Pick<ImageEffects, 'brightness' | 'contrast' | 'saturation' | 'blur' | 'hue' | 'sepia' | 'grayscale' | 'invert' | 'vibrance' | 'exposure' | 'highlights' | 'shadows' | 'temperature' | 'tint'> => {
    return ['brightness', 'contrast', 'saturation', 'blur', 'hue', 'sepia', 'grayscale', 'invert', 'vibrance', 'exposure', 'highlights', 'shadows', 'temperature', 'tint'].includes(key)
  }

  // Update local effects when imageEffects prop changes
  useEffect(() => {
    setLocalEffects(imageEffects)
  }, [imageEffects])

  const handleLocalChange = (property: keyof ImageEffects, value: number | boolean) => {
    if (isNumericProperty(property)) {
      setLocalEffects(prev => ({ ...prev, [property]: value }))
      
      // Apply changes live to the canvas for preview
      onSliderChange(property, value)
    }
  }

  const handleSaveTab = async (tabId: string) => {
    setIsSaving(tabId)
    
    // Save current state for this tab
    const tabAdjustments = tabs.find(tab => tab.id === tabId)?.adjustments || []
    const tabState: Partial<ImageEffects> = {}
    
    tabAdjustments.forEach(adj => {
      if (isNumericProperty(adj.key)) {
        tabState[adj.key] = localEffects[adj.key]
      }
    })
    
    setSavedStates(prev => ({ ...prev, [tabId]: tabState }))
    
    // Apply changes to parent
    onSaveChanges(localEffects)
    
    setIsSaving(null)
    setShowSaved(tabId)
    
    setTimeout(() => setShowSaved(null), 2000)
  }

  const handleResetTab = (tabId: string) => {
    const savedState = savedStates[tabId]
    if (savedState) {
      // Reset to saved state for this tab
      setLocalEffects(prev => ({ ...prev, ...savedState }))
    } else {
      // Reset to original imageEffects for this tab
      const tabAdjustments = tabs.find(tab => tab.id === tabId)?.adjustments || []
      const resetState: Partial<ImageEffects> = {}
      
      tabAdjustments.forEach(adj => {
        if (isNumericProperty(adj.key)) {
          resetState[adj.key] = imageEffects[adj.key]
        }
      })
      
      setLocalEffects(prev => ({ ...prev, ...resetState }))
    }
  }

  const scrollTabsLeft = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollTabsRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  const checkScrollPosition = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const resetToDefaults = () => {
    const defaultEffects: ImageEffects = {
      ...imageEffects,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      hue: 0,
      sepia: 0,
      grayscale: 0,
      invert: 0,
      vibrance: 60,
      exposure: -6,
      highlights: 62,
      shadows: 0,
      temperature: 0,
      tint: 0
    }
    setLocalEffects(defaultEffects)
    
    // Apply defaults live
    Object.entries(defaultEffects).forEach(([key, value]) => {
      onSliderChange(key as keyof ImageEffects, value)
    })
  }

  const currentTab = tabs.find(t => t.id === activeTab)

  return (
    <div className="space-y-3">
      {/* Tab Selection - Slides out when content is shown */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          activeTab
            ? "transform -translate-y-full opacity-0 absolute pointer-events-none"
            : "transform translate-y-0 opacity-100 relative"
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-700">Adjustment Categories</h4>
            <div className="flex space-x-1">
              <button 
                onClick={scrollTabsLeft}
                className={`p-1 rounded transition-colors ${
                  canScrollLeft 
                    ? 'text-slate-600 hover:text-slate-900' 
                    : 'text-slate-300 cursor-not-allowed'
                }`}
                disabled={!canScrollLeft}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={scrollTabsRight}
                className={`p-1 rounded transition-colors ${
                  canScrollRight 
                    ? 'text-slate-600 hover:text-slate-900' 
                    : 'text-slate-300 cursor-not-allowed'
                }`}
                disabled={!canScrollRight}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide" ref={tabsContainerRef} onScroll={checkScrollPosition}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 min-w-[80px] flex-shrink-0 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 shadow-md scale-105"
                      : "bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`w-8 h-8 bg-gradient-to-br ${tab.color} rounded-lg flex items-center justify-center shadow-sm mb-2 transition-all duration-200 ${
                      activeTab === tab.id ? "scale-110" : ""
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-xs font-medium text-center ${
                    activeTab === tab.id ? "text-purple-700" : "text-slate-700"
                  }`}>
                    {tab.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content - Slides in when tab is selected */}
      {activeTab && (
        <div
          className={`transition-all duration-300 ease-in-out ${
            activeTab
              ? "transform translate-y-0 opacity-100"
              : "transform translate-y-full opacity-0"
          }`}
        >
          <div className="bg-white rounded-xl p-4 border border-slate-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-sm font-semibold text-slate-800">
                {currentTab?.name} Adjustments
              </h5>
              <button
                onClick={() => setActiveTab(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Adjustments Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {currentTab?.adjustments.map((adjustment) => {
                const value = localEffects[adjustment.key as keyof ImageEffects]
                const numericValue = isNumericProperty(adjustment.key) && typeof value === 'number' ? value : 0
                
                return (
                  <div key={adjustment.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-700">
                        {adjustment.label}
                      </label>
                      <span className="text-xs text-slate-500 font-mono">
                        {numericValue}{adjustment.unit}
                      </span>
                    </div>
                    <Slider
                      value={[numericValue]}
                      onValueChange={(value) => handleLocalChange(adjustment.key as keyof ImageEffects, value[0])}
                      max={adjustment.max}
                      min={adjustment.min}
                      step={adjustment.step}
                      className="w-full"
                    />
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => handleSaveTab(activeTab)}
                disabled={isSaving === activeTab}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                size="sm"
              >
                {showSaved === activeTab ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : isSaving === activeTab ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save {currentTab?.name}
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleResetTab(activeTab)}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset {currentTab?.name}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Global Reset Button */}
      <div className="pt-3 border-t border-slate-200">
        <Button
          onClick={resetToDefaults}
          variant="ghost"
          className="w-full text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          size="sm"
        >
          Reset All to Defaults
        </Button>
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
