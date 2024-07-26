import ReactGA from 'react-ga4';

const initializeAnalytics = () => {
  ReactGA.initialize([
    { trackingId: 'G-FS096WNPD0' }, 
    { trackingId: 'G-6B8JCQ2V4G' } 
  ]);
};

export default initializeAnalytics;
