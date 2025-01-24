"use client"

import { useEffect, useState } from "react"
import { MusicPlayer } from "../components/MusicPlayer"
import type { Song } from "../types/music"

export default function Home() {
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/playlist')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setPlaylist(data)
        setCurrentSong(data[0]) // Set initial song
      } catch (error) {
        console.error('Error fetching playlist:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch playlist')
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylist()
  }, [])

  const handleSongChange = (song: Song) => {
    setCurrentSong(song)
  }

  if (loading) {
    return <div style={{ position: "relative", width: "100%", height: "100%" }}>
      Loading playlist...
    </div>
  }

  if (error) {
    return <div style={{ position: "relative", width: "100%", height: "100%" }} className="text-red-500">
      Error: {error}
    </div>
  }

  if (!playlist.length) {
    return <div style={{ position: "relative", width: "100%", height: "100%" }}>
      No songs in playlist
    </div>
  }

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Background (optional) */}
      {currentSong && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1,
            }}
          />
          <div
            className="background-gif background-transition"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${currentSong.background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
        </>
      )}

      {/* Make this div the draggable bounds */}
      <div 
        id="draggable-screen-bounds"
        style={{ 
          position: "relative",
          zIndex: 2, 
          width: "100%", 
          height: "100%",
          overflow: "hidden"
        }}
      >
        <MusicPlayer playlist={playlist} onSongChange={handleSongChange} />
      </div>
    </div>
  )
}
