import './globals.css'

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {/* This container covers the entire viewport with no extra padding */}
        <div
          id="draggable-screen-bounds"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            overflow: "hidden", // no scroll
          }}
        >
          {children}
        </div>
      </body>
    </html>
  )
} 

