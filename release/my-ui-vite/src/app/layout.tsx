import type React from "react"

// Layout component for React Router (not Next.js)
// Fonts are loaded via Google Fonts in index.html
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-black text-white antialiased font-mono">
      {children}
    </div>
  )
}
