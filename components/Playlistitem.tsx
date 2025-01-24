import React from "react"
import type { Song } from "../types/music"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"

interface PlaylistItemProps {
  song: Song
  isPlaying: boolean
  onPlay: () => void
}

export function PlaylistItem({ song, isPlaying, onPlay }: PlaylistItemProps) {
  return (
    <div className="flex items-center space-x-2 sm:space-x-4 p-2 hover:bg-gray-100 rounded-md">
      <img 
        src={song.cover || "/placeholder.svg"} 
        alt={`${song.album} cover`} 
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover"
      />
      <div className="flex-grow min-w-0">
        <p className="font-semibold truncate">{song.title}</p>
        <p className="text-sm text-gray-500 truncate">{song.artist}</p>
      </div>
      <Button size="icon" variant="ghost" onClick={onPlay} className="flex-shrink-0">
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
    </div>
  )
}