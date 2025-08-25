"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { ArrowLeft, Download, Share2, RotateCcw, Eye, FileImage, Sparkles, Check } from "lucide-react"

interface DownloadFormat {
  format: "png" | "jpeg" | "webp"
  quality?: number
}

export default function PreviewPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const downloadLinkRef = useRef<HTMLAnchorElement>(null)

  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string>("")
  const [imageLoaded, setImageLoaded] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>({ format: "png" })
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)

  // Image statistics
  const [imageStats, setImageStats] = useState({
    width: 0,
    height: 0,
    fileSize: 0,
    format: "PNG",
  })

  useEffect(() => {
    // Retrieve final image from sessionStorage
    const storedImageUrl = sessionStorage.getItem("finalImage")
    const storedImageName = sessionStorage.getItem("finalImageName")

    if (!storedImageUrl) {
      router.push("/")
      return
    }

    setFinalImageUrl(storedImageUrl)
    setImageName(storedImageName || "edited-image")

    // Calculate image stats
    const img = new Image()
    img.onload = () => {
      setImageStats({
        width: img.naturalWidth,
        height: img.naturalHeight,
        fileSize: Math.round((storedImageUrl.length * 3) / 4 / 1024), // Approximate size in KB
        format: "PNG",
      })
      setImageLoaded(true)
    }
    img.src = storedImageUrl
  }, [router])

  const handleDownload = async () => {
    if (!finalImageUrl || !canvasRef.current) return

    setIsDownloading(true)

    try {
      // Create a canvas for format conversion
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const img = new Image()
      img.onload = () => {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        ctx.drawImage(img, 0, 0)

        // Convert to desired format
        let mimeType = "image/png"
        let fileExtension = "png"
        let quality = 1

        switch (downloadFormat.format) {
          case "jpeg":
            mimeType = "image/jpeg"
            fileExtension = "jpg"
            quality = (downloadFormat.quality || 90) / 100
            break
          case "webp":
            mimeType = "image/webp"
            fileExtension = "webp"
            quality = (downloadFormat.quality || 90) / 100
            break
          case "png":
          default:
            mimeType = "image/png"
            fileExtension = "png"
            quality = 1
            break
        }

        // Generate download URL
        const dataUrl = canvas.toDataURL(mimeType, quality)

        // Trigger download
        if (downloadLinkRef.current) {
          downloadLinkRef.current.href = dataUrl
          downloadLinkRef.current.download = `${imageName}.${fileExtension}`
          downloadLinkRef.current.click()
        }

        setDownloadComplete(true)
        setTimeout(() => setDownloadComplete(false), 3000)
      }

      img.src = finalImageUrl
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    if (!finalImageUrl) return

    try {
      // Convert data URL to blob
      const response = await fetch(finalImageUrl)
      const blob = await response.blob()
      const file = new File([blob], `${imageName}.png`, { type: "image/png" })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Edited Photo",
          text: "Check out my edited photo!",
          files: [file],
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ])
        alert("Image copied to clipboard!")
      }
    } catch (error) {
      console.error("Share failed:", error)
      alert("Sharing not supported on this device")
    }
  }

  const startOver = () => {
    // Clear session storage
    sessionStorage.removeItem("selectedImage")
    sessionStorage.removeItem("selectedImageName")
    sessionStorage.removeItem("processedImage")
    sessionStorage.removeItem("processedImageName")
    sessionStorage.removeItem("finalImage")
    sessionStorage.removeItem("finalImageName")

    router.push("/")
  }

  if (!finalImageUrl) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Preview & Download"
        subtitle="Review and download your edited image"
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Preview Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="w-5 h-5" />
                  Final Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <img
                      src={finalImageUrl || "/placeholder.svg"}
                      alt="Final edited image"
                      className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg border border-border"
                      style={{ backgroundColor: "transparent" }}
                    />
                    <div className="absolute -bottom-8 left-0 text-sm text-muted-foreground">
                      {imageStats.width} × {imageStats.height}px • {imageStats.fileSize}KB
                    </div>
                  </div>
                </div>

                {/* Image Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{imageStats.width}</div>
                    <div className="text-sm text-muted-foreground">Width (px)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{imageStats.height}</div>
                    <div className="text-sm text-muted-foreground">Height (px)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{imageStats.fileSize}</div>
                    <div className="text-sm text-muted-foreground">Size (KB)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{imageStats.format}</div>
                    <div className="text-sm text-muted-foreground">Format</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Download Controls */}
          <div className="space-y-6">
            {/* Download Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>File Format</Label>
                  <Select
                    value={downloadFormat.format}
                    onValueChange={(value: "png" | "jpeg" | "webp") =>
                      setDownloadFormat({ format: value, quality: value === "png" ? undefined : 90 })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG (Lossless, Transparent)</SelectItem>
                      <SelectItem value="jpeg">JPEG (Compressed, Smaller)</SelectItem>
                      <SelectItem value="webp">WebP (Modern, Efficient)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(downloadFormat.format === "jpeg" || downloadFormat.format === "webp") && (
                  <div className="space-y-2">
                    <Label>Quality: {downloadFormat.quality}%</Label>
                    <Slider
                      value={[downloadFormat.quality || 90]}
                      onValueChange={(value) => setDownloadFormat((prev) => ({ ...prev, quality: value[0] }))}
                      min={10}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground">Higher quality = larger file size</div>
                  </div>
                )}

                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full flex items-center gap-2"
                  size="lg"
                >
                  {downloadComplete ? (
                    <>
                      <Check className="w-5 h-5" />
                      Downloaded!
                    </>
                  ) : isDownloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download Image
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="w-full flex items-center gap-2 bg-transparent"
                  size="lg"
                >
                  <Share2 className="w-4 h-4" />
                  Share Image
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/edit")}
                  className="w-full flex items-center gap-2"
                >
                  Continue Editing
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/adjust")}
                  className="w-full flex items-center gap-2"
                >
                  Adjust Crop/Size
                </Button>
                <Button variant="outline" onClick={startOver} className="w-full flex items-center gap-2 bg-transparent">
                  <RotateCcw className="w-4 h-4" />
                  Start New Project
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pro Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">
                    PNG
                  </Badge>
                  <div className="text-sm">
                    <div className="font-medium">Best for transparency</div>
                    <div className="text-muted-foreground">Preserves transparent backgrounds perfectly</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">
                    JPEG
                  </Badge>
                  <div className="text-sm">
                    <div className="font-medium">Smaller file sizes</div>
                    <div className="text-muted-foreground">Great for photos, but no transparency</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">
                    WebP
                  </Badge>
                  <div className="text-sm">
                    <div className="font-medium">Modern & efficient</div>
                    <div className="text-muted-foreground">Best compression with quality</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Hidden canvas for format conversion */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden download link */}
      <a ref={downloadLinkRef} className="hidden" />
      <Footer />
    </div>
  )
}
