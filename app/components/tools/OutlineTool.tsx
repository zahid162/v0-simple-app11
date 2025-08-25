"use client"

import { useState } from "react"
import { Label } from "../../../components/ui/label"
import { Slider } from "../../../components/ui/slider"
import { Button } from "../../../components/ui/button"
import { ImageEffects } from "../../types/image"
import { Frame, Palette, RotateCcw, Save, Check, X, Square, Circle, Sparkles, Star, Zap, Rainbow, Diamond, Brush, CornerUpRight, Minus } from "lucide-react"

interface OutlineToolProps {
  imageEffects: ImageEffects
  onOutlineChange: (property: keyof ImageEffects['outline'], value: any) => void
}

export default function OutlineTool({ imageEffects, onOutlineChange }: OutlineToolProps) {
  const [localOutline, setLocalOutline] = useState(imageEffects.outline)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [activeType, setActiveType] = useState<string | null>(null)

  const handleLocalChange = (property: keyof ImageEffects['outline'], value: any) => {
    const newOutline = { ...localOutline, [property]: value }
    setLocalOutline(newOutline)
    
    // Apply changes live to the canvas for preview
    onOutlineChange(property, value)
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    // Enable outline and apply all local changes
    const outlineToSave = { ...localOutline, enabled: true }
    Object.entries(outlineToSave).forEach(([key, value]) => {
      onOutlineChange(key as keyof ImageEffects['outline'], value)
    })

    setIsSaving(false)
    setShowSaved(true)
    
    setTimeout(() => setShowSaved(false), 2000)
  }

  const handleReset = () => {
    setLocalOutline(imageEffects.outline)
    // Reset to original outline settings
    Object.entries(imageEffects.outline).forEach(([key, value]) => {
      onOutlineChange(key as keyof ImageEffects['outline'], value)
    })
  }

  const resetToDefaults = () => {
    const defaultOutline = {
      enabled: false,
      type: "solid" as const,
      width: 2,
      color: "#000000",
      color2: undefined,
      color3: undefined,
      opacity: 100,
      style: "outside" as const,
      cornerRadius: 10,
      dashLength: 10,
      gapLength: 5,
      glowIntensity: 5,
      pattern: undefined,
    }
    setLocalOutline(defaultOutline)

    // Apply default outline settings
    Object.entries(defaultOutline).forEach(([key, value]) => {
      onOutlineChange(key as keyof ImageEffects['outline'], value)
    })
  }

  const outlineTypes = [
    {
      id: "solid",
      name: "Solid",
      icon: Square,
      color: "from-blue-500 to-cyan-500",
      description: "Clean solid outline around the image"
    },
    {
      id: "gradient",
      name: "Gradient",
      icon: Palette,
      color: "from-purple-500 to-pink-500",
      description: "Beautiful gradient outline effect"
    },
    {
      id: "corners",
      name: "Corners Only",
      icon: CornerUpRight,
      color: "from-green-500 to-emerald-500",
      description: "Outline only on the corners of the image"
    },
    {
      id: "corners-gradient",
      name: "Corners Gradient",
      icon: Star,
      color: "from-indigo-500 to-purple-500",
      description: "Gradient outline only on the corners"
    },
    {
      id: "dashed",
      name: "Dashed",
      icon: Minus,
      color: "from-orange-500 to-red-500",
      description: "Dashed line outline for a stylish look"
    },
    {
      id: "dotted",
      name: "Dotted",
      icon: Circle,
      color: "from-pink-500 to-rose-500",
      description: "Dotted outline for a playful effect"
    },
    {
      id: "inset",
      name: "Inset",
      icon: Frame,
      color: "from-gray-500 to-slate-500",
      description: "3D inset outline effect"
    },
    {
      id: "neon-glow",
      name: "Neon Glow",
      icon: Zap,
      color: "from-cyan-500 to-blue-500",
      description: "Glowing neon outline effect"
    },
    {
      id: "rainbow",
      name: "Rainbow",
      icon: Rainbow,
      color: "from-red-500 via-yellow-500 via-green-500 to-blue-500",
      description: "Colorful rainbow outline"
    },
    {
      id: "vintage",
      name: "Vintage",
      icon: Diamond,
      color: "from-amber-500 to-orange-500",
      description: "Classic vintage-style outline"
    },
    {
      id: "modern",
      name: "Modern",
      icon: Sparkles,
      color: "from-slate-600 to-gray-600",
      description: "Clean modern outline design"
    },
    {
      id: "artistic",
      name: "Artistic",
      icon: Brush,
      color: "from-violet-500 to-purple-500",
      description: "Artistic brush stroke outline"
    }
  ]

  const colorPresets = [
    "#000000", "#333333", "#666666", "#999999", "#CCCCCC",
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF",
    "#00FFFF", "#FFA500", "#800080", "#008000", "#FFC0CB"
  ]

  const currentType = outlineTypes.find(t => t.id === localOutline.type)

  return (
    <div className="space-y-3">
      {/* Outline Type Selection - Slides out when content is shown */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          activeType
            ? "transform -translate-y-full opacity-0 absolute pointer-events-none"
            : "transform translate-y-0 opacity-100 relative"
        }`}
      >
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-700">Outline Type</Label>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {outlineTypes.map((type) => {
              const IconComponent = type.icon
              const isActive = localOutline.type === type.id
              
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

      {/* Outline Content - Slides in when type is selected */}
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
                {currentType?.name} Outline Settings
              </h5>
              <button
                onClick={() => setActiveType(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Outline Controls - Compact Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-slate-700">Width</Label>
                  <span className="text-xs text-slate-500 font-mono">{localOutline.width}px</span>
                </div>
                <Slider
                  value={[localOutline.width]}
                  onValueChange={(value) => handleLocalChange("width", value[0])}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-slate-700">Opacity</Label>
                  <span className="text-xs text-slate-500 font-mono">{localOutline.opacity}%</span>
                </div>
                <Slider
                  value={[localOutline.opacity]}
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
                    localOutline.style === "outside"
                      ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Outside
                </button>
                <button
                  onClick={() => handleLocalChange("style", "inside")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    localOutline.style === "inside"
                      ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Inside
                </button>
                <button
                  onClick={() => handleLocalChange("style", "center")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    localOutline.style === "center"
                      ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Center
                </button>
              </div>
            </div>

            {/* Corner Radius Control - for corners and corners-gradient */}
            {(localOutline.type === "corners" || localOutline.type === "corners-gradient") && (
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-slate-700">Corner Radius</Label>
                  <span className="text-xs text-slate-500 font-mono">{localOutline.cornerRadius || 10}px</span>
                </div>
                <Slider
                  value={[localOutline.cornerRadius || 10]}
                  onValueChange={(value) => handleLocalChange("cornerRadius", value[0])}
                  max={50}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {/* Dash Controls - for dashed and dotted */}
            {(localOutline.type === "dashed" || localOutline.type === "dotted") && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-slate-700">Dash Length</Label>
                    <span className="text-xs text-slate-500 font-mono">{localOutline.dashLength || 10}px</span>
                  </div>
                  <Slider
                    value={[localOutline.dashLength || 10]}
                    onValueChange={(value) => handleLocalChange("dashLength", value[0])}
                    max={30}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-slate-700">Gap Length</Label>
                    <span className="text-xs text-slate-500 font-mono">{localOutline.gapLength || 5}px</span>
                  </div>
                  <Slider
                    value={[localOutline.gapLength || 5]}
                    onValueChange={(value) => handleLocalChange("gapLength", value[0])}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Glow Intensity - for neon-glow */}
            {localOutline.type === "neon-glow" && (
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-slate-700">Glow Intensity</Label>
                  <span className="text-xs text-slate-500 font-mono">{localOutline.glowIntensity || 5}px</span>
                </div>
                <Slider
                  value={[localOutline.glowIntensity || 5]}
                  onValueChange={(value) => handleLocalChange("glowIntensity", value[0])}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-700">Outline Color</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={localOutline.color}
                  onChange={(e) => handleLocalChange("color", e.target.value)}
                  className="w-10 h-8 rounded-lg border border-slate-300 cursor-pointer shadow-sm"
                />
                <input
                  type="text"
                  value={localOutline.color}
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

            {/* Gradient Outline Options (if type is gradient) */}
            {localOutline.type === "gradient" && (
              <div className="space-y-2 mt-3 pt-3 border-t border-slate-200">
                <Label className="text-xs font-medium text-slate-700">Gradient Color 2</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={localOutline.color2 || "#000000"}
                    onChange={(e) => handleLocalChange("color2", e.target.value)}
                    className="w-10 h-8 rounded-lg border border-slate-300 cursor-pointer shadow-sm"
                  />
                  <input
                    type="text"
                    value={localOutline.color2 || "#000000"}
                    onChange={(e) => handleLocalChange("color2", e.target.value)}
                    className="flex-1 px-2 py-1 border border-slate-300 rounded-lg text-xs font-mono shadow-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
            )}

            {/* Rainbow Outline Options (if type is rainbow) */}
            {localOutline.type === "rainbow" && (
              <div className="space-y-2 mt-3 pt-3 border-t border-slate-200">
                <Label className="text-xs font-medium text-slate-700">Rainbow Colors</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localOutline.color2 || "#FF0000"}
                      onChange={(e) => handleLocalChange("color2", e.target.value)}
                      className="w-8 h-6 rounded border border-slate-300 cursor-pointer shadow-sm"
                    />
                    <span className="text-xs text-slate-600">Color 2</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={localOutline.color3 || "#0000FF"}
                      onChange={(e) => handleLocalChange("color3", e.target.value)}
                      className="w-8 h-6 rounded border border-slate-300 cursor-pointer shadow-sm"
                    />
                    <span className="text-xs text-slate-600">Color 3</span>
                  </div>
                </div>
              </div>
            )}

            {/* Artistic Outline Options (if type is artistic) */}
            {localOutline.type === "artistic" && (
              <div className="space-y-2 mt-3 pt-3 border-t border-slate-200">
                <Label className="text-xs font-medium text-slate-700">Brush Pattern</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleLocalChange("pattern", "brush")}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      localOutline.pattern === "brush"
                        ? "bg-purple-100 text-purple-700 border border-purple-300"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Brush
                  </button>
                  <button
                    onClick={() => handleLocalChange("pattern", "ink")}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      localOutline.pattern === "ink"
                        ? "bg-purple-100 text-purple-700 border border-purple-300"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Ink
                  </button>
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
                Save Outline
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
