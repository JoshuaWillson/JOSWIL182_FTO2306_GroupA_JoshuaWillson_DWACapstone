import {useEffect, useState} from 'react'
import Header from "./components/Header"
import Preview from "./components/Preview"
import AudioPlayer from './components/AudioPlayer'
import Favourites from "./components/Favourites"

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
  const [favourites, setFavourites] = useState({
    displayFavourites: false,
    episodes: []
  })

  useEffect(() => {
    setFilteredPodcastsPlayed(Object.values(podcastsPlayed.reduce((acc, item) => {
      acc[item.title] = item
      return acc
    }, {})))
  }, [podcastsPlayed])

  return (
    <>
      <div>
        <Header setFavourites={setFavourites} />
        {favourites.displayFavourites 
        ? <Favourites favourites={favourites} 
                      setFavourites={setFavourites} 
                      playingPodcast={playingPodcast} 
                      setPlayingPodcast={setPlayingPodcast} 
                      setPodcastsPlayed={setPodcastsPlayed} 
          /> 
        : <Preview setPlayingPodcast={setPlayingPodcast} 
                   playingPodcast={playingPodcast} 
                   setPodcastsPlayed={setPodcastsPlayed} 
                   setFavourites={setFavourites} 
                   favourites={favourites} />
        }
        {playingPodcast.isDisplaying && <AudioPlayer playingPodcast={playingPodcast} setPlayingPodcast={setPlayingPodcast} setPodcastsPlayed={setPodcastsPlayed} />}
      </div>
    </>
  )
}
