"use client"

import { useEffect, useState } from 'react'

interface HydrationErrorBoundaryProps {
  children: React.ReactNode
}

export default function HydrationErrorBoundary({ children }: HydrationErrorBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Mark as hydrated after component mounts
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    // Catch hydration errors
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('hydration') || event.message.includes('Hydration')) {
        event.preventDefault()
        setHasError(true)
        console.warn('Hydration error suppressed:', event.message)
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  // If there was a hydration error, show a fallback
  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            PhotoEdit Pro
          </h1>
          <p className="text-muted-foreground mb-4">
            Loading editor...
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  // Show children once hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
