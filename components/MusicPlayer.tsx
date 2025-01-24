"use client"

import React, { useState, useRef, useEffect } from "react"
import type { Song } from "../types/music"
import { ProgressBar } from "./ProgressBar"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import Draggable from "react-draggable"

interface MusicPlayerProps {
  playlist: Song[]
  onSongChange: (song: Song) => void
}

export function MusicPlayer({ playlist, onSongChange }: MusicPlayerProps) {
  console.log("MusicPlayer received playlist:", playlist)

  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isMini, setIsMini] = useState(false)

  const playerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Calculate initial position based on the "draggable-screen-bounds" dimensions
  const calculateInitialPosition = () => {
    // Set a small margin from the edges
    const margin = 16
    return { x: margin, y: margin }
  }

  const [position, setPosition] = useState(calculateInitialPosition)

  // Make sure we have a valid currentSongIndex
  useEffect(() => {
    if (currentSongIndex >= playlist.length) {
      setCurrentSongIndex(0)
    }
  }, [playlist.length, currentSongIndex])

  const currentSong = playlist[currentSongIndex]
  console.log("Current song:", currentSong)

  // Reset audio state when song changes and autoplay
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
      audioRef.current.play().catch((err) => console.log("Autoplay failed:", err))
    }
  }, [currentSongIndex])

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current
      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("ended", handleSongEnd)

      // Auto-play when song changes
      if (isPlaying) {
        audio.play().catch((err) => console.log("Playback failed:", err))
      }
    }
    return () => {
      if (audioRef.current) {
        const audio = audioRef.current
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("ended", handleSongEnd)
      }
    }
  }, [currentSongIndex, isPlaying])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSongEnd = () => {
    console.log("Song ended, playing next")
    handleNext()
    setIsPlaying(true)
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleNext = () => {
    console.log("Next song clicked. Current index:", currentSongIndex, "Playlist length:", playlist.length)
    setCurrentSongIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      return nextIndex >= playlist.length ? 0 : nextIndex
    })
  }

  const handlePrevious = () => {
    console.log("Previous song clicked. Current index:", currentSongIndex)
    setCurrentSongIndex((prevIndex) => {
      const prev = prevIndex - 1
      return prev < 0 ? playlist.length - 1 : prev
    })
  }

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  // Add keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement) return

      switch (e.code) {
        case "Space":
          e.preventDefault()
          togglePlay()
          break
        case "ArrowLeft":
          if (e.ctrlKey || e.metaKey) handlePrevious()
          break
        case "ArrowRight":
          if (e.ctrlKey || e.metaKey) handleNext()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  // Add volume control
  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      setVolume(newVolume)
    }
  }

  // Call onSongChange when currentSongIndex changes
  useEffect(() => {
    onSongChange(playlist[currentSongIndex])
  }, [currentSongIndex, onSongChange, playlist])

  // Add double click handler for mini mode
  const handleDoubleClick = () => {
    if (!isDragging) {
      setIsMini(!isMini)
      setPosition(calculateInitialPosition()) // Reset position when toggling mini mode
    }
  }

  // Draggable event handlers
  const handleDragStart = () => {
    setIsDragging(true)
  }
  const handleDragStop = () => {
    // small delay to prevent double click trigger right after dragging
    setTimeout(() => setIsDragging(false), 100)
  }

  // Render the player layout
  const playerContent = (
    <div
      ref={playerRef}
      className={`w-full max-w-lg mx-auto bg-white p-4 sm:p-6 music-player-transition ${
        isMini ? "music-player-mini" : ""
      }`}
      onDoubleClick={handleDoubleClick}
    >
      <div className={`flex ${isMini ? "flex-col items-center" : "flex-col sm:flex-row sm:items-center sm:space-x-4"}`}>
        <img
          src={currentSong?.cover || "/placeholder.svg"}
          alt={`${currentSong?.album || "Album"} cover`}
          className="w-full sm:w-24 h-24 rounded-lg object-cover mb-4 sm:mb-0"
        />
        <div className={`flex-grow text-center ${isMini ? "title-container" : "sm:text-left"}`}>
          <h2 className={`font-bold truncate ${isMini ? "title-text" : "text-xl"}`}>{currentSong?.title}</h2>
          <p className={`text-gray-600 truncate ${isMini ? "hidden" : ""}`}>{currentSong?.artist}</p>
          <p className={`text-gray-500 truncate ${isMini ? "hidden" : ""}`}>{currentSong?.album}</p>
        </div>
      </div>

      {/* Collapsible content */}
      <div className={`collapsible-content ${isMini ? "collapsed" : ""}`}>
        <audio
          ref={audioRef}
          src={currentSong?.audio}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleSongEnd}
        />

        <div className="mt-6 space-y-4">
          <ProgressBar currentTime={currentTime} duration={duration} onSeek={handleSeek} />

          {/* Centered controls container */}
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-2">
              {/* Play controls group */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handlePrevious} title="Previous (Ctrl + ←)">
                  <SkipBack className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                <Button onClick={togglePlay} size="icon" title="Play/Pause (Space)">
                  {isPlaying ? (
                    <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNext} title="Next (Ctrl + →)">
                  <SkipForward className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </div>

              {/* Small gap between controls and volume */}
              <div className="w-4" />

              {/* Volume control */}
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => setShowVolumeControl(!showVolumeControl)}>
                  {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>

                {showVolumeControl && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white p-2 rounded-lg shadow-lg flex items-center space-x-2 z-10">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-24"
                    />
                    <Button variant="ghost" size="sm" onClick={() => handleVolumeChange(volume === 0 ? 1 : 0)}>
                      {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Playlist section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Playlist</h3>
            <div className="space-y-2">
              {playlist.map((song, index) => (
                <div
                  key={song.id}
                  className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                    index === currentSongIndex ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setCurrentSongIndex(index)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={song.cover || "/placeholder.svg"}
                      alt={`${song.album || "Album"} cover`}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{song.title}</p>
                      <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Draggable
        bounds="#draggable-screen-bounds"
        handle=".music-player-drag-handle"
        position={position}
        onStart={handleDragStart}
        onStop={handleDragStop}
        onDrag={(_e, data) => setPosition({ x: data.x, y: data.y })}
      >
        <div
          className="music-player-drag-handle"
          style={{
            position: "absolute",
          }}
        >
          {playerContent}
        </div>
      </Draggable>
    </div>
  )
}


