import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {

    const navigate = useNavigate();

    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('Logged out successfully!');
        navigate('/login');
    }




    return (
        <nav className="navbar">
            <div className="navbar-title">
                <Link to="/">Analogix</Link>
            </div>
            <ul className="navbar-links-style"> 
                {isAuthenticated ? (
                <>
                <li><Link to="/profilepage">Profile</Link></li>
                <li><Link to="/my-events">My Events</Link></li>
                <li><Link to="/my-subscriptions">My Subscriptions</Link></li>
                <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                </>
                ) : (
                <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/about">About Us</Link></li>
                </>
            )}
            </ul>
        </nav>
    )
}

export default Navbar;