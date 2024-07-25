import './css/Global.css'
import "@fontsource/inter";
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginButton from './components/LoginToSpotify.jsx';
import Callback from './components/Callback.jsx';
import { GeneratePage } from './pages/Generate.jsx';

function App() {
  return (
    <Routes>
        <Route path="/" element={<GeneratePage></GeneratePage>}></Route>
        <Route path="/callback" element={<Callback></Callback>}></Route>
    </Routes>
  )
}

export default App
