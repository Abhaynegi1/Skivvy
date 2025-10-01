import React, { useEffect } from 'react'
import { runConnectionTests } from './utils/api'
import Landing from './pages/Landing'
import Teach from './pages/Teach';
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
        <Route exact path="/home" element={<Landing/>}></Route>
        <Route exact path="/teach" element={<Teach/>}></Route>
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App
