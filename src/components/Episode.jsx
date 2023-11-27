import { useState, useEffect } from "react";

export default function Episode(props) {
    const {episodes, image, setPlayingPodcast} = props

    const EpisodeList = () => [
        episodes.map(({title, description, episode, file}) => {
        return <div key={episode}>
                    <h4>Episode {episode}: {title}</h4>
                    <h5>{description}</h5>
                    <button onClick={() => setPlayingPodcast(prevPlayingPodcast => {
                        return {
                            ...prevPlayingPodcast,
                            isPlaying: true
                        } 
                    })}>Play</button>
               </div>
    })]
    
    return (
        <div>
            <EpisodeList />
        </div>
    )
}