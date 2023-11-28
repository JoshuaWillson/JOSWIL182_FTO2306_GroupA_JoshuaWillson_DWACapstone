import {useEffect, useState} from 'react'
import Header from "./components/Header"
import Preview from "./components/Preview"
import AudioPlayer from './components/AudioPlayer'

export default function App() {
  const [playingPodcast, setPlayingPodcast] = useState({
    isPlaying: false,
    isDisplaying: false,
    file: "",
    image: "",
    title: "",
    audio: undefined,
    duration: 0,
    timePlayed: 0
  })

  const [podcastsPlayed, setPodcastsPlayed] = useState([])
  const [filteredPodcastsPlayed, setFilteredPodcastsPlayed] = useState([])

  useEffect(() => {
    setFilteredPodcastsPlayed(Object.values(podcastsPlayed.reduce((acc, item) => {
      acc[item.title] = item
      return acc
    }, {})))
  }, [podcastsPlayed])

  return (
    <>
      <div>
        <Header />
        <Preview setPlayingPodcast={setPlayingPodcast} playingPodcast={playingPodcast} setPodcastsPlayed={setPodcastsPlayed} />
        {playingPodcast.isDisplaying && <AudioPlayer playingPodcast={playingPodcast} setPlayingPodcast={setPlayingPodcast} setPodcastsPlayed={setPodcastsPlayed} />}
      </div>
    </>
  )
}
