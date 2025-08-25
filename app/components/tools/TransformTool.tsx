"use client"

import { Label } from "../../../components/ui/label"
import { Slider } from "../../../components/ui/slider"
import { FlipHorizontal, FlipVertical } from "lucide-react"
import { ImageEffects } from "../../types/image"

interface TransformToolProps {
  imageEffects: ImageEffects
  onSliderChange: (property: keyof ImageEffects, value: number | boolean) => void
}

export default function TransformTool({ imageEffects, onSliderChange }: TransformToolProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Scale</Label>
          <Slider
            value={[imageEffects.scale || 100]}
            onValueChange={(value) => onSliderChange("scale", value[0])}
            max={200}
            min={50}
            step={1}
            className="w-full"
          />
          <div className="text-xs text-slate-500 text-center">{imageEffects.scale || 100}%</div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Rotation</Label>
          <Slider
            value={[imageEffects.rotation || 0]}
            onValueChange={(value) => onSliderChange("rotation", value[0])}
            max={360}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="text-xs text-slate-500 text-center">{imageEffects.rotation || 0}°</div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSliderChange("flipH", !imageEffects.flipH)}
            className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              imageEffects.flipH
                ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FlipHorizontal className="w-4 h-4 mx-auto mb-2" />
            Flip Horizontal
          </button>
          
          <button
            onClick={() => onSliderChange("flipV", !imageEffects.flipV)}
            className={`p-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              imageEffects.flipV
                ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FlipVertical className="w-4 h-4 mx-auto mb-2" />
            Flip Vertical
          </button>
        </div>
      </div>
    </div>
  )
}
