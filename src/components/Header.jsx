import React from "react";

export default function Header(props) {
    const {setFavourites} = props

    const navButtonHandler = (nav) => {
        setFavourites(prevFavourites => {
            return {
                ...prevFavourites,
                isDisplaying: nav === 'home' ? false : true
            }
        })
    }

    return (
        <div className="header--container">
            <img className="header--img" src="../src/images/microphone.png" alt="Microphone Image" />
            <h1 className="header--heading">The Podcast App</h1>
            <button onClick={() => navButtonHandler("home")}>Home</button>
            <button onClick={() => navButtonHandler("favourites")}>Favourites</button>
        </div>
    )
}

