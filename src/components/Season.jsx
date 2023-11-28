import { useState, useEffect } from "react";
import Episode from "./Episode";

export default function Season(props) {
    const {showSeasonsData, setPlayingPodcast, playingPodcast, setPodcastsPlayed, setFavourites, favourites, showTitle} = props 
    const [selectedSeason, setSelectedSeason] = useState(1)
    const [displaySeason, setDisplaySeason] = useState()

    const SeasonSelectOptions = () => {
        return showSeasonsData.map(({season, title}) => {
            return <option key={season} value={season}>{title}</option>
        })
    }

    useEffect(() => {
        setDisplaySeason(showSeasonsData.map(({season, title, episodes, image}) => {
            return <div key={season}>
                        <h3 className="season--title">{title} ({episodes.length} Episodes)</h3>
                        <img src={image} alt="Season Image" width={100} />
                        <Episode episodes={episodes} 
                            image={image}
                            setPlayingPodcast={setPlayingPodcast} 
                            playingPodcast={playingPodcast} 
                            setPodcastsPlayed={setPodcastsPlayed}
                            setFavourites={setFavourites}
                            favourites={favourites}
                            showTitle={showTitle}
                        />
                  </div>
        })[selectedSeason - 1])
    }, [selectedSeason, playingPodcast, favourites])

    const handleSeasonSelectChange = (event) => {
        const {value} = event.target
        setSelectedSeason(value)
    }

    return (
        <div>
            <select value={selectedSeason} onChange={handleSeasonSelectChange}>
                <SeasonSelectOptions />
            </select>
            {displaySeason}
        </div>
    )
}