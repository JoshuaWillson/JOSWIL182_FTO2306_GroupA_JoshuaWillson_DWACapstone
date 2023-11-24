import { useState, useEffect } from "react";
import { genres } from "../genre-data";

export default function Preview(props) {
    const {} = props
    const [previewData, setPreviewData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [endSliceValue, setEndSliceValue] = useState(10);
    const isDisabled = previewData.slice(0, endSliceValue).length === previewData.length

    useEffect(() => {
        setIsLoading(true)
        fetch("https://podcast-api.netlify.app/shows")
        .then(response => response.json())
        .then(data => {
            setPreviewData(data)
            setIsLoading(false)
        })
    }, [])

    const displayPreviewData = () => [
        previewData.slice(0, endSliceValue).map(({title, image, id, description, seasons, genres, updated}) => {
            return <div key={id} className="preview--item">
                        <h3>{title}</h3>
                        <div className="preview--img--desc">
                            <img className="preview--img" src={image} alt="Preview Image" />
                            <h4 className="preview--desc">{description}</h4>
                        </div>
                   </div>
        })
    ]

    const clickHandler = () => {
        setEndSliceValue(prev => prev + prev)
    }

    const calcRemainingItems = () => {
        return previewData.slice(0, endSliceValue).length === previewData.length 
        ? 0 
        : previewData.length - endSliceValue
    }

    return (
        <div className="preview--container">
           {isLoading ? <h2 className="preview--loading">Loading...</h2> 
           : <div>
                {displayPreviewData()} 
                <button disabled={isDisabled} 
                        className="preview--more--button" 
                        onClick={clickHandler}>Show more ({calcRemainingItems()})
                </button>
             </div>}
        </div>
    )
}