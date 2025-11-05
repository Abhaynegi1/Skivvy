import React, { useEffect } from 'react'
import { runConnectionTests } from './utils/api'
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import Community from './pages/Community';
import People from './pages/People';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import PortfolioUpload from './pages/PortfolioUpload';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';

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
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route exact path ="/community" element={<Community/>}/>
        <Route path="/People" element={<People/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/signup" element={<Signup/>}/>
        <Route exact path='/Profile' element={<Profile/>}/>
        <Route exact path='/portfolio/upload' element={<PortfolioUpload/>}/>
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App
