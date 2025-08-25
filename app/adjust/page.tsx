"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  ArrowRight,
  Upload,
  RotateCcw,
  ZoomIn,
  RotateCw,
  Settings,
  Palette,
  Eye,
  EyeOff,
} from "lucide-react";

export default function PreparePage() {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("image");
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 60,
    height: 60,
    x: 20,
    y: 20,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [zoom, setZoom] = useState(100);
  const [quality, setQuality] = useState("high");
  const [rotate, setRotate] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedImage = sessionStorage.getItem("selectedImage");
    const savedImageName = sessionStorage.getItem("selectedImageName");

    if (savedImage) {
      setImageSrc(savedImage);
      setImageName(savedImageName || "image");
      setIsLoading(false);
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (
      completedCrop &&
      imgRef.current &&
      previewCanvasRef.current &&
      imageSrc
    ) {
      updatePreviewCanvas();
    }
  }, [completedCrop, zoom, rotate, imageSrc]);

  const updatePreviewCanvas = useCallback(() => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return;

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const previewSize = 300;
    canvas.width = previewSize;
    canvas.height = previewSize;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, previewSize, previewSize);

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    const zoomFactor = zoom / 100;
    const zoomedWidth = cropWidth * zoomFactor;
    const zoomedHeight = cropHeight * zoomFactor;
    const zoomOffsetX = (zoomedWidth - cropWidth) / 2;
    const zoomOffsetY = (zoomedHeight - cropHeight) / 2;

    ctx.save();
    ctx.translate(previewSize / 2, previewSize / 2);
    if (rotate !== 0) {
      ctx.rotate((rotate * Math.PI) / 180);
    }
    ctx.drawImage(
      image,
      cropX - zoomOffsetX,
      cropY - zoomOffsetY,
      zoomedWidth,
      zoomedHeight,
      -previewSize / 2,
      -previewSize / 2,
      previewSize,
      previewSize
    );
    ctx.restore();
  }, [completedCrop, zoom, rotate]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageSrc = e.target?.result as string;
        setImageSrc(newImageSrc);
        setImageName(file.name);
        sessionStorage.setItem("selectedImage", newImageSrc);
        sessionStorage.setItem("selectedImageName", file.name);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReplacePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleNext = async () => {
    if (!imageSrc || !completedCrop || !imgRef.current) return;

    setIsProcessing(true);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const outputSize = quality === "high" ? 1024 : 512;
      canvas.width = outputSize;
      canvas.height = outputSize;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = quality === "high" ? "high" : "medium";

      const cropX = completedCrop.x * scaleX;
      const cropY = completedCrop.y * scaleY;
      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;

      const zoomFactor = zoom / 100;
      const zoomedWidth = cropWidth * zoomFactor;
      const zoomedHeight = cropHeight * zoomFactor;
      const zoomOffsetX = (zoomedWidth - cropWidth) / 2;
      const zoomOffsetY = (zoomedHeight - cropHeight) / 2;

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, outputSize, outputSize);

      ctx.save();
      ctx.translate(outputSize / 2, outputSize / 2);
      if (rotate !== 0) {
        ctx.rotate((rotate * Math.PI) / 180);
      }
      ctx.drawImage(
        image,
        cropX - zoomOffsetX,
        cropY - zoomOffsetY,
        zoomedWidth,
        zoomedHeight,
        -outputSize / 2,
        -outputSize / 2,
        outputSize,
        outputSize
      );
      ctx.restore();

      const processedImageUrl = canvas.toDataURL(
        "image/png",
        quality === "high" ? 1.0 : 0.8
      );

      sessionStorage.setItem("processedImage", processedImageUrl);
      sessionStorage.setItem("processedImageName", imageName);

      router.push("/edit");
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Error processing image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const size = Math.min(width, height) * 0.6;
      const x = (width - size) / 2;
      const y = (height - size) / 2;

      setCrop({
        unit: "px",
        width: size,
        height: size,
        x: x,
        y: y,
      });
    },
    []
  );
  const handleReset = () => {};
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <p className="text-slate-600 font-medium">Processing your image...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-x-hidden">
      <Header 
        title="Photo Editor"
        subtitle="Adjust & crop your image"
        showActions={true}
        onReplacePhoto={handleReplacePhoto}
        onReset={handleReset}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 w-full">
          {/* Main Editor Area */}
          <div className="space-y-4 sm:space-y-6 w-full">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-slate-200/50 w-full">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                  Image Editor
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  Drag corners to resize, drag inside to move the crop area
                </p>
              </div>

              {imageSrc ? (
                <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl p-2 sm:p-4">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    className="max-w-full"
                    style={
                      {
                        "--ReactCrop__crop-selection-color":
                          "rgba(139, 92, 246, 0.15)",
                        "--ReactCrop__crop-selection-border-color": "#8b5cf6",
                        "--ReactCrop__crop-selection-border-width": "2px",
                        "--ReactCrop__crop-selection-border-style": "solid",
                      } as React.CSSProperties
                    }
                  >
                    <img
                      ref={imgRef}
                      alt="Edit me"
                      src={imageSrc || "/placeholder.svg"}
                      style={{
                        transform: `scale(${zoom / 100}) rotate(${rotate}deg)`,
                        maxWidth: "100%",
                        height: "auto",
                        transition:
                          "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                      onLoad={onImageLoad}
                      className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                  </ReactCrop>

                  {/* Floating Instructions */}
                  <div className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-black/80 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium shadow-xl">
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span>Drag corners to resize</span>
          </div>
        </div>
                </div>
              ) : (
                <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-slate-400" />
                    <p className="text-base sm:text-lg font-medium">No image selected</p>
                  </div>
                </div>
              )}
          </div>

            {/* Quick Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Quick Adjustments
                </h3>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">
                    {showAdvanced ? "Hide" : "Advanced"}
                  </span>
                </button>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Zoom Control */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                    <ZoomIn className="w-4 h-4" />
                    <span>Zoom ({zoom}%)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>50%</span>
                      <span>100%</span>
                      <span>200%</span>
                    </div>
                  </div>
                </div>

                {/* Rotate Control */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                    <RotateCw className="w-4 h-4" />
                    <span>Rotate ({rotate}°)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={rotate}
                      onChange={(e) => setRotate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>-180°</span>
                      <span>0°</span>
                      <span>180°</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Controls */}
              {showAdvanced && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">
                        Export Quality
                      </label>
                      <select
                        value={quality}
                        onChange={(e) => setQuality(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-slate-700"
                      >
                        <option value="high">High Quality (1024×1024)</option>
                        <option value="medium">Medium Quality (512×512)</option>
                        <option value="low">Low Quality (256×256)</option>
                      </select>
                      <p className="text-xs text-slate-500">
                        Higher quality = larger file size
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200/50 w-full">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Live Preview
                </h2>
                <p className="text-slate-600">
                  Real-time preview of your profile picture
                </p>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-purple-500 bg-gradient-to-br from-slate-50 to-slate-100 shadow-2xl">
                    {imageSrc && completedCrop ? (
                      <canvas
                        ref={previewCanvasRef}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <div className="w-24 h-24 bg-slate-300 rounded-full"></div>
                      </div>
                    )}
                  </div>

                  {/* Preview Status */}
                  {imageSrc && completedCrop && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>Live Preview Active</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 shadow-xl text-white w-full">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Ready to continue?
                </h3>
                <p className="text-purple-100 text-sm">
                  Your image is ready for advanced editing
                </p>
              </div>

              <button
                onClick={handleNext}
                disabled={!imageSrc || !completedCrop || isProcessing}
                className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-[1.02]"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Advanced Editor</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
          className="hidden"
      />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          border: 3px solid white;
          transition: all 0.2s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.5);
        }
        .slider::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
