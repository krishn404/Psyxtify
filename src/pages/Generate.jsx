/*eslint no-unused-vars: "error"*/
import SpotifyLoginButton from "../components/LoginToSpotify";
import { useEffect, useState } from "react";
import { getUserProfile } from "../components/SpotifyAPI";
import TopSongs from "../components/TopSongs";

export function GeneratePage() {

    const [userName, setUserName] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
  
    useEffect(() => {
      const accessToken = localStorage.getItem('spotifyAccessToken');
      if (accessToken) {
        getUserProfile(accessToken)
          .then(({ userName, profileImage }) => {
            setUserName(userName);
            setProfileImage(profileImage);
          })
          .catch(error => console.error('Error fetching user profile:', error));
      }
    }, []);

    return (
        <div className="drawer">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
            <div className="navbar w-full p-4 shadow-2xl z-10">
                <div className="flex-none lg:hidden">
                <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-6 w-6 stroke-current">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </label>
                </div>
                <div className="mx-2 flex-1 px-2 text-4xl font-bold">psyxtify</div>
                <div className="hidden flex-none lg:block">
                <ul className="menu menu-horizontal items-center gap-4">
                    {/* Navbar menu content here */}
                    <li><a>Home</a></li>
                    <li><a>Generate</a></li>
                    <li><SpotifyLoginButton></SpotifyLoginButton></li>
                </ul>
                </div>
            </div>
 
                <TopSongs></TopSongs>

            </div>
            <div className="drawer-side z-20">
            <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 min-h-full w-80 p-4">
                {/* Sidebar content here */}
                <li><a href="#home">Sidebar Item 1</a></li>
                <li><a href="#generate">Sidebar Item 2</a></li>
            </ul>
            </div>
        </div>
    )
}