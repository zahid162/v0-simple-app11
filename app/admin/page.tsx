"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import TemplateCanvas from "../components/TemplateCanvas"
import HydrationErrorBoundary from "../components/HydrationErrorBoundary"
import {
  Settings,
  Users,
  ImageIcon,
  BarChart3,
  Palette,
  Download,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  Upload,
  Bookmark,
  X,
} from "lucide-react"

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  // Mock data for demonstration
  const stats = {
    totalUsers: 1247,
    imagesProcessed: 8934,
    activeEditors: 156,
    storageUsed: "2.4 GB",
  }

  const recentUploads = [
    { id: 1, name: "portrait.png", user: "john@example.com", size: "2.1 MB", date: "2 hours ago" },
    { id: 2, name: "logo.jpg", user: "sarah@example.com", size: "856 KB", date: "4 hours ago" },
    { id: 3, name: "product.png", user: "mike@example.com", size: "1.3 MB", date: "6 hours ago" },
  ]

  const filterPresets = [
    { id: 1, name: "Vintage", usage: 234, active: true },
    { id: 2, name: "Modern", usage: 189, active: true },
    { id: 3, name: "Dramatic", usage: 156, active: false },
    { id: 4, name: "Soft", usage: 98, active: true },
  ]

  // Suppress hydration warnings in console
  useEffect(() => {
    const originalError = console.error
    console.error = (...args) => {
      if (args[0]?.includes?.('hydration') || args[0]?.includes?.('Hydration')) {
        return // Suppress hydration errors
      }
      originalError.apply(console, args)
    }
    
    return () => {
      console.error = originalError
    }
  }, [])

  // Fetch templates from API
  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTemplateStatus = async (templateId: string, status: string) => {
    try {
      const response = await fetch('/api/templates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: templateId, status }),
      })
      
      if (response.ok) {
        fetchTemplates() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating template status:', error)
    }
  }

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    
    try {
      const response = await fetch(`/api/templates?id=${templateId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchTemplates() // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const updateTemplatePreview = async (templateId: string) => {
    if (!uploadedImage) return
    
    try {
      const response = await fetch('/api/templates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: templateId, 
          previewImage: uploadedImage 
        }),
      })
      
      if (response.ok) {
        fetchTemplates() // Refresh the list
        setShowUploadDialog(false)
        setUploadedImage(null)
        setSelectedTemplate(null)
      }
    } catch (error) {
      console.error('Error updating template preview:', error)
    }
  }
console.log(templates)
  return (
    <HydrationErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header 
          title="PhotoEdit Pro"
          subtitle="Admin Dashboard"
        />

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Images Processed</p>
                  <p className="text-2xl font-bold text-foreground">{stats.imagesProcessed.toLocaleString()}</p>
                </div>
                <ImageIcon className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Editors</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeEditors}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                  <p className="text-2xl font-bold text-foreground">{stats.storageUsed}</p>
                </div>
                <Download className="w-8 h-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="uploads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="uploads" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Recent Uploads
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Filter Presets
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              System Settings
            </TabsTrigger>
          </TabsList>

          {/* Recent Uploads Tab */}
          <TabsContent value="uploads" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Image Uploads</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search uploads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUploads.map((upload) => (
                    <div
                      key={upload.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{upload.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {upload.user} • {upload.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{upload.date}</Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            {/* Global Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Test Image</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload a PNG image to see how all templates look with the same image
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="globalImageUpload" className="text-sm font-medium text-slate-700">
                      Upload PNG Image for All Templates
                    </Label>
                    <Input
                      id="globalImageUpload"
                      type="file"
                      accept="image/png"
                      onChange={handleImageUpload}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This image will be applied to all templates below
                    </p>
                  </div>
                  {uploadedImage && (
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                      <img
                        src={uploadedImage}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Templates Grid */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Template Gallery</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p>No templates found</p>
                    <p className="text-sm">Templates will appear here once they are saved from the editor</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template: any) => (
                      <Card key={template._id} className="overflow-hidden">
                        <div className="aspect-square bg-muted relative">
                          {/* Template Canvas Preview */}
                          <div className="w-full h-full flex items-center justify-center">
                            <TemplateCanvas 
                              template={template}
                              width={400}
                              height={400}
                              testImage={uploadedImage}
                            />
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge 
                              variant={template.status === 'active' ? 'default' : 'secondary'}
                              className="cursor-pointer"
                              onClick={() => updateTemplateStatus(template._id, template.status === 'active' ? 'inactive' : 'active')}
                            >
                              {template.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-foreground">{template.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {template.description || 'No description'}
                              </p>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
                              <span>Updated: {new Date(template.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedTemplate(template)
                                  setShowUploadDialog(true)
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Template
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteTemplate(template._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Filter Presets Tab */}
          <TabsContent value="presets" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Filter Presets Management</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Preset
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg"></div>
                        <div>
                          <p className="font-medium text-foreground">{preset.name}</p>
                          <p className="text-sm text-muted-foreground">Used {preset.usage} times</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`preset-${preset.id}`} className="text-sm">
                            Active
                          </Label>
                          <Switch id={`preset-${preset.id}`} checked={preset.active} />
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">User Management</h3>
                  <p className="text-muted-foreground mb-4">Manage user accounts, permissions, and activity.</p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                    <Input id="max-file-size" type="number" defaultValue="10" className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowed-formats">Allow PNG uploads</Label>
                    <Switch id="allowed-formats" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-optimize">Auto-optimize images</Label>
                    <Switch id="auto-optimize" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Editor Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="canvas-quality">Canvas Quality</Label>
                    <Input id="canvas-quality" type="number" defaultValue="100" className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-filters">Enable Advanced Filters</Label>
                    <Switch id="enable-filters" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-backgrounds">Enable Background Images</Label>
                    <Switch id="enable-backgrounds" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </main>

        <Footer />
      </div>
    </HydrationErrorBoundary>
  )
}
