export interface Song {
    id: string
    title: string
    artist: string
    album: string
    cover: string
    audio: string
    background: string
  }
  
  export interface PlaylistItem {
    song: Song
    isPlaying: boolean
    onPlay: () => void
  }
  