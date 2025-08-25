export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6">Simple App</h1>
          <p className="text-lg text-muted-foreground mb-8">Your clean, minimal application is ready to build upon.</p>
          <div className="bg-card border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="text-muted-foreground">This is your simple, empty app foundation. Add your features here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
