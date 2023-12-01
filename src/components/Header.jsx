import React from "react";

export default function Header(props) {
    const {setFavourites, supabase, user} = props

    const navButtonHandler = (nav) => {
        setFavourites(prevFavourites => {
            return {
                ...prevFavourites,
                isDisplaying: nav === 'home' ? false : true
            }
        })
    }

    const signOutButtonHandler = async () => {
        await supabase.auth.signOut()
        setFavourites(prevFavourites => {
            return {
                ...prevFavourites,
                isDisplaying: false
            }
        })
    }

    return (
        <div className="header--container">
            {user && <div>
                        <button onClick={() => navButtonHandler("home")}>Home</button>
                        <button onClick={() => navButtonHandler("favourites")}>Favourites</button>
                     </div>}
            <img className="header--img" src="../src/images/microphone.png" alt="Microphone Image" />
            <h1 className="header--heading">The Podcast App</h1>
            {user && <div>
                        <h6>{user}</h6>
                        <button onClick={signOutButtonHandler}>Sign out</button>
                    </div>}
        </div>
    )
}

