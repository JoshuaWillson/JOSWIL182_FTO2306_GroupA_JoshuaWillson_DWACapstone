import {useEffect, useState} from 'react'

export default function Favourites(props) {
    const {favourites, setFavourites, playingPodcast, setPlayingPodcast, setPodcastsPlayed} = props

    const playButtonHandler = (title, file, image) => {
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

    const removeButtonHandler = (title) => {
        if(favourites.episodes.some((item) => item.title === title)) {
            setFavourites(prevFavourites => {
                return {
                    ...prevFavourites,
                    episodes: prevFavourites.episodes.filter((item) => {
                        return item.title !== title
                    })
                }
            })
        }
    }

    const FavouritesList = () => [
        favourites.episodes.map(({title, description, episode, file, image}) => {
            return <div key={title}>
                        <h4>Episode {episode}: {title}</h4>
                        <button onClick={() => removeButtonHandler(title)}>Remove</button>
                        <h5>{description}</h5>
                        <button onClick={() => playButtonHandler(title, file, image)}>Play</button>
                   </div>
        })
    ]

    return (
        <div>
            {favourites.episodes.length > 0 
            ? <div>
                <h1>Favourites</h1>
                <FavouritesList /> 
              </div> 
            : <h1>No favourites at the moment...</h1>}
        </div>
    )
}