"use client"

import { useState, useEffect } from "react"
import { Label } from "../../../components/ui/label"
import { Slider } from "../../../components/ui/slider"
import { Button } from "../../../components/ui/button"
import { ImageEffects } from "../../types/image"
import { Moon, Palette, RotateCcw, Droplets, ArrowUp, ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react"

interface ShadowToolProps {
  imageEffects: ImageEffects
  onShadowChange: (property: keyof ImageEffects['shadow'], value: any) => void
  onShadowUpdate: (shadow: ImageEffects['shadow']) => void
}

export default function ShadowTool({ imageEffects, onShadowChange, onShadowUpdate }: ShadowToolProps) {
  const [localShadow, setLocalShadow] = useState(imageEffects.shadow)
  const [activeType, setActiveType] = useState<string | null>(null)

  // Initialize shadow tool when component loads
  useEffect(() => {
    // Initialize with the current shadow state from parent
    console.log("ShadowTool: Initializing with shadow state:", imageEffects.shadow)
    setLocalShadow(imageEffects.shadow)
    
    // Auto-open settings panel if shadow type is already selected
    if (imageEffects.shadow.type && !activeType) {
      setActiveType(imageEffects.shadow.type)
    }
  }, [imageEffects.shadow]) // Update when parent shadow state changes

  const handleLocalChange = (property: keyof ImageEffects['shadow'], value: any) => {
    const newShadow = { ...localShadow, [property]: value }
    setLocalShadow(newShadow)
    
    // Auto-save changes immediately when applied
    onShadowChange(property, value)
  }

  const handleReset = () => {
    // Reset to the original shadow state from when tool was opened, but disable shadow
    const resetShadow = { ...imageEffects.shadow, enabled: false }
    setLocalShadow(resetShadow)
    
    // Apply the reset to the canvas (disabled shadow) using the new update function
    onShadowUpdate(resetShadow)
  }

  const resetToDefaults = () => {
    const defaultShadow = {
      enabled: false,
      type: "drop" as const,
      offsetX: 0,
      offsetY: 0,
      blur: 0,
      color: "#000000",
      opacity: 0,
      spread: 0,
      color2: undefined
    }
    setLocalShadow(defaultShadow)
    
    // Apply default shadow settings to canvas (disabled shadow) using the new update function
    onShadowUpdate(defaultShadow)
  }

  const shadowTypes = [
    { 
      id: "drop", 
      name: "Drop", 
      icon: Droplets, 
      color: "from-blue-500 to-cyan-500",
      description: "Classic drop shadow below the image" 
    },
    { 
      id: "inner", 
      name: "Inner", 
      icon: ArrowUp, 
      color: "from-purple-500 to-pink-500",
      description: "Inner shadow effect within the image" 
    },
    { 
      id: "left", 
      name: "Left", 
      icon: ArrowLeft, 
      color: "from-orange-500 to-red-500",
      description: "Shadow cast to the left side" 
    },
    { 
      id: "right", 
      name: "Right", 
      icon: ArrowRight, 
      color: "from-green-500 to-emerald-500",
      description: "Shadow cast to the right side" 
    },
    { 
      id: "gradient", 
      name: "Gradient", 
      icon: Sparkles, 
      color: "from-indigo-500 to-purple-500",
      description: "Beautiful gradient shadow effect" 
    }
  ]

  const colorPresets = [
    "#000000", "#333333", "#666666", "#999999", "#CCCCCC",
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF",
    "#00FFFF", "#FFA500", "#800080", "#008000", "#FFC0CB"
  ]

  const currentType = shadowTypes.find(t => t.id === localShadow.type)

  return (
    <div className="space-y-3">
      {/* Compact Header */}
     

      <div className="space-y-3">
        {/* Shadow Type Selection - Slides out when content is shown */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            activeType
              ? "transform -translate-y-full opacity-0 absolute pointer-events-none"
              : "transform translate-y-0 opacity-100 relative"
          }`}
        >
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-700">Shadow Type</Label>
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {shadowTypes.map((type) => {
                const IconComponent = type.icon
                const isActive = localShadow.type === type.id
                
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      console.log("ShadowTool: Shadow type clicked:", type.id)
                      // Immediately enable and apply shadow when type is selected
                      const enabledShadow = { 
                        enabled: true,
                        type: type.id as "drop" | "inner" | "left" | "right" | "gradient", 
                        offsetX: 10,
                        offsetY: 10,
                        blur: 10,
                        color: "#000000",
                        opacity: 50,
                        spread: 0,
                        color2: type.id === "gradient" ? "#666666" : undefined
                      }
                      console.log("ShadowTool: Setting enabled shadow:", enabledShadow)
                      setLocalShadow(enabledShadow)
                      setActiveType(type.id)
                      
                      // Apply shadow to canvas immediately using the new update function
                      console.log("ShadowTool: Calling onShadowUpdate with:", enabledShadow)
                      onShadowUpdate(enabledShadow)
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

        {/* Shadow Content - Slides in when type is selected */}
        {activeType && (
          <div
            className={`transition-all duration-300 ease-in-out ${
              activeType
                ? "transform translate-y-0 opacity-100"
                : "transform translate-y-full opacity-0"
            }`}
          >
            <div className="bg-white rounded-xl p-4 border border-slate-200/50 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-slate-800">
                  {currentType?.name} Shadow Settings
                </h5>
                <button
                  onClick={() => setActiveType(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Shadow Controls - Compact Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-slate-700">Offset X</Label>
                    <span className="text-xs text-slate-500 font-mono">{localShadow.offsetX}px</span>
                  </div>
                  <Slider
                    value={[localShadow.offsetX]}
                    onValueChange={(value) => handleLocalChange("offsetX", value[0])}
                    max={50}
                    min={-50}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-slate-700">Offset Y</Label>
                    <span className="text-xs text-slate-500 font-mono">{localShadow.offsetY}px</span>
                  </div>
                  <Slider
                    value={[localShadow.offsetY]}
                    onValueChange={(value) => handleLocalChange("offsetY", value[0])}
                    max={50}
                    min={-50}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-slate-700">Blur</Label>
                    <span className="text-xs text-slate-500 font-mono">{localShadow.blur}px</span>
                  </div>
                  <Slider
                    value={[localShadow.blur]}
                    onValueChange={(value) => handleLocalChange("blur", value[0])}
                    max={50}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-slate-700">Spread</Label>
                    <span className="text-xs text-slate-500 font-mono">{localShadow.spread}px</span>
                  </div>
                  <Slider
                    value={[localShadow.spread]}
                    onValueChange={(value) => handleLocalChange("spread", value[0])}
                    max={50}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500">Expands shadow size outward from image edges</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-slate-700">Opacity</Label>
                    <span className="text-xs text-slate-500 font-mono">{localShadow.opacity}%</span>
                  </div>
                  <Slider
                    value={[localShadow.opacity]}
                    onValueChange={(value) => handleLocalChange("opacity", value[0])}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-700">Shadow Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={localShadow.color}
                    onChange={(e) => handleLocalChange("color", e.target.value)}
                    className="w-10 h-8 rounded-lg border border-slate-300 cursor-pointer shadow-sm"
                  />
                  <input
                    type="text"
                    value={localShadow.color}
                    onChange={(e) => handleLocalChange("color", e.target.value)}
                    className="flex-1 px-2 py-1 border border-slate-300 rounded-lg text-xs font-mono shadow-sm"
                    placeholder="#000000"
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

              {/* Gradient Shadow Options (if type is gradient) */}
              {localShadow.type === "gradient" && (
                <div className="space-y-2 mt-3 pt-3 border-t border-slate-200">
                  <Label className="text-xs font-medium text-slate-700">Gradient Color 2</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localShadow.color2 || "#000000"}
                      onChange={(e) => handleLocalChange("color2", e.target.value)}
                      className="w-10 h-8 rounded-lg border border-slate-300 cursor-pointer shadow-sm"
                    />
                    <input
                      type="text"
                      value={localShadow.color2 || "#000000"}
                      onChange={(e) => handleLocalChange("color2", e.target.value)}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded-lg text-xs font-mono shadow-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-200 space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
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
 