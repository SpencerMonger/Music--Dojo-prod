import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const playlist = [
    {
      id: "1",
      title: "Drama",
      artist: "My Guy",
      album: "Night Creatures",
      cover: "/images/SD_cover1.png",  // Note the path starts from public
      audio: "/audio/Drama.mp3",
      background: "/backgrounds/dramabg1.gif" 
    },
    {
      id: "2",
      title: "Placidusax",
      artist: "My Guy",
      album: "Night Creatures",
      cover: "/images/placidusaxcover.png",
      audio: "/audio/Placidusax.mp3",
      background: "/backgrounds/placidusaxbg.gif"
    },
    {
      id: "3",
      title: "How Could You",
      artist: "My Guy",
      album: "Night Creatures",
      cover: "/images/onecover.png",
      audio: "/audio/howcouldyou.mp3",
      background: "/backgrounds/codered.gif"
    },
    {
        id: "4",
        title: "The Dream",
        artist: "My Guy",
        album: "Night Creatures",
        cover: "/images/dreamcover.png",
        audio: "/audio/thedream.mp3",
        background: "/backgrounds/dreambg.gif"
      },
      {
        id: "5",
        title: "Pianos",
        artist: "My Guy",
        album: "Night Creatures",
        cover: "/images/pianoscover.png",
        audio: "/audio/Pianos.mp3",
        background: "/backgrounds/pianosbg.gif"
      }
    // Add more songs following the same structure
  ]

  console.log('API Route - Sending playlist:', playlist) // Debug log
  
  return NextResponse.json(playlist, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
} 