# PhotoEdit Pro - MongoDB Setup Guide

## Prerequisites
- Node.js and npm installed
- **MongoDB 6.0+ (required for template storage)**

## Installation Steps

### 1. Current Status: Real MongoDB Integration
The system now uses **real MongoDB** instead of mock API. Templates are stored persistently in the database with full CRUD operations.

**New Feature**: Templates now display with actual canvas rendering using the same logic as the edit page, showing exactly how effects will look when applied.

### 2. Install MongoDB Dependencies
```bash
npm install mongodb
```

### 3. Environment Configuration
Create a `.env.local` file in your project root with the following content:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/photo-editor
MONGODB_DB=photo-editor
MONGODB_COLLECTION=templates_versions
```

### 4. MongoDB Setup Options

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mongodb
   
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. Start MongoDB service
   ```bash
   # Ubuntu/Debian
   sudo systemctl start mongod
   sudo systemctl enable mongod
   
   # macOS
   brew services start mongodb-community
   ```

3. Verify MongoDB is running
   ```bash
   sudo systemctl status mongod
   # or
   mongosh --eval "db.runCommand('ping')"
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env.local`

### 5. Seed the Database with Initial Templates
```bash
npm run seed
```
This will create 5 professional templates in your MongoDB database.

### 6. Start Development Server
```bash
npm run dev
```

## Features Implemented

### 1. Template Save Button (Edit Page)
- Blue "Save Template" button above the canvas
- Click to open template save dialog
- Enter template name and description
- Automatically captures current image effects and background settings
- Generates preview image from canvas
- **Saves directly to MongoDB**

### 2. MongoDB API Endpoints
- `POST /api/templates` - Create new template in MongoDB
- `GET /api/templates` - Fetch all templates from MongoDB
- `PUT /api/templates` - Update template status/preview in MongoDB
- `DELETE /api/templates` - Delete template from MongoDB

### 3. Admin Template Management
- New "Templates" tab in admin dashboard
- **Global Image Upload**: Single PNG image upload that applies to ALL templates
- **Live Canvas Rendering**: Templates display with actual effects applied (same as edit page)
- **5 Professional Templates**: Pre-designed templates loaded from MongoDB
- Toggle template status (Active/Inactive)
- Delete templates
- Search functionality
- **Real-time Preview**: See exactly how effects, shadows, outlines, and backgrounds will appear
- **Template Gallery**: Beautiful grid layout showing all available templates

### 4. Template Data Structure (MongoDB)
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  imageEffects: ImageEffects,
  backgroundData: BackgroundData,
  previewImage: string (base64),
  status: 'active' | 'inactive',
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Professional Templates Included
The system comes with 5 pre-designed professional templates loaded from MongoDB:

- **Vintage Portrait**: Warm vintage tones with sepia and brown accents
- **Modern Clean**: Professional clean look with subtle shadows
- **Dramatic Black & White**: High contrast B&W with white outline and glow
- **Sunset Glow**: Warm sunset lighting with golden glow effects
- **Cyberpunk Neon**: Futuristic style with neon cyan/magenta accents

## Database Operations

### Creating Templates
1. Go to `/edit` page
2. Apply desired effects to your image
3. Click "Save Template" button
4. Enter template name and description
5. **Template is automatically saved to MongoDB**

### Managing Templates
- View all templates in the admin dashboard (loaded from MongoDB)
- Toggle status between active/inactive
- Delete templates as needed
- Preview templates with uploaded test images

## Technical Details

### MongoDB Connection
- Uses `lib/mongodb.ts` for connection management
- Supports both development and production environments
- Handles connection pooling and error handling

### API Implementation
- **Real MongoDB operations** instead of mock data
- Proper error handling and validation
- ObjectId handling for MongoDB documents
- Timestamp management (createdAt, updatedAt)

### File Structure
```
app/
├── api/templates/route.ts    # Template API endpoints (MongoDB)
├── components/
│   ├── TemplateCanvas.tsx    # Template preview component
│   ├── tools/                # Image editing tools
│   └── layout/               # Layout components
├── edit/page.tsx             # Main editor page
├── admin/page.tsx            # Admin dashboard
└── layout.tsx                # Root layout
lib/
└── mongodb.ts                # MongoDB connection utility
scripts/
└── seed-database.js          # Database seeding script
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `sudo systemctl status mongod`
   - Check connection string in `.env.local`
   - Verify MongoDB is accessible on port 27017
   - Check MongoDB logs: `sudo journalctl -u mongod`

2. **Template Not Saving**
   - Check browser console for errors
   - Verify MongoDB connection
   - Ensure all required fields are filled
   - Check MongoDB logs for errors

3. **Database Not Found**
   - Run the seed script: `npm run seed`
   - Check if the database and collection exist
   - Verify MongoDB user permissions

### Performance Tips
- Use appropriate image sizes for templates
- Optimize PNG images before upload
- Monitor MongoDB performance for large template collections
- Use MongoDB indexes for better query performance

## Development

### Adding New Effects
1. Extend the `ImageEffects` interface in `types/image.ts`
2. Implement the effect logic in the appropriate tool component
3. Update the canvas drawing functions
4. Add UI controls in the editor sidebar

### Database Operations
- **Real MongoDB operations** instead of mock data
- Use MongoDB Compass for database visualization
- Implement proper error handling for database operations
- Add database indexes for performance optimization

### Database Migrations
- Use the seed script to update template structures
- Modify the MongoDB schema as needed
- Update API endpoints for new fields
- Use MongoDB aggregation for complex queries
