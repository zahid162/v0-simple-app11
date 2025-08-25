import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '../../../lib/mongodb'

// Database and collection names
const DB_NAME = process.env.MONGODB_DB || 'photo-editor'
const COLLECTION_NAME = process.env.MONGODB_COLLECTION || 'templates_versions'

// GET /api/templates - Get all templates
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const collection = db.collection(COLLECTION_NAME)
    
    const templates = await collection.find({}).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json({ 
      success: true, 
      templates: templates,
      count: templates.length 
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST /api/templates - Create a new template
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const collection = db.collection(COLLECTION_NAME)
    
    const templateData = await request.json()
    
    // Validate required fields
    if (!templateData.name || !templateData.imageEffects || !templateData.backgroundData) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, imageEffects, backgroundData' },
        { status: 400 }
      )
    }
    
    // Remove previewImage if it exists (templates should not store images)
    if (templateData.previewImage) {
      delete templateData.previewImage
    }
    
    // Add timestamps
    const now = new Date()
    const newTemplate = {
      ...templateData,
      status: templateData.status || 'inactive',
      createdAt: now,
      updatedAt: now
    }
    
    const result = await collection.insertOne(newTemplate)
    
    return NextResponse.json({ 
      success: true, 
      template: { ...newTemplate, _id: result.insertedId },
      message: 'Template created successfully' 
    })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create template' },
      { status: 500 }
    )
  }
}

// PUT /api/templates - Update template status or preview
export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const collection = db.collection(COLLECTION_NAME)
    
    const { id, status, previewImage } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Template ID is required' },
        { status: 400 }
      )
    }
    
    const updateData: any = { updatedAt: new Date() }
    
    if (status !== undefined) {
      updateData.status = status
    }
    
    if (previewImage !== undefined) {
      updateData.previewImage = previewImage
    }
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Template updated successfully',
      modifiedCount: result.modifiedCount 
    })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

// DELETE /api/templates - Delete a template
export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const collection = db.collection(COLLECTION_NAME)
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Template ID is required' },
        { status: 400 }
      )
    }
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Template deleted successfully',
      deletedCount: result.deletedCount 
    })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
