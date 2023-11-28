import { useState, useEffect } from "react";

export default function AudioPlayer(props) {
    const {playingPodcast, setPlayingPodcast, setPodcastsPlayed} = props
    
    useEffect(() => {
        if(playingPodcast.isPlaying) {
            playingPodcast.audio.play()
            playingPodcast.audio.setAttribute("preload", "metadata")
            playingPodcast.audio.onloadedmetadata = () => {
                setPlayingPodcast(prevPlayingPodcast => {
                    return {
                        ...prevPlayingPodcast,
                        duration: Math.round(playingPodcast.audio.duration),
                    }
                })
            }
        }
    }, [playingPodcast.title])

    const playPauseButtonHandler = () => {
        if(!playingPodcast.isPlaying) {
            playingPodcast.audio.play()
            setPlayingPodcast(prevPlayingPodcast => {
                return {
                    ...prevPlayingPodcast,
                    isPlaying: true
                }
            })
        }else {
            playingPodcast.audio.pause()
            setPlayingPodcast(prevPlayingPodcast => {
                return {
                    ...prevPlayingPodcast,
                    isPlaying: false
                }
            })
        }
    }

    const closeButtonHandler = () => {
        playingPodcast.audio.pause()
        setPlayingPodcast(prevPlayingPodcast => {
            prevPlayingPodcast.timePlayed = Math.round(playingPodcast.audio.currentTime)
            prevPlayingPodcast.isDisplaying = false
            prevPlayingPodcast.isPlaying = false
            setPodcastsPlayed(prevPodcastsPlayed => {
                return [
                        ...prevPodcastsPlayed,
                        prevPlayingPodcast
                ]
            })
            return {
                ...prevPlayingPodcast,
                isPlaying: false,
                isDisplaying: false,
                audio: new Audio(playingPodcast.file)
            }
        })
    }

    return (
        <div className="audioplayer--container">
            <h4>{playingPodcast.title}</h4>
            <img src={playingPodcast.image} alt="Playing Podcast Image" width={50} />
            <button onClick={playPauseButtonHandler}>{playingPodcast.isPlaying ? "Pause" : "Play"}</button>
            <button onClick={closeButtonHandler}>Close</button>
        </div>
    )
}