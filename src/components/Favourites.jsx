import {useEffect, useState} from 'react'

export default function Favourites(props) {
    const {favourites, setFavourites, playingPodcast, setPlayingPodcast, setPodcastsPlayed, supabase, user} = props
    const [filteredFavourites, setFilteredFavourites] = useState([])
    const [selectedFilter, setSelectedFilter] = useState("Default")

    useEffect(() => {
        async function updateFavouritesDB() {
            await supabase
            .from('favourites')
            .update({ favourites: favourites.episodes })
            .eq('id', user.id)
        }
        updateFavouritesDB()
      }, [favourites])

    useEffect(() => {
        const orderedFavourites = [...(Object.values(Object.groupBy(favourites.episodes, ({ showTitle }) => showTitle)).map((show) => {
            return Object.values(Object.groupBy(show, ({ seasonTitle }) => seasonTitle)).map((season) => {
                return season.sort((a, b) => {
                    return a.episode - b.episode
                })
            })
        })).flat().flat().sort((a, b) => {
            return a.season - b.season
        })]

        if(selectedFilter === "Default") {
            setFilteredFavourites(orderedFavourites)
        }else if(selectedFilter === "Show Title (A-Z)") {
            const sortedFavourites = orderedFavourites.sort((a, b) => {
                return a.showTitle.localeCompare(b.showTitle)
            })
            setFilteredFavourites(sortedFavourites)
        }else if(selectedFilter === "Show Title (Z-A)") {
            const sortedFavourites = orderedFavourites.sort((a, b) => {
                return b.showTitle.localeCompare(a.showTitle)
            })
            setFilteredFavourites(sortedFavourites)
        }else if(selectedFilter === "Date Updated (Ascending)") {
            const sortedFavourites = orderedFavourites.sort((a, b) => {
                const date1 = new Date(a.showUpdated)
                const date2 = new Date(b.showUpdated)
                return date1 - date2
            })
            setFilteredFavourites(sortedFavourites)
        }else if(selectedFilter === "Date Updated (Descending)") {
            const sortedFavourites = orderedFavourites.sort((a, b) => {
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
        Object.entries(Object.groupBy(filteredFavourites, ({ showTitle }) => showTitle)).map(([showTitle, show]) => {
            return <div key={showTitle}>
                        <h2 className='favourites--show--title'>{showTitle}</h2>
                        {Object.entries(Object.groupBy(show, ({ seasonTitle }) => seasonTitle)).map(([seasonTitle, season]) => {
                            return <div key={seasonTitle}>
                                        <div className='favourites--season--title--img'>
                                            <h3>{seasonTitle}</h3>
                                            <img className='favourites--img' src={season[0].image} alt="Season Image" />
                                        </div>
                                        {season.map(({title, description, episode, file, image, date}) => {
                                            return <div key={title} className='favourites--episode'>
                                                        <h4>Episode {episode}: {title}</h4>
                                                        <h6>Added: {date}</h6>
                                                        <button className='favourites--episode--button' onClick={() => removeButtonHandler(title)}>Remove</button>
                                                        <h5>{description}</h5>
                                                        <button className='favourites--episode--button' onClick={() => playButtonHandler(title, file, image)}>Play</button>
                                                    </div>
                                        })}
                                   </div>
                        })}
                   </div>
        })
    ]

    const handleFilterSelectChange = (event) => {
        const {value} = event.target
        setSelectedFilter(value)
    }

    const backToHomeButtonHandler = () => {
        setFavourites(prevFavourites => {
            return {
                ...prevFavourites,
                isDisplaying: false
            }
        })
    }

    return (
        <div>
            {favourites.episodes.length > 0 
            ? <div className='favourites--container'>
                <h1>Favourites</h1>
                <div className='favourites--label--select'>
                    <label htmlFor="filterFavourites">Sort By:</label>
                    <select className='favourites--select' id='filterFavourites' value={selectedFilter} onChange={handleFilterSelectChange}>
                        <option value="Default">Default</option>
                        <option value="Show Title (A-Z)">Show Title (A-Z)</option>
                        <option value="Show Title (Z-A)">Show Title (Z-A)</option>
                        <option value="Date Updated (Ascending)">Date Updated (Ascending)</option>
                        <option value="Date Updated (Descending)">Date Updated (Descending)</option>
                    </select>
                </div>
                <FavouritesList /> 
              </div> 
            : <div className='favourites--nofavourites'>
                <h1>No favourites at the moment...</h1>
                <button onClick={backToHomeButtonHandler}>Back to home</button>
              </div>
            }
        </div>
    )
}