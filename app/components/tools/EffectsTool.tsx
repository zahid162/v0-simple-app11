"use client"

import { Label } from "../../../components/ui/label"
import { Slider } from "../../../components/ui/slider"
import { ImageEffects } from "../../types/image"

interface EffectsToolProps {
  imageEffects: ImageEffects
  onSliderChange: (property: keyof ImageEffects, value: number | boolean) => void
}

export default function EffectsTool({ imageEffects, onSliderChange }: EffectsToolProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Vibrance</Label>
          <Slider
            value={[imageEffects.vibrance]}
            onValueChange={(value) => onSliderChange("vibrance", value[0])}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="text-xs text-slate-500 text-center">{imageEffects.vibrance}%</div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Exposure</Label>
          <Slider
            value={[imageEffects.exposure]}
            onValueChange={(value) => onSliderChange("exposure", value[0])}
            max={100}
            min={-100}
            step={1}
            className="w-full"
          />
          <div className="text-xs text-slate-500 text-center">{imageEffects.exposure}</div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Highlights</Label>
          <Slider
            value={[imageEffects.highlights]}
            onValueChange={(value) => onSliderChange("highlights", value[0])}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="text-xs text-slate-500 text-center">{imageEffects.highlights}%</div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Shadows</Label>
          <Slider
            value={[imageEffects.shadows]}
            onValueChange={(value) => onSliderChange("shadows", value[0])}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="text-xs text-slate-500 text-center">{imageEffects.shadows}%</div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Temperature</Label>
          <Slider
            value={[imageEffects.temperature]}
            onValueChange={(value) => onSliderChange("temperature", value[0])}
            max={100}
            min={-100}
            step={1}
            className="w-full"
          />
          <div className="text-xs text-slate-500 text-center">{imageEffects.temperature}</div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Tint</Label>
          <Slider
            value={[imageEffects.tint]}
            onValueChange={(value) => onSliderChange("tint", value[0])}
            max={100}
            min={-100}
            step={1}
            className="w-full"
          />
          <div className="text-xs text-slate-500 text-center">{imageEffects.tint}</div>
        </div>
      </div>
    </div>
  )
} 