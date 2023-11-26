import { useState, useEffect, useRef } from "react";

export default function PreviewSlideShow(props) {
    const {previewData, setShow} = props;
    const [index, setIndex] = useState(0);
    const timeoutRef = useRef(null);

    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }

    useEffect(() => {
      resetTimeout()
      timeoutRef.current = setTimeout(
        () =>
          setIndex((prevIndex) =>
            prevIndex === previewData.length - 1 ? 0 : prevIndex + 1
          ),
        2500
      );
  
      return () => {
        resetTimeout()
      };
    }, [index]);

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

  const clickBackHandler = () => {
    setIndex(prevIndex => prevIndex === 0 ? previewData.length - 1 : prevIndex - 1)
  }

  const clickForwardHandler = () => {
    setIndex(prevIndex => prevIndex === previewData.length - 1 ? 0 : prevIndex + 1)
  }

    return (
      <div className="previewslideshow--container">
        <button className="previewslideshow--back--button" onClick={clickBackHandler}>{"<"}</button>
        <div className="previewslideshow--slideshow">
          <div className="previewslideshow--slider" style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
            {previewData.map(({image, id, genres}) => {
                return <img className="previewslideshow--slide" src={image} key={id} onClick={() => showButtonClickHandler(id, genres)}/>
            })}
          </div>
        </div>
        <button className="previewslideshow--forward--button" onClick={clickForwardHandler}>{">"}</button>
      </div>
      )
}