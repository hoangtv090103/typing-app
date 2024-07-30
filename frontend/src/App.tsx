import { useEffect, useState } from 'react'

import './App.css'
import axios from 'axios'
function App() {
  const [sampleText, setSampleTesxt] = useState('Hello World')
  
  useEffect(() => {
    const getSampleText = async () => {
      const res = await axios.get('/api/v1/texts',
        {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTIxNzU3MmM2ZjRkN2ZlNmIwMTU1NiIsImlhdCI6MTcyMjMyNDQ5NSwiZXhwIjoxNzIyNDEwODk1fQ.N9SPOrLZY6T2kavXwhJ3-13sBJvVQtle2Lo0OMKZvrI"
          }})
      const text = res.data.text;
      setSampleTesxt(text)
    }

    getSampleText()
  }, []);

  return (
    <>
    <div>
    <h1> Typing Practice </h1>
        <p>{ sampleText }</p>
    </div>
    </>
  )
}

export default App
