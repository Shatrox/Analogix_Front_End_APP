import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ page }) => {

    const navigate = useNavigate();

    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('Logged out successfully!');
        navigate('/');
    }

    const renderLinks = () => {
        if (isAuthenticated) {
            if (page === 'dashboard' || page === 'profilepage' || page === 'my-events' || page === 'my-subscriptions') {
                return (
                    <>
                    <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                    </>
                )
            } 
            return (
                <>
                <li><Link to="/profilepage">Profile</Link></li>
                <li><Link to="/my-events">My Events</Link></li>
                <li><Link to="/my-subscriptions">My Subscriptions</Link></li>
                <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                </>
            );
        };
        return (
            <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/about">About Us</Link></li>
            </>
        );

    };



    return (
        <nav className="navbar">
            <div className="navbar-title">
                <Link to={isAuthenticated ? "/dashboard" : "/"}>Analogix</Link>
            </div>
            <ul className="navbar-links-style"> 
              {renderLinks()}            
            </ul>
        </nav>
    );
};

export default Navbar;