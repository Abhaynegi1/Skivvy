import React, { useEffect } from 'react'
import { runConnectionTests } from './utils/api'
import Landing from './pages/Landing'
import Explore from './pages/Explore'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    // Run connection tests on component mount
    runConnectionTests()
  }, [])

  return (
    <Router>
      <Header/>
      <Routes>
        <Route exact path="/" element={<Landing/>}/>
        <Route exact path="/home" element={<Landing/>}/>
        <Route exact path="/learn" element={<Explore/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/signup" element={<Signup/>}/>
        <Route exact path='/Profile' element={<Profile/>}/>
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App
