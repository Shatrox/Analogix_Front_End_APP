import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Navbar from './components/NavBar';
import CreateProfile from './pages/CreateProfile';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard';
import MyEvents from './pages/MyEvents';
import MySubscriptions from './pages/MySubscriptions';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<HomePage/>} />
        <Route path="/login" element = {<Login />} />
        <Route path="/register" element = {<Register />} />
        <Route path="/createprofile" element={<CreateProfile />} />
        <Route path='/profilepage' element={<ProfilePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/my-subscriptions" element={<MySubscriptions />} />
      </Routes>
    </BrowserRouter>
      
  )
}

export default App;
