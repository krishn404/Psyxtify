import './css/Global.css';
import "@fontsource/inter";
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import LoginButton from './components/LoginToSpotify.jsx';
import Callback from './components/Callback.jsx';
import { GeneratePage } from './pages/Generate.jsx';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const page = location.pathname + location.search;
    console.log("Tracking page view for:", page);  // Log the page being tracked

    // Send pageview to both tracking IDs
    ReactGA.send({ hitType: 'pageview', page, trackerNames: ['tracker1'] });
    ReactGA.send({ hitType: 'pageview', page, trackerNames: ['tracker2'] });
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<GeneratePage />}></Route>
      <Route path="/callback" element={<Callback />}></Route>
    </Routes>
  );
};

export default App;
