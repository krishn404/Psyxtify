// Callback.js

import React, { useEffect } from 'react';
import queryString from 'query-string';
import { useNavigate } from 'react-router-dom';

const Callback = () => {

    const navigate = useNavigate();

  useEffect(() => {
    const { access_token } = queryString.parse(window.location.hash);

    console.log(access_token);
    if (access_token) {
        localStorage.setItem('spotifyAccessToken', access_token); // Store token securely
        console.log("Access token: ", access_token);
        navigate("/");
    }
  }, [navigate]);

  return (
    <h1>Hi</h1>
  )
};

export default Callback;
