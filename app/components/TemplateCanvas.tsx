"use client"

import { useEffect, useRef, useCallback } from 'react'
import { ImageEffects, BackgroundData } from '../types/image'

interface TemplateCanvasProps {
  template: {
    imageEffects: ImageEffects
    backgroundData: BackgroundData
    previewImage?: string
  }
  width: number
  height: number
  testImage?: string | null
}

export default function TemplateCanvas({ template, width, height, testImage }: TemplateCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Convert hex to rgba
  const hexToRgb = (hex: string, alpha: number = 1) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result) {
      const r = parseInt(result[1], 16)
      const g = parseInt(result[2], 16)
      const b = parseInt(result[3], 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    return hex
  }

  // Draw background
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, backgroundData: BackgroundData) => {
    if (backgroundData.type === "color" && backgroundData.color) {
      ctx.fillStyle = backgroundData.color
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    } else if (backgroundData.type === "gradient" && backgroundData.gradient) {
      const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, ctx.canvas.height)
      if (backgroundData.gradient.colors.length > 0) {
        gradient.addColorStop(0, backgroundData.gradient.colors[0])
        gradient.addColorStop(1, backgroundData.gradient.colors[backgroundData.gradient.colors.length - 1] || backgroundData.gradient.colors[0])
      }
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    } else if (backgroundData.type === "image" && backgroundData.image?.url) {
      // For image backgrounds, we'd need to load the image first
      // For now, fall back to a default color
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
  }, [])

  // Draw image with effects
  const drawImage = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement, imageEffects: ImageEffects) => {
    ctx.save()

    // Apply transformations
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
    ctx.scale(imageEffects.scale / 100, imageEffects.scale / 100)
    ctx.rotate((imageEffects.rotation * Math.PI) / 180)
    
    if (imageEffects.flipH) {
      ctx.scale(-1, 1)
    }
    if (imageEffects.flipV) {
      ctx.scale(1, -1)
    }

    // Draw image to fill the entire canvas (same as edit page)
    ctx.drawImage(img, -ctx.canvas.width / 2, -ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height)

    ctx.restore()
  }, [])

  // Draw shadow effect
  const drawShadow = useCallback((ctx: CanvasRenderingContext2D, shadow: ImageEffects['shadow'], img: HTMLImageElement) => {
    if (!shadow.enabled) return

    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    ctx.globalAlpha = shadow.opacity / 100

    // Create shadow canvas
    const shadowCanvas = document.createElement('canvas')
    const shadowCtx = shadowCanvas.getContext('2d')
    if (!shadowCtx) return

    shadowCanvas.width = ctx.canvas.width
    shadowCanvas.height = ctx.canvas.height

    // Draw image to shadow canvas
    shadowCtx.drawImage(img, 0, 0, shadowCanvas.width, shadowCanvas.height)

    // Apply shadow effect
    shadowCtx.shadowColor = shadow.color
    shadowCtx.shadowBlur = shadow.blur
    shadowCtx.shadowOffsetX = shadow.offsetX
    shadowCtx.shadowOffsetY = shadow.offsetY

    // Draw shadow
    ctx.drawImage(shadowCanvas, 0, 0)

    ctx.restore()
  }, [])

  // Draw outline effect
  const drawOutline = useCallback((ctx: CanvasRenderingContext2D, outline: ImageEffects['outline'], img: HTMLImageElement) => {
    if (!outline.enabled) return

    ctx.save()
    ctx.strokeStyle = hexToRgb(outline.color, outline.opacity / 100)
    ctx.lineWidth = outline.width

    // Create outline canvas
    const outlineCanvas = document.createElement('canvas')
    const outlineCtx = outlineCanvas.getContext('2d')
    if (!outlineCtx) return

    outlineCanvas.width = ctx.canvas.width
    outlineCanvas.height = ctx.canvas.height

    // Draw image to outline canvas
    outlineCtx.drawImage(img, 0, 0, outlineCanvas.width, outlineCanvas.height)

    // Apply outline effect based on type
    if (outline.type === "solid") {
      outlineCtx.strokeRect(0, 0, outlineCanvas.width, outlineCanvas.height)
    }

    ctx.drawImage(outlineCanvas, 0, 0)
    ctx.restore()
  }, [])

  // Draw glow effect
  const drawGlow = useCallback((ctx: CanvasRenderingContext2D, glow: ImageEffects['glow'], img: HTMLImageElement) => {
    if (!glow.enabled) return

    ctx.save()

    const blur = glow.blur
    const opacity = glow.opacity / 100
    const intensity = glow.intensity

    // Create glow canvas
    const glowCanvas = document.createElement('canvas')
    const glowCtx = glowCanvas.getContext('2d')
    if (!glowCtx) return

    glowCanvas.width = ctx.canvas.width
    glowCanvas.height = ctx.canvas.height

    // Draw image to glow canvas
    glowCtx.drawImage(img, 0, 0, glowCanvas.width, glowCanvas.height)

    // Apply glow effect
    glowCtx.shadowColor = hexToRgb(glow.color, opacity * intensity)
    glowCtx.shadowBlur = blur
    glowCtx.shadowOffsetX = 0
    glowCtx.shadowOffsetY = 0

    // Draw glow
    ctx.globalCompositeOperation = 'screen'
    ctx.drawImage(glowCanvas, 0, 0)
    ctx.globalCompositeOperation = 'source-over'

    ctx.restore()
  }, [])

  // Main draw function
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !imageRef.current) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background
    drawBackground(ctx, template.backgroundData)

    // Draw image with effects
    if (imageRef.current) {
      // Draw shadow first (behind image)
      drawShadow(ctx, template.imageEffects.shadow, imageRef.current)
      
      // Draw glow
      drawGlow(ctx, template.imageEffects.glow, imageRef.current)
      
      // Draw main image
      drawImage(ctx, imageRef.current, template.imageEffects)
      
      // Draw outline last (on top)
      drawOutline(ctx, template.imageEffects.outline, imageRef.current)
    }
  }, [template, width, height, drawBackground, drawImage, drawShadow, drawOutline, drawGlow, testImage])

  // Handle image load
  const handleImageLoad = useCallback(() => {
    drawCanvas()
  }, [drawCanvas])

  // Initialize canvas when template changes
  useEffect(() => {
    if (testImage) {
      // Use the test image if provided (prioritized)
      const img = new Image()
      img.onload = handleImageLoad
      img.src = testImage
      imageRef.current = img
    } else {
      // Use a default placeholder image since templates don't store images
      const img = new Image()
      img.onload = handleImageLoad
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDEzMCAxMDBDMTMwIDExNi41NjkgMTE2LjU2OSAxMzAgMTAwIDEzMEM4My40MzEgMTMwIDcwIDExNi41NjkgNzAgMTAwQzcwIDgzLjQzMSA4My40MzEgNzAgMTAwIDcwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
      imageRef.current = img
    }
  }, [testImage, handleImageLoad, drawCanvas])

  return (
    <canvas
      ref={canvasRef}
      className="max-w-full max-h-full rounded-lg shadow-md"
      style={{ cursor: "default" }}
    />
  )
}
