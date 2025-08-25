"use client"

import { useState } from "react"
import { Label } from "../../../components/ui/label"
import { Slider } from "../../../components/ui/slider"
import { Button } from "../../../components/ui/button"
import { BackgroundData } from "../../types/image"
import { Palette, RotateCcw, Save, Check, X, Droplets, Image as ImageIcon, Layers, Sparkles } from "lucide-react"

interface BackgroundToolProps {
  backgroundData: BackgroundData
  onBackgroundChange: (property: keyof BackgroundData, value: any) => void
}

export default function BackgroundTool({ backgroundData, onBackgroundChange }: BackgroundToolProps) {
  const [localBackground, setLocalBackground] = useState(backgroundData)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [activeType, setActiveType] = useState<string | null>(null)

  const handleLocalChange = (property: keyof BackgroundData, value: any) => {
    const newBackground = { ...localBackground, [property]: value }
    setLocalBackground(newBackground)
    
    // Apply changes live to the canvas for preview
    onBackgroundChange(property, value)
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    // Apply all local changes
    Object.entries(localBackground).forEach(([key, value]) => {
      onBackgroundChange(key as keyof BackgroundData, value)
    })

    setIsSaving(false)
    setShowSaved(true)
    
    setTimeout(() => setShowSaved(false), 2000)
  }

  const handleReset = () => {
    setLocalBackground(backgroundData)
    // Reset to original background settings
    Object.entries(backgroundData).forEach(([key, value]) => {
      onBackgroundChange(key as keyof BackgroundData, value)
    })
  }

  const resetToDefaults = () => {
    const defaultBackground: BackgroundData = {
      type: "color",
      color: "#ffffff",
    }
    setLocalBackground(defaultBackground)
    
    // Apply default background settings
    Object.entries(defaultBackground).forEach(([key, value]) => {
      onBackgroundChange(key as keyof BackgroundData, value)
    })
  }

  const backgroundTypes = [
    { 
      id: "color", 
      name: "Color", 
      icon: Palette, 
      color: "from-blue-500 to-cyan-500",
      description: "Solid color background" 
    },
    { 
      id: "gradient", 
      name: "Gradient", 
      icon: Droplets, 
      color: "from-purple-500 to-pink-500",
      description: "Beautiful gradient background" 
    },
    { 
      id: "pattern", 
      name: "Pattern", 
      icon: Layers, 
      color: "from-orange-500 to-red-500",
      description: "Geometric pattern background" 
    },
    { 
      id: "image", 
      name: "Image", 
      icon: ImageIcon, 
      color: "from-teal-500 to-blue-500",
      description: "Custom image background" 
    }
  ]

  const colorPresets = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
    "#FFA500", "#800080", "#008000", "#FFC0CB", "#FFD700", "#32CD32", "#FF6347", "#87CEEB"
  ]

  const gradientPresets = [
    { name: "Sunset", colors: ["#FF6B6B", "#4ECDC4"] },
    { name: "Ocean", colors: ["#667eea", "#764ba2"] },
    { name: "Forest", colors: ["#11998e", "#38ef7d"] },
    { name: "Fire", colors: ["#f093fb", "#f5576c"] },
    { name: "Sky", colors: ["#4facfe", "#00f2fe"] },
    { name: "Purple", colors: ["#a8edea", "#fed6e3"] }
  ]

  const patternPresets = [
    { name: "Dots", pattern: "radial-gradient(circle, #000 1px, transparent 1px)", scale: 20 },
    { name: "Lines", pattern: "repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 10px)", scale: 10 },
    { name: "Grid", pattern: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", scale: 20 },
    { name: "Hexagons", pattern: "radial-gradient(circle at 50% 50%, #000 2px, transparent 2px)", scale: 30 }
  ]

  const currentType = backgroundTypes.find(t => t.id === localBackground.type)

  return (
    <div className="space-y-3">
      {/* Background Type Selection - Slides out when content is shown */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          activeType
            ? "transform -translate-y-full opacity-0 absolute pointer-events-none"
            : "transform translate-y-0 opacity-100 relative"
        }`}
      >
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-700">Background Type</Label>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {backgroundTypes.map((type) => {
              const IconComponent = type.icon
              const isActive = localBackground.type === type.id
              
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    handleLocalChange("type", type.id)
                    setActiveType(type.id)
                  }}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-[60px] sm:min-w-[70px] ${
                    isActive
                      ? "bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 shadow-md scale-105"
                      : "bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center shadow-sm mb-1 transition-all duration-200 ${
                      isActive ? "scale-110" : ""
                    }`}
                  >
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className={`text-xs font-medium text-center ${
                    isActive ? "text-purple-700" : "text-slate-700"
                  }`}>
                    {type.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Background Content - Slides in when type is selected */}
      {activeType && (
        <div
          className={`transition-all duration-300 ease-in-out ${
            activeType
              ? "transform translate-y-0 opacity-100"
              : "transform translate-y-full opacity-0"
          }`}
        >
          <div className="bg-white rounded-xl p-4 border border-slate-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-sm font-semibold text-slate-800">
                {currentType?.name} Background Settings
              </h5>
              <button
                onClick={() => setActiveType(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Color Background */}
            {localBackground.type === "color" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-700">Background Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localBackground.color || "#ffffff"}
                      onChange={(e) => handleLocalChange("color", e.target.value)}
                      className="w-10 h-8 rounded-lg border border-slate-300 cursor-pointer shadow-sm"
                    />
                    <input
                      type="text"
                      value={localBackground.color || "#ffffff"}
                      onChange={(e) => handleLocalChange("color", e.target.value)}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded-lg text-xs font-mono shadow-sm"
                      placeholder="#ffffff"
                    />
                  </div>
                  
                  {/* Color Presets */}
                  <div className="grid grid-cols-8 gap-1">
                    {colorPresets.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleLocalChange("color", color)}
                        className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition-transform shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Gradient Background */}
            {localBackground.type === "gradient" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                      { id: "linear", name: "Linear" },
                      { id: "radial", name: "Radial"},
                      { id: "conic", name: "Conic" }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleLocalChange("gradient", { 
                          ...localBackground.gradient, 
                          type: type.id as "linear" | "radial" | "conic"
                        })}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex-shrink-0 min-w-[70px] ${
                          localBackground.gradient?.type === type.id
                            ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        <div className="font-medium">{type.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-700">Gradient Colors</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-xs text-slate-600">Color 1</span>
                      <div className="flex items-center space-x-1">
                        <input
                          type="color"
                          value={localBackground.gradient?.colors?.[0] || "#FF6B6B"}
                          onChange={(e) => {
                            const colors = localBackground.gradient?.colors || ["#FF6B6B", "#4ECDC4"]
                            colors[0] = e.target.value
                            handleLocalChange("gradient", { ...localBackground.gradient, colors })
                          }}
                          className="w-6 h-6 rounded border border-slate-300 cursor-pointer shadow-sm flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={localBackground.gradient?.colors?.[0] || "#FF6B6B"}
                          onChange={(e) => {
                            const colors = localBackground.gradient?.colors || ["#FF6B6B", "#4ECDC4"]
                            colors[0] = e.target.value
                            handleLocalChange("gradient", { ...localBackground.gradient, colors })
                          }}
                          className="flex-1 px-1 py-1 border border-slate-300 rounded text-xs font-mono shadow-sm min-w-0 w-full"
                          placeholder="#FF6B6B"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-slate-600">Color 2</span>
                      <div className="flex items-center space-x-1">
                        <input
                          type="color"
                          value={localBackground.gradient?.colors?.[1] || "#4ECDC4"}
                          onChange={(e) => {
                            const colors = localBackground.gradient?.colors || ["#FF6B6B", "#4ECDC4"]
                            colors[1] = e.target.value
                            handleLocalChange("gradient", { ...localBackground.gradient, colors })
                          }}
                          className="w-6 h-6 rounded border border-slate-300 cursor-pointer shadow-sm flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={localBackground.gradient?.colors?.[1] || "#4ECDC4"}
                          onChange={(e) => {
                            const colors = localBackground.gradient?.colors || ["#FF6B6B", "#4ECDC4"]
                            colors[1] = e.target.value
                            handleLocalChange("gradient", { ...localBackground.gradient, colors })
                          }}
                          className="flex-1 px-1 py-1 border border-slate-300 rounded text-xs font-mono shadow-sm min-w-0 w-full"
                          placeholder="#4ECDC4"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Gradient Direction (for linear) */}
                  {localBackground.gradient?.type === "linear" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-slate-700">Gradient Direction</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          value={[localBackground.gradient?.direction || 0]}
                          onValueChange={(value) => handleLocalChange("gradient", { 
                            ...localBackground.gradient, 
                            direction: value[0] 
                          })}
                          max={360}
                          min={0}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-slate-500 font-mono w-12 text-right">
                          {localBackground.gradient?.direction || 0}°
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Gradient Presets - Horizontal Layout */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-700">Quick Presets</Label>
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                      {gradientPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => handleLocalChange("gradient", { 
                            ...localBackground.gradient,
                            colors: preset.colors 
                          })}
                          className="p-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors text-center flex-shrink-0 min-w-[80px]"
                        >
                          <div 
                            className="w-full h-6 rounded mb-1"
                            style={{ 
                              background: localBackground.gradient?.type === "radial" 
                                ? `radial-gradient(circle, ${preset.colors[0]}, ${preset.colors[1]})`
                                : localBackground.gradient?.type === "conic"
                                ? `conic-gradient(from ${localBackground.gradient?.direction || 0}deg, ${preset.colors[0]}, ${preset.colors[1]})`
                                : `linear-gradient(${localBackground.gradient?.direction || 0}deg, ${preset.colors[0]}, ${preset.colors[1]})`
                            }}
                          />
                          <span className="text-xs font-medium text-slate-700">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pattern Background */}
            {localBackground.type === "pattern" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-700">Pattern Style</Label>
                  <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {patternPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handleLocalChange("pattern", { 
                          type: preset.pattern, 
                          scale: preset.scale,
                          opacity: localBackground.pattern?.opacity || 100
                        })}
                        className="p-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors text-center flex-shrink-0 min-w-[80px]"
                      >
                        <div 
                          className="w-full h-8 rounded mb-1"
                          style={{ 
                            background: preset.pattern,
                            backgroundSize: `${preset.scale}px ${preset.scale}px`
                          }}
                        />
                        <span className="text-xs font-medium text-slate-700">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Pattern Opacity */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-700">Pattern Opacity</Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[localBackground.pattern?.opacity || 100]}
                        onValueChange={(value) => handleLocalChange("pattern", { 
                          ...localBackground.pattern, 
                          opacity: value[0] 
                        })}
                        max={100}
                        min={0}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-slate-500 font-mono w-12 text-right">
                        {localBackground.pattern?.opacity || 100}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Image Background */}
            {localBackground.type === "image" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-700">Background Image</Label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (e) => {
                            handleLocalChange("image", { 
                              url: e.target?.result as string,
                              fit: "cover",
                              opacity: 100,
                              blur: 0
                            })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    
                    {/* Image Fit Options */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-slate-700">Image Fit</Label>
                      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                        {[
                          { id: "cover", name: "Cover", desc: "Fill entire area" },
                          { id: "contain", name: "Contain", desc: "Fit within area" },
                          { id: "fill", name: "Fill", desc: "Stretch to fit" },
                          { id: "repeat", name: "Repeat", desc: "Tile pattern" }
                        ].map((fit) => (
                          <button
                            key={fit.id}
                            onClick={() => handleLocalChange("image", { 
                              ...localBackground.image, 
                              fit: fit.id as "cover" | "contain" | "fill" | "repeat"
                            })}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex-shrink-0 min-w-[70px] ${
                              localBackground.image?.fit === fit.id
                                ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                            }`}
                          >
                            <div className="font-medium">{fit.name}</div>
                            <div className="text-xs text-slate-500">{fit.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image Opacity */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-slate-700">Image Opacity</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          value={[localBackground.image?.opacity || 100]}
                          onValueChange={(value) => handleLocalChange("image", { 
                            ...localBackground.image, 
                            opacity: value[0] 
                          })}
                          max={100}
                          min={0}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-slate-500 font-mono w-12 text-right">
                          {localBackground.image?.opacity || 100}%
                        </span>
                      </div>
                    </div>

                    {/* Image Blur */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-slate-700">Image Blur</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          value={[localBackground.image?.blur || 0]}
                          onValueChange={(value) => handleLocalChange("image", { 
                            ...localBackground.image, 
                            blur: value[0] 
                          })}
                          max={20}
                          min={0}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-slate-500 font-mono w-12 text-right">
                          {localBackground.image?.blur || 0}px
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-200 space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
            size="sm"
          >
            {showSaved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Background
              </>
            )}
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <Button
          onClick={resetToDefaults}
          variant="ghost"
          className="w-full text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          size="sm"
        >
          Reset to Defaults
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
