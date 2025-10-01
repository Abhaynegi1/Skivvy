import React, { useEffect } from 'react'
import { runConnectionTests } from './utils/api'
import Landing from './pages/Landing'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Aboutus from './assets/Aboutus';
import Header from './components/Header';

function App() {
  useEffect(() => {
    // Run connection tests on component mount
    runConnectionTests()
  }, [])

  return (
    <Router>
      <Landing/>
      <Routes>
        <Route exact path="/about" element={<Aboutus/>}/>
      </Routes>
    </Router>
  )
}

export default App
