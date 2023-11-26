import { useState, useEffect } from "react";
import { genreArray } from "../genre-data";

export default function Show(props) {
    const {id, genres, setShow} = props
    const [showData, setshowData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [genreData, setGenreData] = useState([]);

    useEffect(() => {
        setIsLoading(true)
        fetch(`https://podcast-api.netlify.app/id/${id}`)
        .then(response => response.json())
        .then(data => {
            setshowData(data)
            setGenreData(data.genres)
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

    return (
        <div>
            {isLoading
            ? <h2 className="loading">Loading...</h2>
            : <div className="show--container">
                <button className="show--back--button" onClick={showBackButtonClickHandler}>Back</button>
                <img className="show--img" src={showData.image} alt="Show Image" />
                <h1>{showData.title}</h1>
                <h2>{showData.description}</h2>
                <h3>Genres:</h3>
                <ShowGenres />
              </div>}
        </div>
        

    )
}