import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import api, { getPlayerProfile } from '../services/api';
import '../styles/Auth.css';
import Navbar from '../components/NavBar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {

            const response = await api.post('/Authentication/Login', { email, password });

            localStorage.setItem('token', response.data.token);
            
            const profileExists = await getPlayerProfile();

            if (!profileExists) {
                alert('Login successful!');
                navigate('/createprofile');
            } else {
                alert('Login successful!');
                navigate('/dashboard');
            }
        }catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <>
        <Navbar/>
        <div className="auth-container">
            
            <form className="auth-form" onSubmit={handleLogin}>
                <h2>Enter Analogix World</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                <input
                    type = "password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                <button type="submit">Login</button>
                <p>Not part of this World yet? <Link to="/register">Register here</Link></p>
            </form>
        </div>
        </>
    );
};

export default Login;