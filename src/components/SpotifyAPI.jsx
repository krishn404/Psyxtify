// spotifyService.js

import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();


export const setAccessToken = (accessToken) => {
  spotifyApi.setAccessToken(accessToken);
};

export const getUserProfile = async (accessToken) => {
    try {
      spotifyApi.setAccessToken(accessToken);
      const userData = await spotifyApi.getMe();
      return {
        userName: userData.display_name,
        profileImage: userData.images.length > 0 ? userData.images[0].url : null,
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  export const getTopTracks = async (accessToken, limit, timeRange) => {
    try {
      spotifyApi.setAccessToken(accessToken);
      const response = await spotifyApi.getMyTopTracks({ time_range: timeRange, limit });
      
      // Extracting only relevant track data
      const tracks = response.items.map(track => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map(artist => artist.name),
        duration_ms: track.duration_ms,
        album: {
          name: track.album.name,
          images: track.album.images,
        },
      }));
  
      return tracks;
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      throw error;
    }
  };

  export const getTopArtists = async (accessToken, limit, timeRange) => {
    try {
      spotifyApi.setAccessToken(accessToken);
      const response = await spotifyApi.getMyTopArtists({ time_range: timeRange, limit });
      return response.items;
      
    } catch (error) {
      console.error('Error fetching top artists:', error);
    }
  };
  
  export const getTopGenres = async (timeRange) => {
    try {
      const response = await spotifyApi.getMyTopArtists({ time_range: timeRange });
      const genres = response.items.flatMap(artist => artist.genres);
      console.log('Top Genres:', genres);
      return [...new Set(genres)]; // Remove duplicates
    } catch (error) {
      console.error('Error fetching top genres:', error);
    }
  };
  