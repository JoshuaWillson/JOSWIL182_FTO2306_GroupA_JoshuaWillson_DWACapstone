import {useEffect, useState} from 'react'
import Header from "./components/Header"
import Preview from "./components/Preview"
import AudioPlayer from './components/AudioPlayer'
import Favourites from "./components/Favourites"
import LogIn from "./components/LogIn"
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
const { data } = await supabase.auth.getSession()
const { data: favouritesDB } = await supabase
  .from('favourites')
  .select()

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
    isDisplaying: false,
    episodes: []
  })
  const [user, setUser] = useState(null)

  // console.log(data.session.user.id)
  // console.log(favouritesDB)

  useEffect(() => {
    setFilteredPodcastsPlayed(Object.values(podcastsPlayed.reduce((acc, item) => {
      acc[item.title] = item
      return acc
    }, {})))
  }, [podcastsPlayed])

  useEffect(() => {
    const {session} = data
    setUser(session?.user.email)

    const { subscription } = supabase.auth.onAuthStateChange( async (event, session) => {
      if(event === "SIGNED_IN") {
        setUser(session?.user.email)
        await supabase
        .from('favourites')
        .upsert({ id: data.session.user.id })
      } else if(event === "SIGNED_OUT") {
        setUser(null)
      } 
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return (
    <>
      <div>
        <Header setFavourites={setFavourites} user={user} supabase={supabase} />
        {favourites.isDisplaying
        ? <Favourites favourites={favourites} 
                      setFavourites={setFavourites} 
                      playingPodcast={playingPodcast} 
                      setPlayingPodcast={setPlayingPodcast} 
                      setPodcastsPlayed={setPodcastsPlayed} 
          /> 
        : !user ? <LogIn supabase={supabase} /> 
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
