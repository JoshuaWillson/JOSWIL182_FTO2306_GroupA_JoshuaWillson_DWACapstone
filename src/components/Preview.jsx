import { useState, useEffect } from "react";
import { genres } from "../genre-data";
import Show from "./Show"

export default function Preview(props) {
    const {} = props;
    const [previewData, setPreviewData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [endSlice, setEndSlice] = useState({value: 8, stepAmount: 8});
    const [show, setShow] = useState({display: false, id: ""});
    const isDisabled = previewData.slice(0, endSlice.value).length === previewData.length;

    useEffect(() => {
        setIsLoading(true)
        fetch("https://podcast-api.netlify.app/shows")
        .then(response => response.json())
        .then(data => {
            setPreviewData(data)
            setIsLoading(false)
        })
    }, [])

    const showButtonClickHandler = (id) => {
        setShow(prevShow => {
            return {
                ...prevShow,
                display: true,
                id: id,
            }
        })
    }

    const PreviewList = () => [
        previewData.slice(0, endSlice.value).map(({title, image, id, description, seasons, genres, updated}) => {
            return <div key={id} id={id} className="preview--item" onClick={() => showButtonClickHandler(id)}>
                        <h3 className="preview--title">{title}</h3>
                        <div className="preview--img--desc">
                            <img className="preview--img" src={image} alt="Preview Image" />
                            <h4 className="preview--desc">{description}</h4>
                        </div>
                   </div>
        })
    ]

    const moreButtonClickHandler = () => {
        setEndSlice(prevEndSlice => {
            return {
                ...prevEndSlice,
                value: prevEndSlice.value + prevEndSlice.stepAmount
            }
        })
    }

    const calcRemainingItems = () => {
        return previewData.slice(0, endSlice.value).length === previewData.length 
        ? 0 
        : previewData.length - endSlice.value
    }

    return (
        <div>
           {!show.display
           ? <div>
                {isLoading 
                ? <h2 className="loading">Loading...</h2> 
                : <div className="preview--container">
                    <div className="preview--list">
                        {PreviewList()}
                    </div>
                  <button disabled={isDisabled} 
                          className="preview--more--button" 
                          onClick={moreButtonClickHandler}>Show more ({calcRemainingItems()})
                  </button>
                  </div>}
            </div>
            : <Show id={show.id} setShow={setShow} setIsLoading={setIsLoading} />}
        </div>
    )
}