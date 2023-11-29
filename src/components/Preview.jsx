import { useState, useEffect } from "react";
import { genreArray } from "../genre-data";
import Show from "./Show";
import PreviewSlideShow from "./PreviewSlideShow";

export default function Preview(props) {
    const {setPlayingPodcast, playingPodcast, setPodcastsPlayed, setFavourites, favourites} = props;
    const [previewData, setPreviewData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [endSlice, setEndSlice] = useState({value: 8, stepAmount: 8});
    const [show, setShow] = useState({display: false, id: "", genres: []});
    const [selectedFilter, setSelectedFilter] = useState("Default")
    const [titleSearch, setTitleSearch] = useState("")
    const [filteredGenres, setFilteredGenres] = useState([])
    const [filteredPreviewData, setFilteredPreviewData] = useState([])

    useEffect(() => {
        setIsLoading(true)
        fetch("https://podcast-api.netlify.app/shows")
        .then(response => response.json())
        .then(data => {
            setPreviewData(data)
            setIsLoading(false)
        })
    }, [])
    
    useEffect(() => {
        const filterData = [...previewData]

        if(selectedFilter === "Default") {
            setFilteredPreviewData(filterData)
        }else if(selectedFilter === "Title (A-Z)") {
            const sortedPreview = filterData.sort((a, b) => {
                return a.title.localeCompare(b.title)
        })
        setFilteredPreviewData(sortedPreview)
        }else if(selectedFilter === "Title (Z-A)") {
            const sortedPreview = filterData.sort((a, b) => {
                return b.title.localeCompare(a.title)
            })
            setFilteredPreviewData(sortedPreview)
        }else if(selectedFilter === "Date Updated (Ascending)") {
            const sortedPreview = filterData.sort((a, b) => {
                const date1 = new Date(a.updated)
                const date2 = new Date(b.updated)
                return date1 - date2
            })
            setFilteredPreviewData(sortedPreview)
        }else if(selectedFilter === "Date Updated (Descending)") {
            const sortedPreview = filterData.sort((a, b) => {
                const date1 = new Date(a.updated)
                const date2 = new Date(b.updated)
                return date2 - date1
            })
            setFilteredPreviewData(sortedPreview)
        }

        if(filteredGenres.length > 0) {
            setFilteredPreviewData(filterData.filter((item) => {
                return item.genres.map((num) => {
                    return genreArray.map(({id, title}) => {
                        return num === id && title
                    })
                }).flat().map((genre) => {
                    return filteredGenres.map((item) => {
                        return item === genre
                    })
                }).flat().flat().some((item) => item === true)
            }))
        }

        if(titleSearch.trim() !== "") {
            setFilteredPreviewData(filterData.filter((item) => {
                return item.title.trim().toLocaleLowerCase().includes(titleSearch.trim().toLocaleLowerCase())
            }))
        }
    }, [titleSearch, previewData, selectedFilter, filteredGenres])

    const showButtonClickHandler = (event, id, genres) => {
        if(event.target.className === "preview--genre") return null
        setShow(prevShow => {
            return {
                ...prevShow,
                display: true,
                id: id,
                genres: genres 
            }
        })
    }

    const genreButtonHandler = (genre) => {
        filteredGenres.some((item) => {
            return item === genre
        }) 
        ? null
        : setFilteredGenres(prevFilteredGenres => {
                return [
                    ...prevFilteredGenres,
                    genre
                ]
          })
    }

    const PreviewGenres = (props) => {
        const {genres} = props
        return genres.map((num) => {
            return genreArray.map(({id, title}) => {
                return num === id && <h6 onClick={() => genreButtonHandler(title)} className="preview--genre" key={id}>{title}</h6>
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
        filteredPreviewData.slice(0, endSlice.value).map(({title, image, id, description, seasons, genres, updated}) => {
            return <div key={id} id={id} className="preview--item" onClick={(event) => showButtonClickHandler(event, id, genres)}>
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
        return filteredPreviewData.slice(0, endSlice.value).length === filteredPreviewData.length 
        ? 0 
        : filteredPreviewData.length - endSlice.value
    }

    const handleFilterSelectChange = (event) => {
        const {value} = event.target
        setSelectedFilter(value)
    }

    const handleTitleSearchChange = (event) => {
        const {value} = event.target
        setTitleSearch(value)
    }

    return (
        <div>
           {!show.display
           ? <div>
                {isLoading 
                ? <h2 className="loading">Loading...</h2> 
                : <div className="preview--container">
                    <h2>You might be interested in...</h2>
                    <PreviewSlideShow previewData={previewData} setShow={setShow} />
                    <h2>Featured</h2>
                    <div>
                        <label htmlFor="filterPreview">Sort By: </label>
                        <select id='filterPreview' value={selectedFilter} onChange={handleFilterSelectChange}>
                            <option value="Default">Default</option>
                            <option value="Title (A-Z)">Title (A-Z)</option>
                            <option value="Title (Z-A)">Title (Z-A)</option>
                            <option value="Date Updated (Ascending)">Date Updated (Ascending)</option>
                            <option value="Date Updated (Descending)">Date Updated (Descending)</option>
                        </select>
                        <input type="text" placeholder="Search Title" value={titleSearch} onChange={handleTitleSearchChange} />
                        {filteredGenres.length > 0 && <div>
                                                            {filteredGenres.map((genre) => {
                                                                return <h6 onClick={() => {
                                                                    setFilteredGenres(prevFilteredGenres => {
                                                                        return [
                                                                            ...prevFilteredGenres.filter((item) => {
                                                                                return item !== genre
                                                                            })
                                                                        ]
                                                                    })
                                                                }} className="preview--genre" key={genre}>{genre} (Clear)</h6>
                                                            })}
                                                      </div>}
                    </div>
                    <div className="preview--list">
                        <PreviewList />
                    </div>
                  <button disabled={filteredPreviewData.slice(0, endSlice.value).length === filteredPreviewData.length}
                          className="preview--more--button" 
                          onClick={moreButtonClickHandler}>Show more ({calcRemainingItems()})
                  </button>
                  </div>}
            </div>
            : <Show id={show.id} 
                    genres={show.genres} 
                    setShow={setShow} 
                    setPlayingPodcast={setPlayingPodcast} 
                    playingPodcast={playingPodcast} 
                    setPodcastsPlayed={setPodcastsPlayed}
                    setFavourites={setFavourites}
                    favourites={favourites}
              />
            }
        </div>
    )
}