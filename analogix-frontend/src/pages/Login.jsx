import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import api, { getPlayerProfile } from '../services/api';
import '../styles/Auth.css';
import Navbar from '../components/NavBar';

const parseUserIdFromToken = (token) => {
    if (!token || typeof token !== 'string') return null;

    const parts = token.split('.');
    if (parts.length < 2) return null;

    try {
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
        const payload = JSON.parse(atob(paddedBase64));

        const candidates = [
            payload?.userId,
            payload?.sub,
            payload?.nameid,
            payload?.id,
            payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        ];

        for (const value of candidates) {
            if (value !== undefined && value !== null && String(value).trim() !== '') {
                return String(value).trim();
            }
        }
    } catch {
        return null;
    }

    return null;
};

const resolveUserId = (loginResponse) => {
    const directCandidates = [
        loginResponse?.userId,
        loginResponse?.id,
        loginResponse?.user?.id,
    ];

    for (const value of directCandidates) {
        if (value !== undefined && value !== null && String(value).trim() !== '') {
            return String(value).trim();
        }
    }

    return parseUserIdFromToken(loginResponse?.token);
};


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {

            const response = await api.post('/Authentication/Login', { email, password });
            const token = response?.data?.token;
            if (!token) {
                throw new Error('Login response did not include a token');
            }

            localStorage.setItem('token', token);

            const userId = resolveUserId(response.data);
            if (userId) {
                localStorage.setItem('userId', userId);
            } else {
                localStorage.removeItem('userId');
            }
            
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