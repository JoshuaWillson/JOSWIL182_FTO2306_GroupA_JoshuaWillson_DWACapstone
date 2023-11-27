import {useState} from 'react'
import Header from "./components/Header"
import Preview from "./components/Preview"
import AudioPlayer from './components/AudioPlayer'

export default function App() {
  const [playingPodcast, setPlayingPodcast] = useState({isPlaying: false})

  return (
    <>
      <div>
        <Header />
        <Preview setPlayingPodcast={setPlayingPodcast} />
        {playingPodcast.isPlaying && <AudioPlayer playingPodcast={playingPodcast} setPlayingPodcast={setPlayingPodcast} />}
      </div>
    </>
  )
}
