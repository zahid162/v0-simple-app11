import { MongoClient } from "mongodb"

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/photo-editor"
const DB_NAME = process.env.MONGODB_DB || "photo-editor"
const COLLECTION_NAME = process.env.MONGODB_COLLECTION || "templates_versions"

// Initial templates data
const initialTemplates = [
  {
    name: "Vintage Portrait",
    description: "Classic vintage effect for portraits with warm tones",
    status: "active",
    imageEffects: {
      brightness: 110,
      contrast: 120,
      saturation: 90,
      blur: 0,
      hue: 0,
      sepia: 20,
      grayscale: 0,
      invert: 0,
      vibrance: 80,
      exposure: -5,
      highlights: 70,
      shadows: 10,
      temperature: 15,
      tint: 0,
      scale: 100,
      rotation: 0,
      flipH: false,
      flipV: false,
      shadow: {
        enabled: true,
        type: "drop",
        offsetX: 15,
        offsetY: 15,
        blur: 20,
        color: "#8B4513",
        opacity: 60,
        spread: 5,
      },
      outline: {
        enabled: true,
        type: "solid",
        width: 3,
        color: "#8B4513",
        opacity: 80,
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
    },
    backgroundData: {
      type: "gradient",
      color: "#f5f5dc",
      color2: "#deb887",
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    name: "Modern Clean",
    description: "Clean, modern look for professional photos",
    status: "active",
    imageEffects: {
      brightness: 100,
      contrast: 110,
      saturation: 95,
      blur: 0,
      hue: 0,
      sepia: 0,
      grayscale: 0,
      invert: 0,
      vibrance: 60,
      exposure: 0,
      highlights: 50,
      shadows: 0,
      temperature: 0,
      tint: 0,
      scale: 100,
      rotation: 0,
      flipH: false,
      flipV: false,
      shadow: {
        enabled: true,
        type: "drop",
        offsetX: 10,
        offsetY: 10,
        blur: 15,
        color: "#000000",
        opacity: 30,
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
    },
    backgroundData: {
      type: "color",
      color: "#ffffff",
    },
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    name: "Dramatic Black & White",
    description: "High contrast black and white dramatic effect",
    status: "active",
    imageEffects: {
      brightness: 90,
      contrast: 150,
      saturation: 0,
      blur: 0,
      hue: 0,
      sepia: 0,
      grayscale: 100,
      invert: 0,
      vibrance: 0,
      exposure: -10,
      highlights: 90,
      shadows: -30,
      temperature: 0,
      tint: 0,
      scale: 100,
      rotation: 0,
      flipH: false,
      flipV: false,
      shadow: {
        enabled: true,
        type: "drop",
        offsetX: 20,
        offsetY: 20,
        blur: 25,
        color: "#000000",
        opacity: 80,
        spread: 10,
      },
      outline: {
        enabled: true,
        type: "solid",
        width: 4,
        color: "#ffffff",
        opacity: 90,
        style: "outside",
      },
      glow: {
        enabled: true,
        type: "neon",
        blur: 15,
        color: "#ffffff",
        opacity: 70,
        intensity: 1.5,
        spread: 5,
        style: "outside",
        animation: false,
      },
    },
    backgroundData: {
      type: "gradient",
      color: "#000000",
      color2: "#333333",
    },
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
  {
    name: "Sunset Glow",
    description: "Warm sunset lighting with golden glow effects",
    status: "active",
    imageEffects: {
      brightness: 105,
      contrast: 115,
      saturation: 110,
      blur: 0,
      hue: 0,
      sepia: 0,
      grayscale: 0,
      invert: 0,
      vibrance: 90,
      exposure: -3,
      highlights: 80,
      shadows: 15,
      temperature: 25,
      tint: 10,
      scale: 100,
      rotation: 0,
      flipH: false,
      flipV: false,
      shadow: {
        enabled: true,
        type: "drop",
        offsetX: 12,
        offsetY: 12,
        blur: 18,
        color: "#FF8C00",
        opacity: 50,
        spread: 3,
      },
      outline: {
        enabled: true,
        type: "gradient",
        width: 3,
        color: "#FFD700",
        color2: "#FF8C00",
        opacity: 85,
        style: "outside",
      },
      glow: {
        enabled: true,
        type: "soft",
        blur: 20,
        color: "#FFD700",
        opacity: 60,
        intensity: 1.2,
        spread: 8,
        style: "both",
        animation: false,
      },
    },
    backgroundData: {
      type: "gradient",
      color: "#FFE4B5",
      color2: "#FFB6C1",
    },
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-04"),
  },
  {
    name: "Cyberpunk Neon",
    description: "Futuristic cyberpunk style with neon accents",
    status: "active",
    imageEffects: {
      brightness: 95,
      contrast: 130,
      saturation: 120,
      blur: 0,
      hue: 0,
      sepia: 0,
      grayscale: 0,
      invert: 0,
      vibrance: 100,
      exposure: -5,
      highlights: 70,
      shadows: -20,
      temperature: -10,
      tint: 15,
      scale: 100,
      rotation: 0,
      flipH: false,
      flipV: false,
      shadow: {
        enabled: true,
        type: "drop",
        offsetX: 18,
        offsetY: 18,
        blur: 22,
        color: "#00FFFF",
        opacity: 70,
        spread: 8,
      },
      outline: {
        enabled: true,
        type: "neon-glow",
        width: 4,
        color: "#FF00FF",
        opacity: 90,
        style: "outside",
        glowIntensity: 1.5,
      },
      glow: {
        enabled: true,
        type: "colorful",
        blur: 25,
        color: "#00FFFF",
        color2: "#FF00FF",
        color3: "#00FF00",
        opacity: 80,
        intensity: 1.8,
        spread: 12,
        style: "both",
        animation: false,
      },
    },
    backgroundData: {
      type: "gradient",
      color: "#1a1a2e",
      color2: "#16213e",
    },
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
]

async function seedDatabase() {
  let client

  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is required")
    }

    console.log("Connecting to MongoDB...")
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(DB_NAME)
    const collection = db.collection(COLLECTION_NAME)

    // Clear existing templates
    await collection.deleteMany({})
    console.log("Cleared existing templates")

    // Insert new templates
    const result = await collection.insertMany(initialTemplates)
    console.log(`Inserted ${result.insertedCount} templates`)

    // Display inserted templates
    const templates = await collection.find({}).toArray()
    console.log("\nInserted templates:")
    templates.forEach((template) => {
      console.log(`- ${template.name} (${template.status})`)
    })

    console.log("\nDatabase seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error.message)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log("Database connection closed")
    }
  }
}

// Run the seed function
seedDatabase()
