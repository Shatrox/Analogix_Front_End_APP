import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Navbar from './components/NavBar'


function App() {

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element = {<HomePage/>} />
        <Route path="/login" element = {<Login />} />
        <Route path="/register" element = {<Register />} />
      </Routes>
    </BrowserRouter>
      
  )
}

export default App;
