import { useState, useEffect } from "react";

export default function Episode(props) {
    const {episodes, image, setPlayingPodcast, playingPodcast, setPodcastsPlayed} = props

    const EpisodeList = () => [
        episodes.map(({title, description, episode, file}) => {
        return <div key={episode}>
                    <h4>Episode {episode}: {title}</h4>
                    <h5>{description}</h5>
                    <button onClick={() => {
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
                    }}>Play</button>
               </div>
    })]
    
    return (
        <div>
            <EpisodeList />
        </div>
    )
}