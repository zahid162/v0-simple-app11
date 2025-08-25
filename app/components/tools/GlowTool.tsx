"use client"

import { useState } from "react"
import { Label } from "../../../components/ui/label"
import { Slider } from "../../../components/ui/slider"
import { Button } from "../../../components/ui/button"
import { ImageEffects } from "../../types/image"
import { Sun, Palette, Zap, Rainbow, Sparkles, Flame, Snowflake, Cloud, Star, Layers, RotateCcw, Save, Check, X, Circle } from "lucide-react"

interface GlowToolProps {
  imageEffects: ImageEffects
  onGlowChange: (property: keyof ImageEffects['glow'], value: any) => void
  onGlowUpdate: (glow: ImageEffects['glow']) => void
}

export default function GlowTool({ imageEffects, onGlowChange, onGlowUpdate }: GlowToolProps) {
  const [localGlow, setLocalGlow] = useState(imageEffects.glow)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [activeType, setActiveType] = useState<string | null>(null)

  const handleLocalChange = (property: keyof ImageEffects['glow'], value: any) => {
    const newGlow = { ...localGlow, [property]: value }
    setLocalGlow(newGlow)

    // Apply changes live to the canvas for preview
    onGlowChange(property, value)
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Enable glow and apply all local changes
    const glowToSave = { ...localGlow, enabled: true }
    Object.entries(glowToSave).forEach(([key, value]) => {
      onGlowChange(key as keyof ImageEffects['glow'], value)
    })

    setIsSaving(false)
    setShowSaved(true)

    setTimeout(() => setShowSaved(false), 2000)
  }

  const handleReset = () => {
    setLocalGlow(imageEffects.glow)
    // Reset to original glow settings
    Object.entries(imageEffects.glow).forEach(([key, value]) => {
      onGlowChange(key as keyof ImageEffects['glow'], value)
    })
  }

  const resetToDefaults = () => {
    const defaultGlow = {
      enabled: false,
      type: "solid" as const,
      blur: 10,
      color: "#ffffff",
      color2: undefined,
      color3: undefined,
      opacity: 50,
      intensity: 1,
      spread: 0,
      style: "outside" as const,
      animation: false,
    }
    setLocalGlow(defaultGlow)

    // Apply default glow settings
    Object.entries(defaultGlow).forEach(([key, value]) => {
      onGlowChange(key as keyof ImageEffects['glow'], value)
    })
  }

  const glowTypes = [
    {
      id: "solid",
      name: "Solid",
      icon: Circle,
      color: "from-yellow-500 to-orange-500",
      description: "Clean solid glow around the image"
    },
    {
      id: "gradient",
      name: "Gradient",
      icon: Palette,
      color: "from-purple-500 to-pink-500",
      description: "Gradient color glow effect"
    },
    {
      id: "soft",
      name: "Soft",
      icon: Sun,
      color: "from-amber-500 to-yellow-500",
      description: "Soft, gentle glow effect"
    },
    {
      id: "neon",
      name: "Neon",
      icon: Zap,
      color: "from-cyan-500 to-blue-500",
      description: "Bright neon-style glow"
    },
    {
      id: "colorful",
      name: "Colorful",
      icon: Rainbow,
      color: "from-red-500 via-yellow-500 to-blue-500",
      description: "Multi-color vibrant glow"
    },
    {
      id: "rim",
      name: "Rim",
      icon: Layers,
      color: "from-gray-500 to-slate-500",
      description: "Subtle rim lighting effect"
    },
    {
      id: "halo",
      name: "Halo",
      icon: Star,
      color: "from-white to-gray-300",
      description: "Angelic halo glow effect"
    },
    {
      id: "chromatic",
      name: "Chromatic",
      icon: Sparkles,
      color: "from-violet-500 to-purple-500",
      description: "Color-shifting chromatic effect"
    },
    {
      id: "fire",
      name: "Fire",
      icon: Flame,
      color: "from-red-500 to-orange-500",
      description: "Flaming glow effect"
    },
    {
      id: "ice",
      name: "Ice",
      icon: Snowflake,
      color: "from-blue-500 to-cyan-500",
      description: "Icy cool glow effect"
    },
    {
      id: "aurora",
      name: "Aurora",
      icon: Cloud,
      color: "from-green-500 to-purple-500",
      description: "Northern lights aurora effect"
    }
  ]

  const colorPresets = [
    "#FFFFFF", "#FFFF00", "#FF0000", "#00FF00", "#0000FF", "#FF00FF",
    "#00FFFF", "#FFA500", "#800080", "#008000", "#FFC0CB", "#FFD700",
    "#FF6347", "#32CD32", "#1E90FF", "#FF1493", "#00CED1", "#FF4500"
  ]

  const currentType = glowTypes.find(t => t.id === localGlow.type)

  return (
    <div className="space-y-3">
      {/* Glow Type Selection - Slides out when content is shown */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          activeType
            ? "transform -translate-y-full opacity-0 absolute pointer-events-none"
            : "transform translate-y-0 opacity-100 relative"
        }`}
      >
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-700">Glow Type</Label>
          <div className="grid grid-cols-3 gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {glowTypes.map((type) => {
              const IconComponent = type.icon
              const isActive = localGlow.type === type.id

              return (
                <button
                  key={type.id}
                  onClick={() => {
                    handleLocalChange("type", type.id)
                    setActiveType(type.id)
                  }}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-[60px] ${
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

      {/* Glow Content - Slides in when type is selected */}
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
                {currentType?.name} Glow Settings
              </h5>
              <button
                onClick={() => setActiveType(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Glow Controls - Compact Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-slate-700">Blur</Label>
                  <span className="text-xs text-slate-500 font-mono">{localGlow.blur}px</span>
                </div>
                <Slider
                  value={[localGlow.blur]}
                  onValueChange={(value) => handleLocalChange("blur", value[0])}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-slate-700">Intensity</Label>
                  <span className="text-xs text-slate-500 font-mono">{localGlow.intensity}</span>
                </div>
                <Slider
                  value={[localGlow.intensity]}
                  onValueChange={(value) => handleLocalChange("intensity", value[0])}
                  max={5}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-slate-700">Spread</Label>
                  <span className="text-xs text-slate-500 font-mono">{localGlow.spread || 0}px</span>
                </div>
                <Slider
                  value={[localGlow.spread || 0]}
                  onValueChange={(value) => handleLocalChange("spread", value[0])}
                  max={30}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-slate-700">Opacity</Label>
                  <span className="text-xs text-slate-500 font-mono">{localGlow.opacity}%</span>
                </div>
                <Slider
                  value={[localGlow.opacity]}
                  onValueChange={(value) => handleLocalChange("opacity", value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Style Selection */}
            <div className="space-y-2 mb-3">
              <Label className="text-xs font-medium text-slate-700">Style</Label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleLocalChange("style", "outside")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    localGlow.style === "outside"
                      ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Outside
                </button>
                <button
                  onClick={() => handleLocalChange("style", "inside")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    localGlow.style === "inside"
                      ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Inside
                </button>
                <button
                  onClick={() => handleLocalChange("style", "both")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    localGlow.style === "both"
                      ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Both
                </button>
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-700">Glow Color</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={localGlow.color}
                  onChange={(e) => handleLocalChange("color", e.target.value)}
                  className="w-10 h-8 rounded-lg border border-slate-300 cursor-pointer shadow-sm"
                />
                <input
                  type="text"
                  value={localGlow.color}
                  onChange={(e) => handleLocalChange("color", e.target.value)}
                  className="flex-1 px-2 py-1 border border-slate-300 rounded-lg text-xs font-mono shadow-sm"
                  placeholder="#FFFFFF"
                />
              </div>

              {/* Color Presets */}
              <div className="grid grid-cols-9 gap-1">
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

            {/* Gradient Glow Options (if type is gradient) */}
            {localGlow.type === "gradient" && (
              <div className="space-y-2 mt-3 pt-3 border-t border-slate-200">
                <Label className="text-xs font-medium text-slate-700">Gradient Color 2</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={localGlow.color2 || "#000000"}
                    onChange={(e) => handleLocalChange("color2", e.target.value)}
                    className="w-10 h-8 rounded-lg border border-slate-300 cursor-pointer shadow-sm"
                  />
                  <input
                    type="text"
                    value={localGlow.color2 || "#000000"}
                    onChange={(e) => handleLocalChange("color2", e.target.value)}
                    className="flex-1 px-2 py-1 border border-slate-300 rounded-lg text-xs font-mono shadow-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
            )}

            {/* Colorful Glow Options (if type is colorful) */}
            {(localGlow.type === "colorful" || localGlow.type === "aurora") && (
              <div className="space-y-2 mt-3 pt-3 border-t border-slate-200">
                <Label className="text-xs font-medium text-slate-700">Additional Colors</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localGlow.color2 || "#FFFF00"}
                      onChange={(e) => handleLocalChange("color2", e.target.value)}
                      className="w-8 h-6 rounded border border-slate-300 cursor-pointer shadow-sm"
                    />
                    <span className="text-xs text-slate-600">Color 2</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localGlow.color3 || "#0000FF"}
                      onChange={(e) => handleLocalChange("color3", e.target.value)}
                      className="w-8 h-6 rounded border border-slate-300 cursor-pointer shadow-sm"
                    />
                    <span className="text-xs text-slate-600">Color 3</span>
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
                Save Glow
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
