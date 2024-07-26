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
    console.log("Tracking page view for:", location.pathname + location.search);  // Add this line
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<GeneratePage />}></Route>
      <Route path="/callback" element={<Callback />}></Route>
    </Routes>
  );
};

export default App;
