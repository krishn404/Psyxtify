import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import queryString from 'query-string';
import { getUserProfile } from './SpotifyAPI';

const spotifyApi = new SpotifyWebApi();

const clientID = import.meta.env.VITE_SPOTIFY_CLIENT_ID; // Update with VITE_ prefix
const redirectUri = 'http://localhost:3000/callback'; // Replace with your redirect URI

const SpotifyLoginButton = () => {
  useEffect(() => {
    console.log("Spotify Client ID:", clientID); // Verify the client ID
  }, []);

  const handleLogin = () => {
    const scope = 'user-read-private user-read-email user-top-read'; // Add necessary scopes here

    const authUrl = `https://accounts.spotify.com/authorize?${queryString.stringify({
      client_id: clientID,
      response_type: 'token',
      redirect_uri: redirectUri,
      scope: scope,
    })}`;

    window.location.href = authUrl;
  };

  const accessToken = localStorage.getItem('spotifyAccessToken');
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (accessToken) {
      getUserProfile(accessToken)
        .then(({ userName, profileImage }) => {
          setUserName(userName);
        })
        .catch(error => console.error('Error fetching user profile:', error));
    }
  }, [accessToken]);

  return (
    <button className="btn btn-outline btn-info" onClick={handleLogin}>
      {userName ? `Signed in as ${userName}` : "Log in with Spotify" }
    </button>
  );
};

export default SpotifyLoginButton;
