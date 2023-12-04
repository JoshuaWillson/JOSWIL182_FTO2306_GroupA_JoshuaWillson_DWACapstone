import { useState, useEffect } from "react";

export default function Episode(props) {
    const {episodes, image, setPlayingPodcast, playingPodcast, setPodcastsPlayed, setFavourites, favourites, showTitle, season, seasonTitle, showUpdated, supabase, user} = props

    useEffect(() => {
        async function updateFavouritesDB() {
            await supabase
            .from('favourites')
            .update({ favourites: favourites.episodes })
            .eq('id', user.id)
        }
        updateFavouritesDB()
      }, [favourites])

    const playButtonHandler = (title, file) => {
        setPlayingPodcast(prevPlayingPodcast => {
            if(prevPlayingPodcast.audio && !(prevPlayingPodcast.title === title)) {
                prevPlayingPodcast.audio.pause()
                prevPlayingPodcast.timePlayed = Math.round(playingPodcast.audio.currentTime)
                prevPlayingPodcast.isDisplaying = false
                prevPlayingPodcast.isPlaying = false
                setPodcastsPlayed(prevPodcastsPlayed => {
                    return [
                        ...prevPodcastsPlayed,
                        prevPlayingPodcast
                    ]
                })
            }
            if(!(prevPlayingPodcast.title === title)) {
                return {
                    ...prevPlayingPodcast,
                    isDisplaying: true,
                    isPlaying: true,
                    file: file,
                    image: image,
                    title: title,
                    audio: new Audio(file),
                }
            }else {
                return {
                    ...prevPlayingPodcast,
                    isDisplaying: true,
                    isPlaying: true,
                }
            }
        })
    }

    const getDateTime = () => {
        const date = new Date()
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
    }

    const favouriteButtonHandler = (title, description, episode, file) => {
        if(favourites.episodes.some((item) => item.title === title)) {
            setFavourites(prevFavourites => {
                return {
                    ...prevFavourites,
                    episodes: prevFavourites.episodes.filter((item) => {
                        return item.title !== title
                    })
                }
            })
        }else {
            setFavourites(prevFavourites => {
                return {
                    ...prevFavourites,
                    episodes: [
                        ...prevFavourites.episodes,
                        {
                            title: title,
                            description: description,
                            episode: episode,
                            file: file,
                            date: getDateTime(),
                            showTitle: showTitle,
                            image: image,
                            season: season,
                            seasonTitle: seasonTitle,
                            showUpdated: showUpdated
                        }
                    ]
                }
            })
        }
    }

    const EpisodeList = () => [
        episodes.map(({title, description, episode, file}) => {
        return <div key={episode}>
                    <h4>Episode {episode}: {title}</h4>
                    <button onClick={() => favouriteButtonHandler(title, description, episode, file)}>{favourites.episodes.some((item) => item.title === title) 
                    ? "Unfavourite" : "Favourite"}</button>
                    <h5>{description}</h5>
                    <button onClick={() => playButtonHandler(title, file)}>Play</button>
               </div>
    })]
    
    return (
        <div>
            <EpisodeList />
        </div>
    )
}