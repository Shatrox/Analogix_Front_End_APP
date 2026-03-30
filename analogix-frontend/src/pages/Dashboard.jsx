import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPlayerProfileDetails } from "../services/api";
import Navbar from "../components/NavBar";
import '../styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const details = await getPlayerProfileDetails();
                setProfile(details);
            } catch (err) {
                if (err?.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                if (err?.response?.status === 404) {
                    navigate('/createprofile');
                    return;
                }

                setError('Failed to load dashboard. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [navigate]);

    if (loading) {
        return (
            <div className="dashboard-container">
                <Navbar />
                <main className="dashboard-content">
                    <section className="dashboard-panel">
                        <h2>Loading dashboard...</h2>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Navbar page="dashboard"/>
            <main className="dashboard-content">
                <section className="dashboard-hero">
                    <h1>Welcome Back</h1>
                    <p>Your central place for profile and event actions.</p>
                </section>

                {error && <p className="dashboard-error">{error}</p>}

                <section className="dashboard-grid">
                    <article className="dashboard-panel">
                        <h3>Profile Summary</h3>
                        <p>{profile?.biography || 'No biography added yet.'}</p>
                        <Link to="/profilepage">Open Profile</Link>
                    </article>

                    <article className="dashboard-panel">
                        <h3>Favorite Games</h3>
                        <p>{profile?.favoriteGames || 'No favorite games yet.'}</p>
                    </article>

                    <article className="dashboard-panel">
                        <h3>Mastery Level</h3>
                        <p>{profile?.masteryLevel ?? 'Not set'}</p>
                    </article>

                    <article className="dashboard-panel">
                        <h3>Quick Actions</h3>
                        <div className="dashboard-actions">
                            <Link to="/profilepage">Edit Profile</Link>
                            <Link to="/my-events">My Events</Link>
                            <Link to="/my-subscriptions">My Subscriptions</Link>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;