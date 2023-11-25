import { useState, useEffect } from "react";
import { genres } from "../genre-data";

export default function Show(props) {
    const {id, setShow} = props
    const [showData, setshowData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        fetch(`https://podcast-api.netlify.app/id/${id}`)
        .then(response => response.json())
        .then(data => {
            setshowData(data)
            setIsLoading(false)
        })
    }, [])
    
    const showButtonClickHandler = () => {
        setShow(prevShow => {
            return {
                ...prevShow,
                display: false,
            }
        })
    }

    return (
        <div>
            {isLoading
            ? <h2 className="loading">Loading...</h2>
            : <div className="show--container">
                <button className="show--back--button" onClick={showButtonClickHandler}>Back</button>
                <img className="show--img" src={showData.image} alt="Show Image" />
                <h1>{showData.title}</h1>
              </div>}
        </div>
        

    )
}