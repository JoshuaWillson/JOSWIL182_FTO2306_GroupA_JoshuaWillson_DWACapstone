import { useState, useEffect } from "react";
import { genres } from "../genre-data";

export default function Preview() {
    const [previewData, setPreviewData] = useState([])

    useEffect(() => {
        fetch("https://podcast-api.netlify.app/shows")
        .then(response => response.json())
        .then(data => setPreviewData(data))
    }, [])

    const displayPreviewData = () => [
        previewData.map(({title, image, id, description, seasons, genres, updated}) => {
            return <div key={id} className="preview--item">
                        <h3>{title}</h3>
                        <img src={image} alt="Preview Image" width="100" />
                   </div>
        })
    ]

    return (
        <div className="preview--container">
           {displayPreviewData()}
        </div>
    )
}