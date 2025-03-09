import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Questions from './components/Quizpage'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import QuizPage from './components/Quizpage'
import MedicineRecommendation from './components/MedicineRecommendation'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
      
      <Router>
        <Navbar />
        <Routes>
            <Route path='/' element = {<Home />} />
            <Route path='/quiz-page' element = {<QuizPage />} />
            <Route path='/medicine-recommendation' element = {<MedicineRecommendation />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
