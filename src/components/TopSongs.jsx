import { getUserProfile, getTopTracks, getTopArtists, getTopGenres, setAccessToken } from "../components/SpotifyAPI";
import { useState, useEffect, useRef } from "react";

import { toPng } from 'html-to-image';
import { createGradientWavy } from "../../helpers/ColorGradient";
import ColorThief from 'colorthief';

import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'


function TopSongs() {
    const [userName, setUserName] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    const [topTracks, setTopTracks] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [topGenres, setTopGenres] = useState([]);
    const [selectedOption, setSelectedOption] = useState('tracks');

    const [timeRange, setTimeRange] = useState('short_term'); // default to last month

    const [simpleModeEnabled, enableSimpleMode] = useState(false);
    const handleSimpleModeChange = () => {
      enableSimpleMode(!simpleModeEnabled);
    }

    const [showAlbumInstead, setShowAlbum] = useState(false);
    const handleShowAlbum = () => {
      setShowAlbum(!showAlbumInstead);
    }

    const [limit, setLimit] = useState(10); // Default limit
    const handleLimitChange = (event) => {
      setLimit(parseInt(event.target.value, 10));
    };

    const [backgroundGradient, setBackgroundGradient] = useState('');

    const containerRef = useRef(null); // Ref for the container

    useEffect(() => {
      const accessToken = localStorage.getItem('spotifyAccessToken');
      if (accessToken) {
        setAccessToken(accessToken);
        fetchData(accessToken, selectedOption, timeRange);
      }
    }, [selectedOption, limit]);

    useEffect(() => {
      if (selectedOption === 'tracks' && topTracks.length > 0) {
        extractColorsFromImage(topTracks[0].album.images[0].url);
      } else if (selectedOption === 'artists' && topArtists.length > 0) {
        extractColorsFromImage(topArtists[0].images[0]?.url);
      }
    }, [topTracks, topArtists]);

      const fetchData = async (accessToken, option, timeRange) => {
        try {
          if (option === 'tracks') {
            const tracks = await getTopTracks(accessToken, limit, timeRange);
            setTopTracks(tracks);
            setTopArtists([]);
            setTopGenres([]);
          } else if (option === 'artists') {
            const artists = await getTopArtists(accessToken, limit, timeRange);
            setTopArtists(artists);
            setTopTracks([]);
            setTopGenres([]);
          } else if (option === 'genres') {
            const genres = await getTopGenres(timeRange);
            setTopGenres(genres);
            setTopTracks([]);
            setTopArtists([]);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    const handleTimeRangeChange = (range) => {
      const accessToken = localStorage.getItem('spotifyAccessToken');

      setTimeRange(range);
      fetchData(accessToken, selectedOption, range); // Re-fetch data with the new range
    };

    const formatDuration = (ms) => {
      const minutes = Math.floor(ms / 60000);
      const seconds = ((ms % 60000) / 1000).toFixed(0);
      return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
    };

    const extractColorsFromImage = (imageUrl) => {
      if (!imageUrl) return;
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;
      img.onload = () => {
        const colorThief = new ColorThief();
        const colors = colorThief.getPalette(img, 5);
        setBackgroundGradient(createGradientWavy(colors));
      };
    };

    const exportImage = () => {
      if (containerRef.current) {
        toPng(containerRef.current, {backgroundColor: '#0D0D0D'})
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = 'top-tracks-artists.png';
            link.href = dataUrl;
            link.click();
          })
          .catch((error) => {
            console.error('Error exporting image:', error);
          });
      }
    };
  
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
            <div className="flex justify-center h-full content-center flex-col lg:flex-row lg:p-8 pb-12"  >
              <div className="flex flex-col gap-3 p-8">
                <h1 className="text-3xl">Customize your chart</h1>
                  <select className="select w-full max-w-xs"           
                    defaultValue={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  >
                    <option value="tracks">Top Songs</option>
                    <option value="artists">Top Artists</option>
                    <option value="genres">Top Genres</option>
                  </select>

                  <div class="form-control w-full">
                      <label class="label cursor-pointer">
                      <span class="label-text">Simple Mode</span>
                      <input type="checkbox" class="toggle toggle-secondary" checked={simpleModeEnabled} onChange={handleSimpleModeChange} disabled={selectedOption === 'genres'}/>
                      </label>
                  </div>

                  <div class="form-control w-full">
                      <label class="label cursor-pointer">
                      <span class="label-text">Display album instead of artist</span>
                      <input type="checkbox" class="toggle toggle-secondary" checked={showAlbumInstead} onChange={handleShowAlbum}/>
                      </label>
                  </div>
                  <div className="divider">Time Period</div>
                  <button className="btn btn-outline btn-neutral" onClick={() => handleTimeRangeChange('short_term')} >Last Month</button>
                  <button className="btn btn-outline btn-neutral" onClick={() => handleTimeRangeChange('medium_term')}>Last 6 Months</button>
                  <button className="btn btn-outline btn-neutral" onClick={() => handleTimeRangeChange('long_term')}>All Time</button>
                  <div className="divider"></div>
                  <label htmlFor="limit" className="block mb-2">Number of {selectedOption === 'tracks' ? 'Tracks' : 'Artists'} {limit}</label>
                          <input 
                            type="range" 
                            id="limit" 
                            name="limit" 
                            min="1" 
                            max="50" 
                            value={limit} 
                            onChange={handleLimitChange} 
                            className="w-full mb-4 range"
                          />

                  <button className="btn btn-outline btn-neutral" onClick={exportImage}>Export Image</button>
                  
                  
              </div>

{ userName && 
<div className="max-w-screen-lg w-full rounded-lg p-4" style={{ backgroundImage: backgroundGradient }} ref={containerRef}>
  <div className="py-4 lg:p-4">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">
        {timeRange === 'short_term' && 'LAST MONTH'} 
        {timeRange === 'medium_term' && 'LAST SIX MONTHS'} 
        {timeRange === 'long_term' && 'ALL TIME'}
      </h1>
      <span className="text-sm text-right">stats by psyxtify</span>
    </div>
    <h1 className="text-2xl">
      <span className="text-secondary">{userName}'s</span> Top 
      {selectedOption === 'tracks' && ' songs'}
      {selectedOption === 'artists' && ' artists'}
      {selectedOption === 'genres' && ' genres'}
    </h1>  
  </div>

  { !simpleModeEnabled && 
    <div className="grid grid-cols-1 gap-1 lg:gap-4 lg:p-4 lg:grid-cols-2">
      {selectedOption === 'tracks' && topTracks.map((track, index) => (
        <div key={track.id} className="relative lg:h-full shadow-md lg:rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <div
            className="bg-cover bg-center w-full h-32"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.8995973389355743) 0%, rgba(0,0,0,0) 100%), url(${track.album.images[0].url})`
            }}
          />
          <div className="text-white text-sm px-4 py-2 absolute bottom-0 w-full flex flex-row gap-4">
            <span className="text-4xl font-bold">{index + 1}</span>
            <div className="flex flex-col">
              <span className="text-2xl">{track.name}</span>
              <span className="text-neutral-400">
                {!showAlbumInstead && track.artists.join(', ')}
                {showAlbumInstead && track.album.name}
              </span>
            </div>
            <span className="text-xs text-neutral-400 absolute bottom-2 right-2">{formatDuration(track.duration_ms)}</span>
          </div>
        </div>
      ))}

      {selectedOption === 'artists' && topArtists.map((artist, index) => (
        <div key={artist.id} className="relative bg-opacity-70 shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <div
            className="bg-cover bg-center w-full h-32 rounded-lg"
            style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.8995973389355743) 0%, rgba(0,0,0,0) 100%), url(${artist.images[0]?.url || ''})` }}
          />
          <div className="text-white text-sm px-4 py-2 rounded-lg absolute bottom-0 w-full flex flex-row gap-4">
            <span className="text-4xl font-bold">{index + 1}</span>
            <div className="flex flex-col">
              <span className="text-2xl">{artist.name}</span> 
              <span className="text-neutral-400">{artist.followers.total.toLocaleString()} followers</span>
            </div>
          </div>
        </div>
      ))}

      {selectedOption === 'genres' && 
        <table className="min-w-full p-8">
          <thead>
            <tr>
              <th className="py-2">#</th>
              <th className="py-2 text-left">TITLE</th>
              {selectedOption === 'tracks' && <th className="py-2 text-left">AMT</th>}
              {selectedOption === 'artists' && <th className="py-2 text-left">Artist Genre</th>}
            </tr>
          </thead>
          <tbody> 
            {topGenres.map((genre, index) => (
              <tr key={index}>
                <td className="py-2 pr-4 text-center font-bold">{index + 1}</td>
                <td className="py-2"><span className="text-xl"><strong>{genre}</strong></span></td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  }

  { simpleModeEnabled &&
    <table className="min-w-full p-8">
      <thead>
        <tr>
          <th className="py-2">#</th>
          <th className="py-2 text-left">TITLE</th>
          {selectedOption === 'tracks' && <th className="py-2 text-left">AMT</th>}
          {selectedOption === 'artists' && <th className="py-2 text-left">Artist Genre</th>}
        </tr>
      </thead>
      <tbody>
        {selectedOption === 'tracks' && topTracks.map((track, index) => (
          <tr key={track.id}>
            <td className="py-2 pr-4 text-center font-bold">{index + 1}</td>
            <td className="py-2"><span className="text-xl"><strong>{track.name}</strong></span><br/>
              {!showAlbumInstead && track.artists.join(', ')}
              {showAlbumInstead && track.album.name}
            </td>
            <td className="py-2">{formatDuration(track.duration_ms)}</td>
          </tr>
        ))}
        {selectedOption === 'artists' && topArtists.map((artist, index) => (
          <tr key={artist.id}>
            <td className="py-2 pr-4 text-center font-bold">{index + 1}</td>
            <td className="py-2"><span className="text-xl"><strong>{artist.name}</strong></span><br/>
              {artist.followers.total.toLocaleString()} monthly listeners
            </td>
            <td className="py-2 w-20 lg:w-fit">{artist.genres.join(', ')}</td>
          </tr>
        ))}
        {selectedOption === 'genres' && topGenres.map((genre, index) => (
          <tr key={index}>
            <td className="py-2 pr-4 text-center font-bold">{index + 1}</td>
            <td className="py-2"><span className="text-xl"><strong>{genre}</strong></span></td>
          </tr>
        ))}
      </tbody>
    </table>
  }
</div>
}

          </div>
          );
}

export default TopSongs