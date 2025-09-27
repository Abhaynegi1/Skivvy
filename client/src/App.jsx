import React, { useEffect } from 'react'
import { runConnectionTests } from './utils/api'

function App() {
  useEffect(() => {
    // Run connection tests on component mount
    runConnectionTests()
  }, [])

  return (
    <div>
      <h1>Hello</h1>
    </div>
  )
}

export default App
