import {useEffect, useState} from 'react'

export default function Favourites(props) {
    const {favourites, setFavourites, playingPodcast, setPlayingPodcast, setPodcastsPlayed} = props
    const [filteredFavourites, setFilteredFavourites] = useState([])
    const [selectedFilter, setSelectedFilter] = useState("Default")

    useEffect(() => {
        const favouritesArray = [...favourites.episodes]
        if(selectedFilter === "Default") {
            const defaultFavourites = favourites.episodes.sort((a, b) => {
                return a.episode - b.episode
            })
            setFilteredFavourites(defaultFavourites)
        }else if(selectedFilter === "Show Titles (A-Z)") {
            const sortedFavourites = favouritesArray.sort((a, b) => {
                return a.showTitle.localeCompare(b.showTitle)
            })
            setFilteredFavourites(sortedFavourites)
        }else if(selectedFilter === "Show Titles (Z-A)") {
            const sortedFavourites = favouritesArray.sort((a, b) => {
                return b.showTitle.localeCompare(a.showTitle)
            })
            setFilteredFavourites(sortedFavourites)
        }else if(selectedFilter === "Date Updated (Ascending)") {
            const sortedFavourites = favouritesArray.sort((a, b) => {
                const date1 = new Date(a.showUpdated)
                const date2 = new Date(b.showUpdated)
                return date1 - date2
            })
            setFilteredFavourites(sortedFavourites)
        }else if(selectedFilter === "Date Updated (Descending)") {
            const sortedFavourites = favouritesArray.sort((a, b) => {
                const date1 = new Date(a.showUpdated)
                const date2 = new Date(b.showUpdated)
                return date2 - date1
            })
            setFilteredFavourites(sortedFavourites)
        }
    }, [selectedFilter, favourites])

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
        Object.entries(Object.groupBy(filteredFavourites, ({ showTitle }) => showTitle)).map(([showTitle, episode]) => {
            return <div key={showTitle}>
                        <h2>{showTitle}</h2>
                        {Object.entries(Object.groupBy(episode, ({ seasonTitle }) => seasonTitle)).map(([seasonTitle, item]) => {
                            return <div key={seasonTitle}>
                                        <h3>{seasonTitle}</h3>
                                        {item.map(({title, description, episode, file, image, date}) => {
                                            return <div key={title}>
                                                        <h4>Episode {episode}: {title}</h4>
                                                        <h6>Added: {date}</h6>
                                                        <button onClick={() => removeButtonHandler(title)}>Remove</button>
                                                        <h5>{description}</h5>
                                                        <button onClick={() => playButtonHandler(title, file, image)}>Play</button>
                                                    </div>
                                        })}
                                   </div>
                        })}
                   </div>
        })
    ]

    const handleSeasonSelectChange = (event) => {
        const {value} = event.target
        setSelectedFilter(value)
    }

    return (
        <div>
            {favourites.episodes.length > 0 
            ? <div>
                <h1>Favourites</h1>
                <label htmlFor="filter">Sort By: </label>
                <select id='filter' value={selectedFilter} onChange={handleSeasonSelectChange}>
                    <option value="Default">Default</option>
                    <option value="Show Titles (A-Z)">Show Titles (A-Z)</option>
                    <option value="Show Titles (Z-A)">Show Titles (Z-A)</option>
                    <option value="Date Updated (Ascending)">Date Updated (Ascending)</option>
                    <option value="Date Updated (Descending)">Date Updated (Descending)</option>
                </select>
                <FavouritesList /> 
              </div> 
            : <h1>No favourites at the moment...</h1>}
        </div>
    )
}