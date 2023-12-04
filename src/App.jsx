import {useEffect, useState} from 'react'
import Header from "./components/Header"
import Preview from "./components/Preview"
import AudioPlayer from './components/AudioPlayer'
import Favourites from "./components/Favourites"
import LogIn from "./components/LogIn"
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
const { data } = await supabase.auth.getSession()

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
  const [favourites, setFavourites] = useState({
    isDisplaying: false,
    episodes: []
  })
  const [user, setUser] = useState({email: null, id: null})

  useEffect(() => {
    const {session} = data

    setUser(prevUser => {
      return {
        ...prevUser,
        email: session?.user.email,
        id: session?.user.id
      }
    })

    const { subscription } = supabase.auth.onAuthStateChange( async (event, session) => {
      if(event === "SIGNED_IN") {
        setUser(prevUser => {
          return {
            ...prevUser,
            email: session?.user.email,
            id: session?.user.id
          }
        })
      } else if(event === "SIGNED_OUT") {
        setUser(prevUser => {
          return {
            ...prevUser,
            email: null,
            id: null
          }
        })
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if(user.email && user.id) {
      async function insertFirstTimeUserFavouritesDB() {
        await supabase
          .from('favourites')
          .upsert({ id: user.id })
      }
      insertFirstTimeUserFavouritesDB()
    }
  }, [user])

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
                      supabase={supabase}
                      user={user}
          /> 
        : !(user.email && user.id) ? <LogIn supabase={supabase} /> 
               : <Preview setPlayingPodcast={setPlayingPodcast} 
                          playingPodcast={playingPodcast} 
                          setPodcastsPlayed={setPodcastsPlayed} 
                          setFavourites={setFavourites} 
                          favourites={favourites} 
                          supabase={supabase}
                          user={user} />
        }
        {playingPodcast.isDisplaying && <AudioPlayer playingPodcast={playingPodcast} setPlayingPodcast={setPlayingPodcast} setPodcastsPlayed={setPodcastsPlayed} />}
      </div>
    </>
  )
}
