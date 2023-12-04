import { useState, useEffect } from "react";

export default function AudioPlayer(props) {
    const {playingPodcast, setPlayingPodcast, setPodcastsPlayed} = props
    const [currentAudioTime, setCurrentAudioTime] = useState(0)
    
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

    useEffect(() => {
        if(playingPodcast.isNewAudio) {
            setCurrentAudioTime(0)
            setPlayingPodcast(prevPlayingPodcast => {
                return {
                    ...prevPlayingPodcast,
                    isNewAudio: false
                }
            })
        }

        if(currentAudioTime < playingPodcast.duration && playingPodcast.isPlaying) {
            const interval = setInterval(() => {
                setCurrentAudioTime(prevCurrentAudioTime => prevCurrentAudioTime + 1)
              }, 1000)
            
            return () => clearInterval(interval)
        }
    })

    useEffect(() => {
        const handleBeforeUnload = (event) => {
          event.preventDefault()
          event.returnValue = true
          playingPodcast.audio.pause()
            setPlayingPodcast(prevPlayingPodcast => {
                return {
                    ...prevPlayingPodcast,
                    isPlaying: false
                }
            })
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload)
        }
      }, [])

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
                title: '',
                audio: new Audio(playingPodcast.file)
            }
        })
    }

    const formatAudioTimeStamp = () => {
        const currentMinutes = Math.floor(currentAudioTime/60).toString().padStart(2, '0')
        const currentSeconds = (currentAudioTime-Math.floor(currentAudioTime/60)*60).toString().padStart(2, '0')
        const totalMinutes = Math.floor(playingPodcast.duration/60).toString().padStart(2, '0')
        const totalSeconds = (playingPodcast.duration-Math.floor(playingPodcast.duration/60)*60).toString().padStart(2, '0')
        return `${currentMinutes}:${currentSeconds} / ${totalMinutes}:${totalSeconds}`
    }

    return (
        <div className="audioplayer--container">
            <h4>{playingPodcast.title}</h4>
            <img src={playingPodcast.image} alt="Playing Podcast Image" width={50} />
            <button onClick={playPauseButtonHandler}>{playingPodcast.isPlaying ? "Pause" : "Play"}</button>
            <button onClick={closeButtonHandler}>Close</button>
            <h6>{formatAudioTimeStamp()}</h6>
        </div>
    )
}