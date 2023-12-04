import React from "react";

export default function Header(props) {
    const {setFavourites, supabase, user} = props

    const navButtonHandler = async (nav) => {
        const { data: favouritesDB } = await supabase
            .from('favourites')
            .select('favourites')
            .eq('id', user.id)
            .maybeSingle()

        setFavourites(prevFavourites => {
            return {
                ...prevFavourites,
                isDisplaying: nav === 'home' ? false : true,
                episodes: favouritesDB.favourites
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
            {(user.email && user.id) && <div>
                        <button onClick={() => navButtonHandler("home")}>Home</button>
                        <button onClick={() => navButtonHandler("favourites")}>Favourites</button>
                     </div>}
            <img className="header--img" src="../src/images/microphone.png" alt="Microphone Image" />
            <h1 className="header--heading">The Podcast App</h1>
            {(user.email && user.id) && <div>
                        <h6>{user.email}</h6>
                        <button onClick={signOutButtonHandler}>Sign out</button>
                    </div>}
        </div>
    )
}

