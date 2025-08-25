"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../../components/ui/button";
import { Slider } from "../../components/ui/slider";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { useRouter } from "next/navigation";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  Palette,
  Download,
  ArrowLeft,
  Move,
  Filter,
  Sun,
  Moon,
  Frame,
  Layers,
  Crop,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  Minimize2,
  Undo,
  Redo,
  Save,
  X,
  Bookmark,
} from "lucide-react";

// Import tool components
import AdjustTool from "../components/tools/AdjustTool";
import FilterTool from "../components/tools/FilterTool";
import ShadowTool from "../components/tools/ShadowTool";
import OutlineTool from "../components/tools/OutlineTool";
import GlowTool from "../components/tools/GlowTool";
import BackgroundTool from "../components/tools/BackgroundTool";
import TransformTool from "../components/tools/TransformTool";

// Import types
import { ImageEffects, BackgroundData } from "../types/image";

export default function EditPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const toolsContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // State variables
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });
  const [imageLayerVisible, setImageLayerVisible] = useState(true);
  const [backgroundLayerVisible, setBackgroundLayerVisible] = useState(true);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");

  // Saved state for reverting changes
  const [savedImageEffects, setSavedImageEffects] = useState<ImageEffects>({
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
    tint: 0,
    scale: 100,
    rotation: 0,
    flipH: false,
    flipV: false,
    shadow: {
      enabled: false,
      type: "drop",
      offsetX: 10,
      offsetY: 10,
      blur: 10,
      color: "#000000",
      opacity: 50,
      spread: 0,
    },
    outline: {
      enabled: false,
      type: "solid",
      width: 2,
      color: "#000000",
      opacity: 100,
      style: "outside",
    },
    glow: {
      enabled: false,
      type: "solid",
      blur: 10,
      color: "#ffffff",
      opacity: 50,
      intensity: 1,
      spread: 0,
      style: "outside",
      animation: false,
    },
  });

  const [imageEffects, setImageEffects] = useState<ImageEffects>({
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
    tint: 0,
    scale: 100,
    rotation: 0,
    flipH: false,
    flipV: false,
    shadow: {
      enabled: false,
      type: "drop",
      offsetX: 10,
      offsetY: 10,
      blur: 10,
      color: "#000000",
      opacity: 50,
      spread: 0,
    },
    outline: {
      enabled: false,
      type: "solid",
      width: 2,
      color: "#000000",
      opacity: 100,
      style: "outside",
    },
    glow: {
      enabled: false,
      type: "solid",
      blur: 10,
      color: "#ffffff",
      opacity: 50,
      intensity: 1,
      spread: 0,
      style: "outside",
      animation: false,
    },
  });

  const [backgroundData, setBackgroundData] = useState<BackgroundData>({
    type: "color",
    color: "#ffffff",
  });

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  // Tool categories and their icons
  const toolCategories = [
    {
      id: "adjust",
      name: "Adjust",
      icon: Sun,
      color: "from-blue-500 to-cyan-500",
      description: "",
    },
    {
      id: "filter",
      name: "Filter",
      icon: Filter,
      color: "from-purple-500 to-pink-500",
      description: "",
    },
    {
      id: "shadow",
      name: "Shadow",
      icon: Moon,
      color: "from-orange-500 to-red-500",
      description: "",
    },
    {
      id: "outline",
      name: "Outline",
      icon: Frame,
      color: "from-indigo-500 to-purple-500",
      description: "",
    },
    {
      id: "glow",
      name: "Glow",
      icon: Sun,
      color: "from-yellow-500 to-orange-500",
      description: "",
    },
    {
      id: "background",
      name: "Background",
      icon: Layers,
      color: "from-teal-500 to-blue-500",
      description: "",
    },
    {
      id: "transform",
      name: "Transform",
      icon: Move,
      color: "from-amber-500 to-orange-500",
      description: "",
    },
    {
      id: "crop",
      name: "Crop",
      icon: Crop,
      color: "from-rose-500 to-pink-500",
      description: "",
    },
  ];

  // Color palette for background and other color tools
  const colorPalette = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFDBCA",
    "#FFB6C1",
    "#FF69B4",
    "#FF1493",
    "#DC143C",
    "#B22222",
    "#8B0000",
    "#800000",
    "#FFA500",
    "#FF8C00",
    "#FF7F50",
    "#FF6347",
    "#FF4500",
    "#FF8C00",
    "#D2691E",
    "#CD853F",
    "#FFFF00",
    "#FFD700",
    "#FFA500",
    "#FF8C00",
    "#FF7F50",
    "#FF6347",
    "#FF4500",
    "#FF8C00",
    "#32CD32",
    "#00FF00",
    "#00FA9A",
    "#00CED1",
    "#20B2AA",
    "#48D1CC",
    "#40E0D0",
    "#7FFFD4",
    "#1E90FF",
    "#00BFFF",
    "#87CEEB",
    "#87CEFA",
    "#B0E0E6",
    "#ADD8E6",
    "#B0C4DE",
    "#A9A9A9",
    "#8A2BE2",
    "#9370DB",
    "#BA55D3",
    "#9932CC",
    "#8B008B",
    "#800080",
    "#4B0082",
    "#2E8B57",
  ];

  // Functions
  const openTool = (toolId: string) => {
    setActiveTool(toolId);
  };

  const closeTool = () => {
    // For shadow tool, don't revert since changes auto-save
    // For other tools, revert to saved state when closing without saving
    if (activeTool === "shadow") {
      // Shadow changes are already saved, just close the tool
      setActiveTool(null);
    } else {
      // Revert other effects to saved state
      setImageEffects(savedImageEffects);
      setActiveTool(null);
    }
  };

  const scrollToolsLeft = () => {
    if (toolsContainerRef.current) {
      toolsContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollToolsRight = () => {
    if (toolsContainerRef.current) {
      toolsContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const checkScrollPosition = () => {
    if (toolsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = toolsContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSliderChange = (
    property: keyof ImageEffects,
    value: number | boolean
  ) => {
    setImageEffects((prev: ImageEffects) => ({
      ...prev,
      [property]: value,
    }));
    // Don't automatically draw canvas - wait for save
  };

  const handleShadowChange = (
    property: keyof ImageEffects["shadow"],
    value: any
  ) => {
    setImageEffects((prev: ImageEffects) => {
      const newShadow = {
        ...prev.shadow,
        [property]: value,
      };
      
      return {
        ...prev,
        shadow: newShadow,
      };
    });
    
    // Also update saved effects so shadow changes persist
    setSavedImageEffects((prev: ImageEffects) => {
      const newShadow = {
        ...prev.shadow,
        [property]: value,
      };
      
      return {
        ...prev,
        shadow: newShadow,
      };
    });
    
    // Enable live updates for shadow changes
    drawCanvas();
  };

  // New function to update entire shadow object at once
  const handleShadowUpdate = (newShadow: ImageEffects["shadow"]) => {
    console.log("EditPage: handleShadowUpdate called with:", newShadow)
    setImageEffects((prev: ImageEffects) => {
      const updatedEffects = {
        ...prev,
        shadow: newShadow,
      };
      console.log("EditPage: Updated imageEffects:", updatedEffects)
      return updatedEffects;
    });
    
    // Also update saved effects so shadow changes persist
    setSavedImageEffects((prev: ImageEffects) => {
      const updatedEffects = {
        ...prev,
        shadow: newShadow,
      };
      console.log("EditPage: Updated savedImageEffects:", updatedEffects)
      return updatedEffects;
    });
    
    // Enable live updates for shadow changes
    console.log("EditPage: Calling drawCanvas")
    drawCanvas();
  };

  const handleOutlineChange = (
    property: keyof ImageEffects["outline"],
    value: any
  ) => {
    setImageEffects((prev: ImageEffects) => ({
      ...prev,
      outline: {
        ...prev.outline,
        [property]: value,
      },
    }));
    // Don't automatically draw canvas - wait for save
  };

  const handleGlowChange = (
    property: keyof ImageEffects["glow"],
    value: any
  ) => {
    setImageEffects((prev: ImageEffects) => {
      const newGlow = {
        ...prev.glow,
        [property]: value,
      };

      return {
        ...prev,
        glow: newGlow,
      };
    });

    // Also update saved effects so glow changes persist
    setSavedImageEffects((prev: ImageEffects) => {
      const newGlow = {
        ...prev.glow,
        [property]: value,
      };

      return {
        ...prev,
        glow: newGlow,
      };
    });

    // Enable live updates for glow changes
    drawCanvas();
  };

  // Function to update entire glow object at once
  const handleGlowUpdate = (newGlow: ImageEffects["glow"]) => {
    console.log("EditPage: handleGlowUpdate called with:", newGlow)
    setImageEffects((prev: ImageEffects) => {
      const updatedEffects = {
        ...prev,
        glow: newGlow,
      };
      console.log("EditPage: Updated imageEffects:", updatedEffects)
      return updatedEffects;
    });

    // Also update saved effects so glow changes persist
    setSavedImageEffects((prev: ImageEffects) => {
      const updatedEffects = {
        ...prev,
        glow: newGlow,
      };
      console.log("EditPage: Updated savedImageEffects:", updatedEffects)
      return updatedEffects;
    });

    // Enable live updates for glow changes
    console.log("EditPage: Calling drawCanvas")
    drawCanvas();
  };

  const handleBackgroundChange = (
    property: keyof BackgroundData,
    value: any
  ) => {
    setBackgroundData((prev: BackgroundData) => ({
      ...prev,
      [property]: value,
    }));
    // Don't automatically draw canvas - wait for save
  };

  // Save template function
  const saveTemplate = async () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    setIsSavingTemplate(true);
    try {
      const templateData = {
        name: templateName.trim(),
        description: templateDescription.trim(),
        imageEffects,
        backgroundData,
        status: 'inactive'
      };

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Template saved successfully!');
        setShowTemplateDialog(false);
        setTemplateName('');
        setTemplateDescription('');
      } else {
        const error = await response.json();
        alert(`Failed to save template: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handlePresetChange = (preset: string) => {
    if (preset === "reset") {
      const resetEffects: ImageEffects = {
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
        tint: 0,
        scale: 100,
        rotation: 0,
        flipH: false,
        flipV: false,
        shadow: {
          enabled: false,
          type: "drop" as const,
          offsetX: 10,
          offsetY: 10,
          blur: 10,
          color: "#000000",
          opacity: 50,
          spread: 0,
        },
        outline: {
          enabled: false,
          type: "solid" as const,
          width: 2,
          color: "#000000",
          opacity: 100,
          style: "outside" as const,
        },
        glow: {
          enabled: false,
          type: "solid" as const,
          blur: 10,
          color: "#ffffff",
          opacity: 50,
          intensity: 1,
        },
      };
      setImageEffects(resetEffects);
      setSavedImageEffects(resetEffects);
      drawCanvas();
    } else {
      // Apply filter presets
      let newEffects: ImageEffects = { ...imageEffects };
      
      switch (preset) {
        case "vintage":
          newEffects = {
            ...newEffects,
            saturation: 120,
            temperature: 20,
            vibrance: 80,
            exposure: -5,
            highlights: 70,
            shadows: 10
          };
          break;
        case "dramatic":
          newEffects = {
            ...newEffects,
            contrast: 130,
            saturation: 110,
            exposure: -10,
            highlights: 80,
            shadows: -20,
            vibrance: 90
          };
          break;
        case "soft":
          newEffects = {
            ...newEffects,
            contrast: 90,
            saturation: 95,
            blur: 2,
            exposure: 5,
            highlights: 40,
            shadows: 15
          };
          break;
        case "monochrome":
          newEffects = {
            ...newEffects,
            grayscale: 100,
            contrast: 110,
            exposure: -5,
            highlights: 60,
            shadows: 10
          };
          break;
        case "cyberpunk":
          newEffects = {
            ...newEffects,
            saturation: 130,
            hue: 180,
            temperature: -30,
            vibrance: 100,
            exposure: -15,
            highlights: 90,
            shadows: -30
          };
          break;
        case "warm":
          newEffects = {
            ...newEffects,
            temperature: 30,
            saturation: 110,
            vibrance: 85,
            exposure: 5,
            highlights: 70
          };
          break;
        case "cool":
          newEffects = {
            ...newEffects,
            temperature: -30,
            saturation: 105,
            vibrance: 80,
            exposure: -5,
            highlights: 50
          };
          break;
        case "bright":
          newEffects = {
            ...newEffects,
            brightness: 120,
            exposure: 15,
            highlights: 80,
            shadows: 20,
            vibrance: 90
          };
          break;
        case "dark":
          newEffects = {
            ...newEffects,
            brightness: 80,
            exposure: -20,
            highlights: 30,
            shadows: -40,
            contrast: 120
          };
          break;
        default:
          return; // Don't apply unknown presets
      }
      
      setImageEffects(newEffects);
      setSavedImageEffects(newEffects);
      drawCanvas();
    }
  };

  // New function to handle saving changes from tools
  const handleSaveChanges = (newEffects: ImageEffects) => {
    setImageEffects(newEffects);
    setSavedImageEffects(newEffects); // Save the current state
    drawCanvas(); // Now draw the canvas with saved changes
  };

  const handleUndo = () => {
    console.log("Undo");
  };

  const handleRedo = () => {
    console.log("Redo");
  };

  const drawBackground = useCallback(
    (ctx: CanvasRenderingContext2D, backgroundData: BackgroundData) => {
      if (backgroundData.type === "color" && backgroundData.color) {
        ctx.fillStyle = backgroundData.color;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      } else if (
        backgroundData.type === "gradient" &&
        backgroundData.gradient
      ) {
        const gradientData = backgroundData.gradient;
        if (gradientData.colors && gradientData.colors.length > 0) {
          let gradient;
          
          if (gradientData.type === "radial") {
            // Create radial gradient from center
            const centerX = ctx.canvas.width / 2;
            const centerY = ctx.canvas.height / 2;
            const radius = Math.max(ctx.canvas.width, ctx.canvas.height) / 2;
            gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
          } else if (gradientData.type === "conic") {
            // Create conic gradient from center
            const centerX = ctx.canvas.width / 2;
            const centerY = ctx.canvas.height / 2;
            const startAngle = (gradientData.direction || 0) * Math.PI / 180;
            gradient = ctx.createConicGradient(startAngle, centerX, centerY);
          } else {
            // Default to linear gradient
            const angle = (gradientData.direction || 0) * Math.PI / 180;
            const endX = ctx.canvas.width * Math.cos(angle);
            const endY = ctx.canvas.height * Math.sin(angle);
            gradient = ctx.createLinearGradient(0, 0, endX, endY);
          }
          
          // Add color stops
          gradientData.colors.forEach((color: string, index: number) => {
            const stop = index / (gradientData.colors.length - 1);
            gradient.addColorStop(stop, color);
          });
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
      } else if (backgroundData.type === "pattern" && backgroundData.pattern) {
        // Handle pattern backgrounds
        const patternData = backgroundData.pattern;
        if (patternData.type && patternData.opacity !== undefined) {
          // Create a pattern using CSS-like patterns
          const canvas = document.createElement('canvas');
          const patternCtx = canvas.getContext('2d');
          if (patternCtx) {
            canvas.width = patternData.scale || 20;
            canvas.height = patternData.scale || 20;
            
            // Apply pattern opacity
            patternCtx.globalAlpha = (patternData.opacity || 100) / 100;
            
            // Draw pattern based on type
            if (patternData.type.includes('radial-gradient')) {
              // Dots pattern
              patternCtx.fillStyle = '#000000';
              patternCtx.beginPath();
              patternCtx.arc(canvas.width / 2, canvas.height / 2, 1, 0, 2 * Math.PI);
              patternCtx.fill();
            } else if (patternData.type.includes('repeating-linear-gradient')) {
              // Lines pattern
              patternCtx.strokeStyle = '#000000';
              patternCtx.lineWidth = 1;
              patternCtx.beginPath();
              patternCtx.moveTo(0, 0);
              patternCtx.lineTo(canvas.width, canvas.height);
              patternCtx.stroke();
            } else if (patternData.type.includes('linear-gradient')) {
              // Grid pattern
              patternCtx.strokeStyle = '#000000';
              patternCtx.lineWidth = 1;
              patternCtx.beginPath();
              patternCtx.moveTo(0, 0);
              patternCtx.lineTo(canvas.width, 0);
              patternCtx.moveTo(0, 0);
              patternCtx.lineTo(0, canvas.height);
              patternCtx.stroke();
            }
            
            // Create pattern and fill background
            const pattern = ctx.createPattern(canvas, 'repeat');
            if (pattern) {
              ctx.fillStyle = pattern;
              ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
          }
        }
      } else if (backgroundData.type === "image" && backgroundData.image) {
        // Handle image backgrounds
        const imageData = backgroundData.image;
        if (imageData.url) {
          // Check if background image is already loaded
          if (backgroundImageRef.current && backgroundImageRef.current.complete && backgroundImageRef.current.naturalWidth > 0) {
            const img = backgroundImageRef.current;
            ctx.globalAlpha = (imageData.opacity || 100) / 100;
            
            // Apply blur effect if specified
            if (imageData.blur && imageData.blur > 0) {
              // Create temporary canvas for blur effect
              const tempCanvas = document.createElement('canvas');
              const tempCtx = tempCanvas.getContext('2d');
              if (tempCtx) {
                // Set temp canvas size to match the final display size
                let displayWidth, displayHeight;
                
                if (imageData.fit === "cover") {
                  const scale = Math.max(ctx.canvas.width / img.naturalWidth, ctx.canvas.height / img.naturalHeight);
                  displayWidth = img.naturalWidth * scale;
                  displayHeight = img.naturalHeight * scale;
                } else if (imageData.fit === "contain") {
                  const scale = Math.min(ctx.canvas.width / img.naturalWidth, ctx.canvas.height / img.naturalHeight);
                  displayWidth = img.naturalWidth * scale;
                  displayHeight = img.naturalHeight * scale;
                } else if (imageData.fit === "fill") {
                  displayWidth = ctx.canvas.width;
                  displayHeight = ctx.canvas.height;
                } else {
                  // For repeat, use original size
                  displayWidth = img.naturalWidth;
                  displayHeight = img.naturalHeight;
                }
                
                tempCanvas.width = displayWidth;
                tempCanvas.height = displayHeight;
                
                // Apply blur filter
                tempCtx.filter = `blur(${imageData.blur}px)`;
                
                // Draw image to temp canvas with blur
                if (imageData.fit === "cover") {
                  const scale = Math.max(ctx.canvas.width / img.naturalWidth, ctx.canvas.height / img.naturalHeight);
                  const x = (displayWidth - img.naturalWidth * scale) / 2;
                  const y = (displayHeight - img.naturalHeight * scale) / 2;
                  tempCtx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
                } else if (imageData.fit === "contain") {
                  const scale = Math.min(ctx.canvas.width / img.naturalWidth, ctx.canvas.height / img.naturalHeight);
                  const x = (displayWidth - img.naturalWidth * scale) / 2;
                  const y = (displayHeight - img.naturalHeight * scale) / 2;
                  tempCtx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
                } else if (imageData.fit === "fill") {
                  tempCtx.drawImage(img, 0, 0, displayWidth, displayHeight);
                } else {
                  // For repeat, draw at original size
                  tempCtx.drawImage(img, 0, 0);
                }
                
                // Draw blurred image to main canvas
                if (imageData.fit === "cover") {
                  const scale = Math.max(ctx.canvas.width / img.naturalWidth, ctx.canvas.height / img.naturalHeight);
                  const x = (ctx.canvas.width - displayWidth) / 2;
                  const y = (ctx.canvas.height - displayHeight) / 2;
                  ctx.drawImage(tempCanvas, x, y);
                } else if (imageData.fit === "contain") {
                  const scale = Math.min(ctx.canvas.width / img.naturalWidth, ctx.canvas.height / img.naturalHeight);
                  const x = (ctx.canvas.width - displayWidth) / 2;
                  const y = (ctx.canvas.height - displayHeight) / 2;
                  ctx.drawImage(tempCanvas, x, y);
                } else if (imageData.fit === "fill") {
                  ctx.drawImage(tempCanvas, 0, 0);
                } else if (imageData.fit === "repeat") {
                  // For repeat, create pattern from blurred image
                  const pattern = ctx.createPattern(tempCanvas, 'repeat');
                  if (pattern) {
                    ctx.fillStyle = pattern;
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                  }
                }
              }
            } else {
              // No blur - draw image directly
              if (imageData.fit === "cover") {
                // Cover: fill entire canvas, maintaining aspect ratio
                const scale = Math.max(ctx.canvas.width / img.naturalWidth, ctx.canvas.height / img.naturalHeight);
                const x = (ctx.canvas.width - img.naturalWidth * scale) / 2;
                const y = (ctx.canvas.height - img.naturalHeight * scale) / 2;
                ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
              } else if (imageData.fit === "contain") {
                // Contain: fit within canvas, maintaining aspect ratio
                const scale = Math.min(ctx.canvas.width / img.naturalWidth, ctx.canvas.height / img.naturalHeight);
                const x = (ctx.canvas.width - img.naturalWidth * scale) / 2;
                const y = (ctx.canvas.height - img.naturalHeight * scale) / 2;
                ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
              } else if (imageData.fit === "fill") {
                // Fill: stretch to fit canvas
                ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
              } else if (imageData.fit === "repeat") {
                // Repeat: tile pattern
                const pattern = ctx.createPattern(img, 'repeat');
                if (pattern) {
                  ctx.fillStyle = pattern;
                  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                }
              }
            }
            
            ctx.globalAlpha = 1;
          } else {
            // If image is not loaded yet, load it and redraw when ready
            if (backgroundImageRef.current) {
              const img = backgroundImageRef.current;
              if (img.src !== imageData.url) {
                img.src = imageData.url;
                img.onload = () => {
                  // Use setTimeout to avoid calling drawCanvas during rendering
                  setTimeout(() => {
                    if (canvasRef.current) {
                      drawCanvas();
                    }
                  }, 0);
                };
              }
            }
          }
        }
      }
    },
    [] // Remove circular dependency
  );

  const drawGlow = useCallback((ctx: CanvasRenderingContext2D, glow: ImageEffects['glow']) => {
    ctx.save();

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const blur = glow.blur;
    const opacity = glow.opacity / 100;
    const intensity = glow.intensity;
    const spread = glow.spread || 0;

    // Create temporary canvas for the glow effect
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
      ctx.restore();
      return;
    }

    tempCanvas.width = width;
    tempCanvas.height = height;

    // Draw the current canvas content to temp canvas
    tempCtx.drawImage(ctx.canvas, 0, 0);

    // Create a mask from the image content (non-transparent areas)
    const imageData = tempCtx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Create a mask canvas
    const maskCanvas = document.createElement('canvas');
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) {
      ctx.restore();
      return;
    }
    
    maskCanvas.width = width;
    maskCanvas.height = height;
    
    // Create mask from non-transparent pixels
    const maskData = new ImageData(width, height);
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) { // If pixel has alpha
        maskData.data[i] = 255;     // R
        maskData.data[i + 1] = 255; // G
        maskData.data[i + 2] = 255; // B
        maskData.data[i + 3] = 255; // A
      }
    }
    
    maskCtx.putImageData(maskData, 0, 0);

    // Create glow effect using the mask
    const glowCanvas = document.createElement('canvas');
    const glowCtx = glowCanvas.getContext('2d');
    if (!glowCtx) {
      ctx.restore();
      return;
    }
    
    glowCanvas.width = width;
    glowCanvas.height = height;
    
    // Clear the glow canvas and set up for glow effect
    glowCtx.clearRect(0, 0, width, height);
    
    // Apply glow based on type
    switch (glow.type) {
      case "solid":
        // Create solid glow effect using shadow
        glowCtx.shadowColor = hexToRgb(glow.color, opacity * intensity);
        glowCtx.shadowBlur = blur;
        glowCtx.shadowOffsetX = 0;
        glowCtx.shadowOffsetY = 0;
        glowCtx.drawImage(maskCanvas, 0, 0);
        break;

      case "gradient":
        // Create gradient glow effect
        glowCtx.shadowColor = hexToRgb(glow.color, opacity * intensity);
        glowCtx.shadowBlur = blur;
        glowCtx.shadowOffsetX = 0;
        glowCtx.shadowOffsetY = 0;
        glowCtx.drawImage(maskCanvas, 0, 0);
        break;

      case "soft":
        // Soft, gentle glow
        glowCtx.shadowColor = hexToRgb(glow.color, opacity * intensity * 0.5);
        glowCtx.shadowBlur = blur * 2;
        glowCtx.shadowOffsetX = 0;
        glowCtx.shadowOffsetY = 0;
        glowCtx.drawImage(maskCanvas, 0, 0);
        break;

      case "neon":
        // Bright neon-style glow
        glowCtx.shadowColor = hexToRgb(glow.color, opacity * intensity);
        glowCtx.shadowBlur = blur;
        glowCtx.shadowOffsetX = 0;
        glowCtx.shadowOffsetY = 0;
        glowCtx.drawImage(maskCanvas, 0, 0);
        break;

      case "colorful":
        // Multi-color vibrant glow
        const colors = [glow.color, glow.color2 || '#FFFF00', glow.color3 || '#FF00FF'];
        for (let i = 0; i < colors.length; i++) {
          glowCtx.shadowColor = hexToRgb(colors[i], opacity * intensity * (1 - i / colors.length));
          glowCtx.shadowBlur = blur + i * 3;
          glowCtx.shadowOffsetX = 0;
          glowCtx.shadowOffsetY = 0;
          glowCtx.drawImage(maskCanvas, 0, 0);
        }
        break;

      case "rim":
        // Subtle rim lighting effect
        glowCtx.shadowColor = hexToRgb(glow.color, opacity * intensity * 0.7);
        glowCtx.shadowBlur = blur * 0.5;
        glowCtx.shadowOffsetX = 0;
        glowCtx.shadowOffsetY = 0;
        glowCtx.drawImage(maskCanvas, 0, 0);
        break;

      case "halo":
        // Angelic halo glow effect
        glowCtx.shadowColor = hexToRgb(glow.color, opacity * intensity);
        glowCtx.shadowBlur = blur * 1.5;
        glowCtx.shadowOffsetX = 0;
        glowCtx.shadowOffsetY = 0;
        glowCtx.drawImage(maskCanvas, 0, 0);
        break;

      case "chromatic":
        // Color-shifting chromatic effect
        const chromaticColors = [
          glow.color,
          glow.color2 || '#FF0000',
          glow.color3 || '#00FF00',
          '#0000FF',
          '#FF00FF'
        ];
        for (let i = 0; i < chromaticColors.length; i++) {
          glowCtx.shadowColor = hexToRgb(chromaticColors[i], opacity * intensity * (1 - i / chromaticColors.length));
          glowCtx.shadowBlur = blur + i * 2;
          glowCtx.shadowOffsetX = 0;
          glowCtx.shadowOffsetY = 0;
          glowCtx.drawImage(maskCanvas, 0, 0);
        }
        break;

      case "fire":
        // Flaming glow effect
        const fireColors = ['#FFFF00', '#FFA500', '#FF4500', '#FF0000'];
        for (let i = 0; i < fireColors.length; i++) {
          glowCtx.shadowColor = hexToRgb(fireColors[i], opacity * intensity * (1 - i / fireColors.length));
          glowCtx.shadowBlur = blur + i * 2;
          glowCtx.shadowOffsetX = 0;
          glowCtx.shadowOffsetY = 0;
          glowCtx.drawImage(maskCanvas, 0, 0);
        }
        break;

      case "ice":
        // Icy cool glow effect
        const iceColors = ['#E0FFFF', '#87CEEB', '#4682B4', '#000080'];
        for (let i = 0; i < iceColors.length; i++) {
          glowCtx.shadowColor = hexToRgb(iceColors[i], opacity * intensity * (1 - i / iceColors.length));
          glowCtx.shadowBlur = blur + i * 2;
          glowCtx.shadowOffsetX = 0;
          glowCtx.shadowOffsetY = 0;
          glowCtx.drawImage(maskCanvas, 0, 0);
        }
        break;

      case "aurora":
        // Northern lights aurora effect
        const auroraColors = [
          glow.color,
          glow.color2 || '#00FF00',
          glow.color3 || '#0080FF',
          '#8000FF',
          '#FF0080'
        ];
        for (let i = 0; i < auroraColors.length; i++) {
          const waveOffset = Math.sin(Date.now() * 0.001 + i) * 5;
          glowCtx.shadowColor = hexToRgb(auroraColors[i], opacity * intensity * (1 - i / auroraColors.length));
          glowCtx.shadowBlur = blur + i * 2 + waveOffset;
          glowCtx.shadowOffsetX = 0;
          glowCtx.shadowOffsetY = 0;
          glowCtx.drawImage(maskCanvas, 0, 0);
        }
        break;

      default:
        // Fallback to solid glow
        glowCtx.shadowColor = hexToRgb(glow.color, opacity * intensity);
        glowCtx.shadowBlur = blur;
        glowCtx.shadowOffsetX = 0;
        glowCtx.shadowOffsetY = 0;
        glowCtx.drawImage(maskCanvas, 0, 0);
    }

    // Apply the glow effect to the main canvas
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(glowCanvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    ctx.restore();
  }, []);

  const drawOutline = useCallback((ctx: CanvasRenderingContext2D, outline: ImageEffects['outline']) => {
    ctx.save();

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const outlineWidth = outline.width;
    const opacity = outline.opacity / 100;

    // Calculate outline position based on style
    let offset = 0;
    if (outline.style === "outside") {
      offset = outlineWidth / 2;
    } else if (outline.style === "inside") {
      offset = -outlineWidth / 2;
    } // center = 0

    const outlineRect = {
      x: offset,
      y: offset,
      w: width - offset * 2,
      h: height - offset * 2
    };

    switch (outline.type) {
      case "solid":
        ctx.strokeStyle = hexToRgb(outline.color, opacity);
        ctx.lineWidth = outlineWidth;
        ctx.strokeRect(outlineRect.x, outlineRect.y, outlineRect.w, outlineRect.h);
        break;

      case "gradient":
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, hexToRgb(outline.color, opacity));
        gradient.addColorStop(1, hexToRgb(outline.color2 || outline.color, opacity));
        ctx.strokeStyle = gradient;
        ctx.lineWidth = outlineWidth;
        ctx.strokeRect(outlineRect.x, outlineRect.y, outlineRect.w, outlineRect.h);
        break;

      case "double":
        // Draw two outlines with different offsets
        ctx.strokeStyle = hexToRgb(outline.color, opacity * 0.8);
        ctx.lineWidth = outlineWidth / 2;
        ctx.strokeRect(outlineRect.x - 1, outlineRect.y - 1, outlineRect.w + 2, outlineRect.h + 2);

        ctx.strokeStyle = hexToRgb(outline.color, opacity);
        ctx.lineWidth = outlineWidth / 2;
        ctx.strokeRect(outlineRect.x, outlineRect.y, outlineRect.w, outlineRect.h);
        break;

      case "corners":
        // Draw only corner rectangles
        const cornerSize = outline.cornerRadius || 20;
        const cornerWidth = Math.min(cornerSize, outlineRect.w / 2);
        const cornerHeight = Math.min(cornerSize, outlineRect.h / 2);

        ctx.strokeStyle = hexToRgb(outline.color, opacity);
        ctx.lineWidth = outlineWidth;

        // Top-left corner
        ctx.strokeRect(outlineRect.x, outlineRect.y, cornerWidth, cornerHeight);
        // Top-right corner
        ctx.strokeRect(outlineRect.x + outlineRect.w - cornerWidth, outlineRect.y, cornerWidth, cornerHeight);
        // Bottom-left corner
        ctx.strokeRect(outlineRect.x, outlineRect.y + outlineRect.h - cornerHeight, cornerWidth, cornerHeight);
        // Bottom-right corner
        ctx.strokeRect(outlineRect.x + outlineRect.w - cornerWidth, outlineRect.y + outlineRect.h - cornerHeight, cornerWidth, cornerHeight);
        break;

      case "corners-gradient":
        const cornerGradient = ctx.createLinearGradient(0, 0, width, height);
        cornerGradient.addColorStop(0, hexToRgb(outline.color, opacity));
        cornerGradient.addColorStop(1, hexToRgb(outline.color2 || outline.color, opacity));

        const cornerSizeGrad = outline.cornerRadius || 20;
        const cornerWidthGrad = Math.min(cornerSizeGrad, outlineRect.w / 2);
        const cornerHeightGrad = Math.min(cornerSizeGrad, outlineRect.h / 2);

        ctx.strokeStyle = cornerGradient;
        ctx.lineWidth = outlineWidth;

        // Top-left corner
        ctx.strokeRect(outlineRect.x, outlineRect.y, cornerWidthGrad, cornerHeightGrad);
        // Top-right corner
        ctx.strokeRect(outlineRect.x + outlineRect.w - cornerWidthGrad, outlineRect.y, cornerWidthGrad, cornerHeightGrad);
        // Bottom-left corner
        ctx.strokeRect(outlineRect.x, outlineRect.y + outlineRect.h - cornerHeightGrad, cornerWidthGrad, cornerHeightGrad);
        // Bottom-right corner
        ctx.strokeRect(outlineRect.x + outlineRect.w - cornerWidthGrad, outlineRect.y + outlineRect.h - cornerHeightGrad, cornerWidthGrad, cornerHeightGrad);
        break;

      case "dashed":
        ctx.strokeStyle = hexToRgb(outline.color, opacity);
        ctx.lineWidth = outlineWidth;
        ctx.setLineDash([outline.dashLength || 10, outline.gapLength || 5]);
        ctx.strokeRect(outlineRect.x, outlineRect.y, outlineRect.w, outlineRect.h);
        ctx.setLineDash([]); // Reset dash
        break;

      case "dotted":
        ctx.strokeStyle = hexToRgb(outline.color, opacity);
        ctx.lineWidth = outlineWidth;
        ctx.setLineDash([1, outline.gapLength || 3]);
        ctx.strokeRect(outlineRect.x, outlineRect.y, outlineRect.w, outlineRect.h);
        ctx.setLineDash([]); // Reset dash
        break;

      case "inset":
        // Create inset effect with darker inner shadow
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = outlineWidth;
        ctx.shadowOffsetX = outlineWidth / 2;
        ctx.shadowOffsetY = outlineWidth / 2;

        ctx.strokeStyle = hexToRgb(outline.color, opacity);
        ctx.lineWidth = outlineWidth;
        ctx.strokeRect(outlineRect.x, outlineRect.y, outlineRect.w, outlineRect.h);

        // Clear shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        break;

      case "neon-glow":
        // Create neon glow effect
        const glowIntensity = outline.glowIntensity || 5;

        // Draw multiple layers for glow effect
        for (let i = glowIntensity; i > 0; i--) {
          const alpha = (opacity / glowIntensity) * (glowIntensity - i + 1);
          ctx.strokeStyle = hexToRgb(outline.color, alpha);
          ctx.lineWidth = outlineWidth + i * 2;
          ctx.strokeRect(outlineRect.x - i, outlineRect.y - i, outlineRect.w + i * 2, outlineRect.h + i * 2);
        }

        // Draw main outline on top
        ctx.strokeStyle = hexToRgb(outline.color, opacity);
        ctx.lineWidth = outlineWidth;
        ctx.strokeRect(outlineRect.x, outlineRect.y, outlineRect.w, outlineRect.h);
        break;

      case "rainbow":
        // Create rainbow gradient effect
        const rainbowGradient = ctx.createLinearGradient(0, 0, width, height);
        rainbowGradient.addColorStop(0, hexToRgb(outline.color, opacity)); // Primary color
        rainbowGradient.addColorStop(0.25, hexToRgb(outline.color2 || '#FFFF00', opacity)); // Yellow
        rainbowGradient.addColorStop(0.5, hexToRgb(outline.color3 || '#00FF00', opacity)); // Green
        rainbowGradient.addColorStop(0.75, hexToRgb('#0000FF', opacity)); // Blue
        rainbowGradient.addColorStop(1, hexToRgb('#FF00FF', opacity)); // Magenta

        ctx.strokeStyle = rainbowGradient;
        ctx.lineWidth = outlineWidth;
        ctx.strokeRect(outlineRect.x, outlineRect.y, outlineRect.w, outlineRect.h);
        break;

      case "vintage":
        // Vintage style with slight irregularity
        ctx.strokeStyle = hexToRgb(outline.color, opacity);
        ctx.lineWidth = outlineWidth;

        // Add slight randomness for vintage feel
        const vintageOffset = outlineWidth * 0.3;
        ctx.setLineDash([outlineWidth * 3, outlineWidth]);

        // Draw with slight offset for vintage effect
        ctx.strokeRect(
          outlineRect.x + (Math.random() - 0.5) * vintageOffset,
          outlineRect.y + (Math.random() - 0.5) * vintageOffset,
          outlineRect.w + (Math.random() - 0.5) * vintageOffset,
          outlineRect.h + (Math.random() - 0.5) * vintageOffset
        );
        ctx.setLineDash([]); // Reset dash
        break;

      case "modern":
        // Clean modern style with rounded corners
        const radius = Math.min(10, outlineWidth * 2);
        ctx.strokeStyle = hexToRgb(outline.color, opacity);
        ctx.lineWidth = outlineWidth;

        // Draw rounded rectangle
        ctx.beginPath();
        ctx.roundRect(outlineRect.x, outlineRect.y, outlineRect.w, outlineRect.h, radius);
        ctx.stroke();
        break;

      case "artistic":
        // Artistic brush stroke effect
        ctx.strokeStyle = hexToRgb(outline.color, opacity);
        ctx.lineWidth = outlineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (outline.pattern === "brush") {
          // Brush stroke pattern
          ctx.setLineDash([outlineWidth * 2, outlineWidth * 0.5]);
        } else if (outline.pattern === "ink") {
          // Ink splatter pattern
          ctx.setLineDash([1, outlineWidth, outlineWidth * 3, outlineWidth * 0.5]);
        }

        // Draw with artistic variation
        const artisticOffset = outlineWidth * 0.2;
        ctx.strokeRect(
          outlineRect.x + (Math.random() - 0.5) * artisticOffset,
          outlineRect.y + (Math.random() - 0.5) * artisticOffset,
          outlineRect.w,
          outlineRect.h
        );
        ctx.setLineDash([]); // Reset dash
        break;

      default:
        // Fallback to solid outline
        ctx.strokeStyle = hexToRgb(outline.color, opacity);
        ctx.lineWidth = outlineWidth;
        ctx.strokeRect(outlineRect.x, outlineRect.y, outlineRect.w, outlineRect.h);
    }

    ctx.restore();
  }, []);

  const drawImage = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
      // Apply image effects
      const filters = [];
      if (imageEffects.brightness !== 100)
        filters.push(`brightness(${imageEffects.brightness}%)`);
      if (imageEffects.contrast !== 100)
        filters.push(`contrast(${imageEffects.contrast}%)`);
      if (imageEffects.saturation !== 100)
        filters.push(`saturate(${imageEffects.saturation}%)`);
      if (imageEffects.blur > 0) filters.push(`blur(${imageEffects.blur}px)`);
      if (imageEffects.hue !== 0)
        filters.push(`hue-rotate(${imageEffects.hue}deg)`);
      if (imageEffects.sepia > 0) filters.push(`sepia(${imageEffects.sepia}%)`);
      if (imageEffects.grayscale > 0)
        filters.push(`grayscale(${imageEffects.grayscale}%)`);
      if (imageEffects.invert > 0)
        filters.push(`invert(${imageEffects.invert}%)`);

      // Apply advanced effects using pixel manipulation
      if (
        imageEffects.vibrance !== 60 ||
        imageEffects.exposure !== -6 ||
        imageEffects.highlights !== 62 ||
        imageEffects.shadows !== 0 ||
        imageEffects.temperature !== 0 ||
        imageEffects.tint !== 0
      ) {
        // Create temporary canvas for pixel manipulation
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCanvas.width = img.naturalWidth;
          tempCanvas.height = img.naturalHeight;

          // Draw image with basic filters first
          tempCtx.filter = filters.join(" ");
          tempCtx.drawImage(img, 0, 0);

          // Get image data for pixel manipulation
          const imageData = tempCtx.getImageData(
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
          );
          const data = imageData.data;

          // Apply advanced adjustments
          for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            // Vibrance
            if (imageEffects.vibrance !== 60) {
              const vibrance = (imageEffects.vibrance - 60) / 100;
              const max = Math.max(r, g, b);
              const min = Math.min(r, g, b);
              const delta = max - min;
              const gray = (r + g + b) / 3;

              if (delta > 0) {
                r += (r - gray) * vibrance;
                g += (g - gray) * vibrance;
                b += (b - gray) * vibrance;
              }
            }

            // Exposure
            if (imageEffects.exposure !== -6) {
              const exposure = (imageEffects.exposure + 6) / 100;
              r = Math.min(255, r * (1 + exposure));
              g = Math.min(255, g * (1 + exposure));
              b = Math.min(255, b * (1 + exposure));
            }

            // Temperature (warm/cool)
            if (imageEffects.temperature !== 0) {
              const temp = imageEffects.temperature / 100;
              r = Math.min(255, r + temp * 20);
              b = Math.min(255, b - temp * 20);
            }

            // Tint (green/magenta)
            if (imageEffects.tint !== 0) {
              const tint = imageEffects.tint / 100;
              g = Math.min(255, g + tint * 20);
              r = Math.min(255, r - tint * 10);
              b = Math.min(255, b - tint * 10);
            }

            data[i] = Math.max(0, Math.min(255, r));
            data[i + 1] = Math.max(0, Math.min(255, g));
            data[i + 2] = Math.max(0, Math.min(255, b));
          }

          tempCtx.putImageData(imageData, 0, 0);

          // Apply shadow if enabled - draw shadow BEFORE the processed image
          if (imageEffects.shadow.enabled) {
            ctx.save();
            
            // Create a temporary canvas for the shadow
            const shadowCanvas = document.createElement('canvas');
            const shadowCtx = shadowCanvas.getContext('2d');
            if (shadowCtx) {
              shadowCanvas.width = ctx.canvas.width;
              shadowCanvas.height = ctx.canvas.height;
              
              // Draw the processed image to shadow canvas first
              shadowCtx.drawImage(tempCanvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
              
              // Apply shadow effect
              if (imageEffects.shadow.type === "gradient") {
                // Create gradient shadow mask
                const gradient = shadowCtx.createLinearGradient(
                  0,
                  0,
                  ctx.canvas.width,
                  ctx.canvas.height
                );
                if (imageEffects.shadow.color2) {
                  gradient.addColorStop(
                    0,
                    hexToRgb(
                      imageEffects.shadow.color,
                      imageEffects.shadow.opacity / 100
                    )
                  );
                  gradient.addColorStop(
                    1,
                    hexToRgb(
                      imageEffects.shadow.color2,
                      imageEffects.shadow.opacity / 100
                    )
                  );
                } else {
                  gradient.addColorStop(
                    0,
                    hexToRgb(
                      imageEffects.shadow.color,
                      imageEffects.shadow.opacity / 100
                    )
                  );
                  gradient.addColorStop(1, hexToRgb(imageEffects.shadow.color, 0));
                }
                
                // Create shadow mask from image alpha
                const imageData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height);
                const data = imageData.data;
                
                // Apply gradient color to non-transparent pixels
                for (let i = 0; i < data.length; i += 4) {
                  if (data[i + 3] > 0) { // If pixel has alpha
                    const r = parseInt(imageEffects.shadow.color.slice(1, 3), 16);
                    const g = parseInt(imageEffects.shadow.color.slice(3, 5), 16);
                    const b = parseInt(imageEffects.shadow.color.slice(5, 7), 16);
                    data[i] = r;
                    data[i + 1] = g;
                    data[i + 2] = b;
                    data[i + 3] = Math.floor((imageEffects.shadow.opacity / 100) * 255);
                  }
                }
                
                shadowCtx.putImageData(imageData, 0, 0);
              } else {
                // Regular shadow - create shadow mask from image alpha
                const imageData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height);
                const data = imageData.data;
                
                // Apply shadow color to non-transparent pixels
                for (let i = 0; i < data.length; i += 4) {
                  if (data[i + 3] > 0) { // If pixel has alpha
                    const r = parseInt(imageEffects.shadow.color.slice(1, 3), 16);
                    const g = parseInt(imageEffects.shadow.color.slice(3, 5), 16);
                    const b = parseInt(imageEffects.shadow.color.slice(5, 7), 16);
                    data[i] = r;
                    data[i + 1] = g;
                    data[i + 2] = b;
                    data[i + 3] = Math.floor((imageEffects.shadow.opacity / 100) * 255);
                  }
                }
                
                shadowCtx.putImageData(imageData, 0, 0);
              }
              
              // Apply blur and spread to the shadow
              if (imageEffects.shadow.blur > 0 || imageEffects.shadow.spread > 0) {
                // Create a larger canvas to accommodate spread and blur
                const spread = imageEffects.shadow.spread || 0;
                const blur = imageEffects.shadow.blur || 0;
                
                // Calculate required canvas size for spread and blur
                const extraSize = Math.max(spread * 2, blur * 4);
                const blurCanvas = document.createElement('canvas');
                const blurCtx = blurCanvas.getContext('2d');
                if (blurCtx) {
                  blurCanvas.width = shadowCanvas.width + extraSize;
                  blurCanvas.height = shadowCanvas.height + extraSize;
                  
                  // Clear the blur canvas
                  blurCtx.clearRect(0, 0, blurCanvas.width, blurCanvas.height);
                  
                  // For spread effect: create a larger shadow by drawing multiple copies
                  if (spread > 0) {
                    // Draw the original shadow in the center
                    const centerX = extraSize / 2;
                    const centerY = extraSize / 2;
                    blurCtx.drawImage(
                      shadowCanvas, 
                      centerX, 
                      centerY, 
                      shadowCanvas.width, 
                      shadowCanvas.height
                    );
                    
                    // Create spread effect by drawing expanded shadow
                    // This creates a larger shadow area around the original
                    const spreadRadius = spread;
                    for (let i = 0; i < spreadRadius; i++) {
                      const alpha = (imageEffects.shadow.opacity / 100) * (1 - i / spreadRadius);
                      blurCtx.globalAlpha = alpha;
                      
                      // Draw expanded shadow with decreasing opacity
                      blurCtx.drawImage(
                        shadowCanvas,
                        centerX - i,
                        centerY - i,
                        shadowCanvas.width + (i * 2),
                        shadowCanvas.height + (i * 2)
                      );
                    }
                    blurCtx.globalAlpha = 1;
                  } else {
                    // No spread, just center the shadow
                    const offsetX = extraSize / 2;
                    const offsetY = extraSize / 2;
                    blurCtx.drawImage(
                      shadowCanvas, 
                      offsetX, 
                      offsetY, 
                      shadowCanvas.width, 
                      shadowCanvas.height
                    );
                  }
                  
                  // Apply blur filter if specified
                  if (blur > 0) {
                    blurCtx.filter = `blur(${blur}px)`;
                    // Get the blurred image data
                    const blurredData = blurCtx.getImageData(0, 0, blurCanvas.width, blurCanvas.height);
                    // Clear and redraw with blur
                    blurCtx.clearRect(0, 0, blurCanvas.width, blurCanvas.height);
                    blurCtx.putImageData(blurredData, 0, 0);
                  }
                  
                  // Draw the processed shadow with offset
                  ctx.globalCompositeOperation = 'multiply';
                  ctx.globalAlpha = imageEffects.shadow.opacity / 100;
                  ctx.drawImage(
                    blurCanvas,
                    imageEffects.shadow.offsetX - extraSize / 2,
                    imageEffects.shadow.offsetY - extraSize / 2
                  );
                  ctx.globalCompositeOperation = 'source-over';
                  ctx.globalAlpha = 1;
                }
              } else {
                // No blur or spread - draw shadow directly
                ctx.globalCompositeOperation = 'multiply';
                ctx.globalAlpha = imageEffects.shadow.opacity / 100;
                ctx.drawImage(
                  shadowCanvas,
                  imageEffects.shadow.offsetX,
                  imageEffects.shadow.offsetY
                );
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1;
              }
            }
            
            ctx.restore();
          }

          // Apply glow if enabled (for advanced effects path)
          if (imageEffects.glow.enabled) {
            drawGlow(ctx, imageEffects.glow);
          }

          // Draw the processed image
          ctx.drawImage(tempCanvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
          return;
        }
      }

      // Apply basic filters and draw image
      ctx.filter = filters.join(" ");

      // Apply shadow if enabled - draw shadow BEFORE the image
      if (imageEffects.shadow.enabled) {
        ctx.save();
        
        // Create a temporary canvas for the shadow
        const shadowCanvas = document.createElement('canvas');
        const shadowCtx = shadowCanvas.getContext('2d');
        if (shadowCtx) {
          shadowCanvas.width = ctx.canvas.width;
          shadowCanvas.height = ctx.canvas.height;
          
          // Draw the image to shadow canvas first
          shadowCtx.filter = filters.join(" ");
          shadowCtx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
          
          // Apply shadow effect
          if (imageEffects.shadow.type === "gradient") {
            // Create gradient shadow mask
            const gradient = shadowCtx.createLinearGradient(
              0,
              0,
              ctx.canvas.width,
              ctx.canvas.height
            );
            if (imageEffects.shadow.color2) {
              gradient.addColorStop(
                0,
                hexToRgb(
                  imageEffects.shadow.color,
                  imageEffects.shadow.opacity / 100
                )
              );
              gradient.addColorStop(
                1,
                hexToRgb(
                  imageEffects.shadow.color2,
                  imageEffects.shadow.opacity / 100
                )
              );
            } else {
              gradient.addColorStop(
                0,
                hexToRgb(
                  imageEffects.shadow.color,
                  imageEffects.shadow.opacity / 100
                )
              );
              gradient.addColorStop(1, hexToRgb(imageEffects.shadow.color, 0));
            }
            
            // Create shadow mask from image alpha
            const imageData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height);
            const data = imageData.data;
            
            // Apply gradient color to non-transparent pixels
            for (let i = 0; i < data.length; i += 4) {
              if (data[i + 3] > 0) { // If pixel has alpha
                const r = parseInt(imageEffects.shadow.color.slice(1, 3), 16);
                const g = parseInt(imageEffects.shadow.color.slice(3, 5), 16);
                const b = parseInt(imageEffects.shadow.color.slice(5, 7), 16);
                data[i] = r;
                data[i + 1] = g;
                data[i + 2] = b;
                data[i + 3] = Math.floor((imageEffects.shadow.opacity / 100) * 255);
              }
            }
            
            shadowCtx.putImageData(imageData, 0, 0);
          } else {
            // Regular shadow - create shadow mask from image alpha
            const imageData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height);
            const data = imageData.data;
            
            // Apply shadow color to non-transparent pixels
            for (let i = 0; i < data.length; i += 4) {
              if (data[i + 3] > 0) { // If pixel has alpha
                const r = parseInt(imageEffects.shadow.color.slice(1, 3), 16);
                const g = parseInt(imageEffects.shadow.color.slice(3, 5), 16);
                const b = parseInt(imageEffects.shadow.color.slice(5, 7), 16);
                data[i] = r;
                data[i + 1] = g;
                data[i + 2] = b;
                data[i + 3] = Math.floor((imageEffects.shadow.opacity / 100) * 255);
              }
            }
            
            shadowCtx.putImageData(imageData, 0, 0);
          }
          
          // Apply blur to the shadow
          if (imageEffects.shadow.blur > 0) {
            shadowCtx.filter = `blur(${imageEffects.shadow.blur}px)`;
            const blurredData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height);
            shadowCtx.putImageData(blurredData, 0, 0);
          }
          
          // Apply blur and spread to the shadow
          if (imageEffects.shadow.blur > 0 || imageEffects.shadow.spread > 0) {
            // Create a larger canvas to accommodate spread and blur
            const spread = imageEffects.shadow.spread || 0;
            const blur = imageEffects.shadow.blur || 0;
            
            // Calculate required canvas size for spread and blur
            const extraSize = Math.max(spread * 2, blur * 4);
            const blurCanvas = document.createElement('canvas');
            const blurCtx = blurCanvas.getContext('2d');
            if (blurCtx) {
              blurCanvas.width = shadowCanvas.width + extraSize;
              blurCanvas.height = shadowCanvas.height + extraSize;
              
              // Clear the blur canvas
              blurCtx.clearRect(0, 0, blurCanvas.width, blurCanvas.height);
              
              // Draw shadow to blur canvas with spread offset
              const offsetX = extraSize / 2;
              const offsetY = extraSize / 2;
              blurCtx.drawImage(
                shadowCanvas, 
                offsetX, 
                offsetY, 
                shadowCanvas.width, 
                shadowCanvas.height
              );
              
              // For spread effect: create a larger shadow by drawing multiple copies
              if (spread > 0) {
                // Draw the original shadow in the center
                const centerX = extraSize / 2;
                const centerY = extraSize / 2;
                blurCtx.drawImage(
                  shadowCanvas, 
                  centerX, 
                  centerY, 
                  shadowCanvas.width, 
                  shadowCanvas.height
                );
                
                // Create spread effect by drawing expanded shadow
                // This creates a larger shadow area around the original
                const spreadRadius = spread;
                for (let i = 0; i < spreadRadius; i++) {
                  const alpha = (imageEffects.shadow.opacity / 100) * (1 - i / spreadRadius);
                  blurCtx.globalAlpha = alpha;
                  
                  // Draw expanded shadow with decreasing opacity
                  blurCtx.drawImage(
                    shadowCanvas,
                    centerX - i,
                    centerY - i,
                    shadowCanvas.width + (i * 2),
                    shadowCanvas.height + (i * 2)
                  );
                }
                blurCtx.globalAlpha = 1;
              } else {
                // No spread, just center the shadow
                const offsetX = extraSize / 2;
                const offsetY = extraSize / 2;
                blurCtx.drawImage(
                  shadowCanvas, 
                  offsetX, 
                  offsetY, 
                  shadowCanvas.width, 
                  shadowCanvas.height
                );
              }
              
              // Apply blur filter if specified
              if (blur > 0) {
                blurCtx.filter = `blur(${blur}px)`;
                // Get the blurred image data
                const blurredData = blurCtx.getImageData(0, 0, blurCanvas.width, blurCanvas.height);
                // Clear and redraw with blur
                blurCtx.clearRect(0, 0, blurCanvas.width, blurCanvas.height);
                blurCtx.putImageData(blurredData, 0, 0);
              }
              
              // Draw the processed shadow with offset
              ctx.globalCompositeOperation = 'multiply';
              ctx.globalAlpha = imageEffects.shadow.opacity / 100;
              ctx.drawImage(
                blurCanvas,
                imageEffects.shadow.offsetX - extraSize / 2,
                imageEffects.shadow.offsetY - extraSize / 2
              );
              ctx.globalCompositeOperation = 'source-over';
              ctx.globalAlpha = 1;
            }
          } else {
            // No blur or spread - draw shadow directly
            ctx.globalCompositeOperation = 'multiply';
            ctx.globalAlpha = imageEffects.shadow.opacity / 100;
            ctx.drawImage(
              shadowCanvas,
              imageEffects.shadow.offsetX,
              imageEffects.shadow.offsetY
            );
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
          }
        }
        
        ctx.restore();
      }
      
      // Now draw the main image on top
      ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);

      // Apply glow if enabled
      if (imageEffects.glow.enabled) {
        drawGlow(ctx, imageEffects.glow);
      }

      // Apply outline if enabled
      if (imageEffects.outline.enabled) {
        drawOutline(ctx, imageEffects.outline);
      }
    },
    [imageEffects]
  );

  const hexToRgb = (hex: string, alpha: number = 1) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return hex;
  };

  const handleBackgroundImageLoad = useCallback(() => {
    drawCanvas();
  }, []);

  const handleDownload = useCallback(() => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = "edited-image.png";
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  }, []);

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw layers in order
    if (backgroundLayerVisible) {
      ctx.globalAlpha = 1;
      drawBackground(ctx, backgroundData);
    }

    if (imageLayerVisible && imageRef.current) {
      ctx.globalAlpha = 1;
      drawImage(ctx, imageRef.current);
    }

    ctx.globalAlpha = 1;
  }, [
    imageLoaded,
    canvasSize,
    imageEffects,
    backgroundData,
    imageLayerVisible,
    backgroundLayerVisible,
    drawBackground,
    drawImage,
  ]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    if (imageRef.current) {
      const img = imageRef.current;
      // Set canvas size based on image dimensions
      const maxWidth = 400;
      const maxHeight = 400;
      const aspectRatio = img.naturalWidth / img.naturalHeight;

      let newWidth, newHeight;
      if (aspectRatio > maxWidth / maxHeight) {
        newWidth = maxWidth;
        newHeight = maxWidth / aspectRatio;
      } else {
        newWidth = maxHeight * aspectRatio;
        newHeight = maxHeight;
      }

      setCanvasSize({ width: newWidth, height: newHeight });
    }
  }, []);

  // useEffect hooks
  useEffect(() => {
    const processedImage = sessionStorage.getItem("processedImage");
    const processedImageName = sessionStorage.getItem("processedImageName");

    if (processedImage) {
      setImageUrl(processedImage);
      setImageName(processedImageName || "image");
      setImageLoaded(true);
    } else {
      // Fallback to original image if no processed image
      const originalImage = sessionStorage.getItem("originalImage");
      if (originalImage) {
        setImageUrl(originalImage);
        setImageName("image");
        setImageLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    if (imageUrl && imageRef.current) {
      const img = imageRef.current;
      img.onload = () => {
        setImageLoaded(true);
        // Set canvas size based on image dimensions
        setCanvasSize({
          width: Math.min(img.naturalWidth, 400),
          height: Math.min(img.naturalHeight, 400),
        });
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [imageLoaded, drawCanvas]);

  // Initialize saved effects when component mounts
  useEffect(() => {
    setSavedImageEffects(imageEffects);
  }, []); // Only run once on mount

  // Check initial scroll position
  useEffect(() => {
    checkScrollPosition();
  }, []);

  // Handle background data changes and redraw canvas
  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [backgroundData, imageLoaded, drawCanvas]);

  // Render tool component based on active tool
  const renderToolComponent = () => {
    switch (activeTool) {
      case "adjust":
        return (
          <AdjustTool
            imageEffects={imageEffects}
            onSliderChange={handleSliderChange}
            onPresetChange={handlePresetChange}
            onSaveChanges={handleSaveChanges}
          />
        );
      case "filter":
        return <FilterTool onPresetChange={handlePresetChange} />;
      case "shadow":
        return (
          <ShadowTool
            imageEffects={imageEffects}
            onShadowChange={handleShadowChange}
            onShadowUpdate={handleShadowUpdate}
          />
        );
      case "outline":
        return (
          <OutlineTool
            imageEffects={imageEffects}
            onOutlineChange={handleOutlineChange}
          />
        );
      case "glow":
        return (
          <GlowTool
            imageEffects={imageEffects}
            onGlowChange={handleGlowChange}
            onGlowUpdate={handleGlowUpdate}
          />
        );
      case "background":
        return (
          <BackgroundTool
            backgroundData={backgroundData}
            onBackgroundChange={handleBackgroundChange}
          />
        );
      case "transform":
        return (
          <TransformTool
            imageEffects={imageEffects}
            onSliderChange={handleSliderChange}
          />
        );
      case "crop":
        return (
          <div className="space-y-6">
            <div className="text-center text-slate-600">
              <Crop className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <p className="text-lg font-medium">Crop & Resize</p>
              <p className="text-sm">
                Use the transform tools to adjust your image size and position
              </p>
                        </div>

            <div className="pt-4 border-t border-slate-200">
              <Button
                onClick={() => router.push("/adjust")}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Go to Adjust Page
                        </Button>
                      </div>
                          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      <Header 
        title="Photo Editor"
        subtitle="Advanced editing tools & effects"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main Canvas Area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-3xl md:p-6 shadow-2xl border border-slate-200/50 relative overflow-hidden">
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <Button
                  onClick={() => setShowTemplateDialog(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                  size="sm"
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
              </div>

              {/* Canvas Container */}
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl md:p-4 min-h-[300px] flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full rounded-xl shadow-2xl border border-slate-200/50"
                  style={{ cursor: "crosshair" }}
                />
              </div>
                        </div>
                      </div>

          {/* Ad Placement Sidebar */}
          <div className="space-y-4 hidden sm:block">
            {/* Ad Space */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 shadow-xl border border-purple-200/50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-white" />
                    </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Premium Features
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Unlock advanced editing tools and AI-powered effects
                </p>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Upgrade Now
                    </Button>
                    </div>
                    </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-200/50 hidden sm:block">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Image Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Size:</span>
                  <span className="font-medium">
                    {canvasSize.width} × {canvasSize.height}
                  </span>
                    </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Format:</span>
                  <span className="font-medium">PNG</span>
                    </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Quality:</span>
                  <span className="font-medium">High</span>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>

      {/* Tool Selection Bar - Horizontal Scrollable with Animation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 md:py-6">
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-200/50 overflow-hidden relative">
          {/* Tool Bar - Slides out when tool is active */}
          <div
            className={`flex justify-center items-center overflow-hidden transition-all duration-500 ease-in-out ${
              activeTool
                ? "transform -translate-x-full opacity-0 absolute"
                : "transform translate-x-0 opacity-100 relative"
            }`}
          >
            {/* Left Arrow - Show on all devices */}
            <button 
              onClick={scrollToolsLeft}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 mr-2 ${
                canScrollLeft 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900' 
                  : 'bg-slate-50 text-slate-300 cursor-not-allowed'
              }`}
              disabled={!canScrollLeft}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Tools Container - Horizontal scrollable */}
            <div 
              className="flex overflow-x-auto scrollbar-hide gap-0 max-w-full" 
              ref={toolsContainerRef}
              onScroll={checkScrollPosition}
            >
              {toolCategories.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => openTool(tool.id)}
                    className={`flex flex-col items-center space-y-1.5 sm:space-y-2 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl transition-all duration-200 min-w-[60px] sm:min-w-[70px] lg:min-w-[80px] border-r border-slate-100 last:border-r-0 flex-shrink-0 ${
                      activeTool === tool.id
                        ? "bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 shadow-lg"
                        : "hover:bg-slate-50 hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${tool.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:w-6 text-white" />
                    </div>
                    <span
                      className={`text-xs font-medium text-center ${
                        activeTool === tool.id
                          ? "text-purple-700"
                          : "text-slate-700"
                      }`}
                    >
                      {tool.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Arrow - Show on all devices */}
            <button 
              onClick={scrollToolsRight}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ml-2 ${
                canScrollRight 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900' 
                  : 'bg-slate-50 text-slate-300 cursor-not-allowed'
              }`}
              disabled={!canScrollRight}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Active Tool Component - Slides in from right and takes up the same space */}
          {activeTool && (
            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTool
                  ? "transform translate-x-0 opacity-100"
                  : "transform translate-x-full opacity-0"
              }`}
            >
              {/* Tool Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 bg-gradient-to-br ${
                        toolCategories.find((t) => t.id === activeTool)?.color
                      } rounded-lg flex items-center justify-center`}
                    >
                      {(() => {
                        const tool = toolCategories.find(
                          (t) => t.id === activeTool
                        );
                        if (tool) {
                          const IconComponent = tool.icon;
                          return (
                            <IconComponent className="w-4 h-4 text-white" />
                          );
                        }
                        return <Sun className="w-4 h-4 text-white" />;
                      })()}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {toolCategories.find((t) => t.id === activeTool)?.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {
                        toolCategories.find((t) => t.id === activeTool)
                          ?.description
                      }
                    </p>
                  </div>
                  <button
                    onClick={closeTool}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Tool Content */}
              <div className="p-2 md:p-2">{renderToolComponent()}</div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Image Elements */}
      <img
        ref={imageRef}
        alt=""
        style={{ display: "none" }}
        onLoad={handleImageLoad}
      />
      <img
        ref={backgroundImageRef}
        alt=""
        style={{ display: "none" }}
        onLoad={handleBackgroundImageLoad}
      />

      {/* Temporary Testing Section - Direct Image Upload */}
      <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl max-w-2xl mx-auto">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Testing: Direct Image Upload</h3>
          <p className="text-sm text-slate-600">Upload a new image to test editing without going through crop/adjust page</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    const imageData = e.target?.result as string
                    // Store in session storage for the edit page
                    sessionStorage.setItem('imageData', imageData)
                    sessionStorage.setItem('imageName', file.name)
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            />
            
            <Button
              onClick={() => {
                const imageData = sessionStorage.getItem('imageData')
                if (imageData) {
                  // Set the new image data
                  setImageUrl(imageData)
                  setImageName(sessionStorage.getItem('imageName') || 'New Image')
                  setImageLoaded(false)
                  // Reset effects to defaults
                  setSavedImageEffects({
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
                    tint: 0,
                    scale: 100,
                    rotation: 0,
                    flipH: false,
                    flipV: false,
                    shadow: {
                      enabled: false,
                      type: "drop",
                      offsetX: 10,
                      offsetY: 10,
                      blur: 10,
                      color: "#000000",
                      opacity: 50,
                      spread: 0,
                    },
                    outline: {
                      enabled: false,
                      type: "solid",
                      width: 2,
                      color: "#000000",
                      opacity: 100,
                      style: "outside",
                    },
                    glow: {
                      enabled: false,
                      type: "solid",
                      blur: 10,
                      color: "#ffffff",
                      opacity: 50,
                      intensity: 50,
                    },
                  })
                  
                  // Reset background to default
                  setBackgroundData({
                    type: "color",
                    color: "#ffffff",
                  })
                  // Clear session storage
                  sessionStorage.removeItem('imageData')
                  sessionStorage.removeItem('imageName')
                }
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg px-6 py-2"
            >
              Load New Image
            </Button>
          </div>
          
          <p className="text-xs text-slate-500 italic">
            This is a temporary testing feature. The image will be loaded directly into the editor.
          </p>
        </div>
      </div>

      {/* Template Save Dialog */}
      {showTemplateDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Save Template</h3>
              <button
                onClick={() => setShowTemplateDialog(false)}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="templateName" className="text-sm font-medium text-slate-700">
                  Template Name *
                </Label>
                <Input
                  id="templateName"
                  value={templateName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="templateDescription" className="text-sm font-medium text-slate-700">
                  Description
                </Label>
                <Input
                  id="templateDescription"
                  value={templateDescription}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemplateDescription(e.target.value)}
                  placeholder="Enter template description (optional)"
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setShowTemplateDialog(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveTemplate}
                  disabled={isSavingTemplate || !templateName.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  {isSavingTemplate ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save Template
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Smooth scrolling for mobile */
        @media (max-width: 1024px) {
          .scrollbar-hide {
            scroll-behavior: smooth;
          }
        }
      `}</style>
    </div>
  );
}
