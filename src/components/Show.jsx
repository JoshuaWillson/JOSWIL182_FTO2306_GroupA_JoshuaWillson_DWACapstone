import { useState, useEffect } from "react";
import { genreArray } from "../genre-data";
import Season from "./Season";

export default function Show(props) {
    const {id, genres, setShow, setPlayingPodcast, playingPodcast, setPodcastsPlayed, setFavourites, favourites} = props;
    const [showData, setshowData] = useState({});
    const [showSeasonsData, setShowSeasonsData] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        fetch(`https://podcast-api.netlify.app/id/${id}`)
        .then(response => response.json())
        .then(data => {
            setshowData(data)
            setShowSeasonsData(data.seasons)
            setIsLoading(false)
        })
    }, [])
    
    const showBackButtonClickHandler = () => {
        setShow(prevShow => {
            return {
                ...prevShow,
                display: false,
            }
        })
    }

    const ShowGenres = () => {
        return genres.map((num) => {
            return genreArray.map(({id, title}) => {
                return num === id && <h4 key={id}>{title}</h4>
            })
        })
    }

    const ShowUpdated = (props) => {
        const {updated} = props
        const date = new Date(updated)
        let month
        const dayOfMonth = date.getDate() > 9 ? date.getDate().toString() : `0${date.getDate()}`
        switch (date.getMonth() + 1) { case 1: month = "Jan"; break; case 2: month = "Feb"; break; case 3: month = "Mar"; break;
        case 4: month = "Apr"; break; case 5: month = "May"; break; case 6:month = "Jun"; break; case 7: month = "Jul"; break;
        case 8: month = "Aug"; break; case 9: month = "Sep"; break; case 10: month = "Oct"; break; case 11: month = "Nov"; break;
        case 12: month = "Dec"; break } 
        const year = date.getFullYear()

        return <h4 className="preview--updated">{`Updated: ${dayOfMonth} ${month} ${year}`}</h4>

    }

    return (
        <div>
            {isLoading
            ? <h2 className="loading">Loading...</h2>
            : <div className="show--container">
                <button className="show--back--button" onClick={showBackButtonClickHandler}>Back</button>
                <img className="show--img" src={showData.image} alt="Show Image" />
                <h1>{showData.title}</h1>
                <h2>{showData.description}</h2>
                <ShowGenres />
                <ShowUpdated updated={showData.updated} />
                <h2>Seasons: {showSeasonsData.length}</h2>
                <Season showSeasonsData={showSeasonsData} 
                        setPlayingPodcast={setPlayingPodcast} 
                        playingPodcast={playingPodcast} 
                        setPodcastsPlayed={setPodcastsPlayed}
                        setFavourites={setFavourites}
                        favourites={favourites}
                        showTitle={showData.title}
                        showUpdated={showData.updated}
                />
              </div>}
        </div>
    )
}