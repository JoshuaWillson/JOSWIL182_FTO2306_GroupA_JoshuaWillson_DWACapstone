import React from "react";

export default function Header(props) {
    const {setFavourites, supabase, user, setPlayingPodcast, playingPodcast} = props

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
        if(playingPodcast.isDisplaying) {
            playingPodcast.audio.pause()
            setPlayingPodcast(prevPlayingPodcast => {
                return {
                    ...prevPlayingPodcast,
                    isDisplaying: false,
                    isPlaying: false,
                    title: ''
                }
            })
        }
    }

    return (
        <div className="header--container">
            {(user.email && user.id) && <div className="header--home--favourites"> 
                        <button className="header--home" onClick={() => navButtonHandler("home")}>Home</button>
                        <button className="header--favs" onClick={() => navButtonHandler("favourites")}>Favourites</button>
                     </div>}
            <div className="header--img--heading">
                <img className="header--img" src="/microphone.png" alt="Microphone Image" />
                <h1 className="header--heading">The Podcast App</h1>
            </div>
            {(user.email && user.id) && <div className="header--email--signout">
                        <h6 className="header--email">{user.email}</h6>
                        <button className="header--signout" onClick={signOutButtonHandler}>Sign out</button>
                    </div>}
        </div>
    )
}

