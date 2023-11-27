import { useState, useEffect } from "react";
import { genreArray } from "../genre-data";
import Show from "./Show";
import PreviewSlideShow from "./PreviewSlideShow";

export default function Preview(props) {
    const {setPlayingPodcast} = props;
    const [previewData, setPreviewData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [endSlice, setEndSlice] = useState({value: 8, stepAmount: 8});
    const [show, setShow] = useState({display: false, id: "", genres: []});
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

    const showButtonClickHandler = (id, genres) => {
        setShow(prevShow => {
            return {
                ...prevShow,
                display: true,
                id: id,
                genres: genres 
            }
        })
    }

    const PreviewGenres = (props) => {
        const {genres} = props
        return genres.map((num) => {
            return genreArray.map(({id, title}) => {
                return num === id && <h6 className="preview--genre" key={id}>{title}</h6>
            })
        })
    }

    const PreviewUpdated = (props) => {
        const {updated} = props
        const date = new Date(updated)
        let month
        const dayOfMonth = date.getDate() > 9 ? date.getDate().toString() : `0${date.getDate()}`
        switch (date.getMonth() + 1) { case 1: month = "Jan"; break; case 2: month = "Feb"; break; case 3: month = "Mar"; break;
        case 4: month = "Apr"; break; case 5: month = "May"; break; case 6:month = "Jun"; break; case 7: month = "Jul"; break;
        case 8: month = "Aug"; break; case 9: month = "Sep"; break; case 10: month = "Oct"; break; case 11: month = "Nov"; break;
        case 12: month = "Dec"; break } 
        const year = date.getFullYear()

        return <h6 className="preview--updated">{`Updated: ${dayOfMonth} ${month} ${year}`}</h6>

    }

    const PreviewList = () => [
        previewData.slice(0, endSlice.value).map(({title, image, id, description, seasons, genres, updated}) => {
            return <div key={id} id={id} className="preview--item" onClick={() => showButtonClickHandler(id, genres)}>
                            <div className="preview--seasons--updated">
                                <h6 className="preview--seasons">Seasons: {seasons}</h6>
                                <PreviewUpdated updated={updated} />
                            </div>
                            <h4 className="preview--title">{title}</h4>
                            <div className="preview--img--desc">
                                <img className="preview--img" src={image} alt="Preview Image" />
                                    <h5 className="preview--desc">{description}</h5>
                            </div>
                            <div className="preview--genres">
                                <PreviewGenres genres={genres} />
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
                    <h2>Suggested</h2>
                    <PreviewSlideShow previewData={previewData} setShow={setShow} />
                    <h2>Featured</h2>
                    <div className="preview--list">
                        <PreviewList />
                    </div>
                  <button disabled={isDisabled} 
                          className="preview--more--button" 
                          onClick={moreButtonClickHandler}>Show more ({calcRemainingItems()})
                  </button>
                  </div>}
            </div>
            : <Show id={show.id} genres={show.genres} setShow={setShow} setPlayingPodcast={setPlayingPodcast} />}
        </div>
    )
}