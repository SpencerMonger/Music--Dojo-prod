import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  const progress = (currentTime / duration) * 100 || 0

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const STEP = 5 // 5 seconds step
    switch (e.key) {
      case 'ArrowRight':
        onSeek(Math.min(currentTime + STEP, duration))
        break
      case 'ArrowLeft':
        onSeek(Math.max(currentTime - STEP, 0))
        break
    }
  }

  return (
    <div className="space-y-2">
      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center"
        value={[progress]}
        max={100}
        step={0.1}
        aria-label="Playback Progress"
        onValueChange={(value) => {
          onSeek((value[0] / 100) * duration)
        }}
        onKeyDown={handleKeyDown}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
          <SliderPrimitive.Range className="absolute h-full bg-blue-500" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="block h-4 w-4 rounded-full border border-blue-500 bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-50"
        />
      </SliderPrimitive.Root>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}