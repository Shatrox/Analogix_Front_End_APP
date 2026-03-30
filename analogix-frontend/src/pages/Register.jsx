import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import '../styles/Auth.css';
import Navbar from "../components/NavBar";

const Register =() => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/Authentication/Register', { username, email, password });
            alert('Analogix World is now open to you! Please login to continue.');
            navigate('/login');
        }catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please check your details and try again.');
        }
    };

    return (
        <>
        <Navbar/>
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleRegister}>
                <h2>Join Analogix World</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />

                <button type="submit">Register</button>
                <p>Already part of this World? <Link to="/login">Login here</Link></p>
            </form>
        </div>
        </>
    );

};  

 export default Register;