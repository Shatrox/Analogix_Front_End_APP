import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPlayerProfileDetails, getAllEventsNotOwned, getSubscribedEvents } from "../services/api";
import Navbar from "../components/NavBar";
import '../styles/Dashboard.css';
import CreateEvent from './CreateEvent';
import MyEvents from './MyEvents';
import ProfilePage from "./ProfilePage";
import MySubscriptions from "./MySubscriptions";
import EventDetailsModal from "../components/EventDetailsModal";

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState(null);
    const [events, setEvents] = useState([]);
    const [subscribedEvents, setSubscribedEvents] = useState([]);
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [showMyEvents, setShowMyEvents] = useState(false);
    const [showProfilePage, setShowProfilePage] = useState(false);
    const [showMySubscriptions, setShowMySubscriptions] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const getMasteryMeta = (masteryLevel) => {
        const byNumber = {
            1: { className: "mastery-meeple-newbie", label: "Meeple Newbie -  \"Just discovered that cardboard and dice can take over your entire evening.\"" },
            2: { className: "mastery-dice-goblin", label: "Dice Goblin - \"Owns “just a few games”… which somehow fill two shelves.\"" },
            3: { className: "mastery-rulebook-wizard", label: "Rulebook Wizard - \"Explains complex games in 3 minutes and says “it’s actually simple.”\"" },
            4: { className: "mastery-archduke-of-meeples", label: "Archduke Of Meeples - \"Hosts legendary game nights and has opinions about optimal starting strategies.\"" },
        };

        if (masteryLevel === null || masteryLevel === undefined || masteryLevel === "") {
            return { className: "mastery-default", label: "Not set" };
        }

        const numericLevel = Number(masteryLevel);
        if (Number.isFinite(numericLevel) && byNumber[numericLevel]) {
            return byNumber[numericLevel];
        }

        const normalized = String(masteryLevel).toLowerCase().replace(/[^a-z0-9]/g, "");
        const byName = {
            meeplenewbie: byNumber[1],
            dicegoblin: byNumber[2],
            rulebookwizard: byNumber[3],
            archdukeofmeeples: byNumber[4],
        };

        return byName[normalized] || { className: "mastery-default", label: String(masteryLevel) };
    };

    const handleOpenEventDetails = (eventId) => {
        setSelectedEventId(eventId);
        setShowEventDetailsModal(true);
    };

    const handleCloseEventDetails = () => {
        setShowEventDetailsModal(false);
        setSelectedEventId(null);
    };

    const filteredEvents = events.filter(event => {
        const searchTermLower = searchTerm.toLowerCase();
        const eventTitle = event.title?.toLowerCase() || '';
        const eventLocation = event.location?.toLowerCase() || '';
        const eventGames = event.gameTags?.join(' ').toLowerCase() || '';

        return (
            (profile && event.creatorId !== profile.id) &&
            (eventTitle.includes(searchTermLower) ||
            eventLocation.includes(searchTermLower) ||
            eventGames.includes(searchTermLower))
        );
    });

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [details, allEventsNotOwned, subscribedEvents] = await Promise.all([
                    getPlayerProfileDetails(),
                    getAllEventsNotOwned(),
                    getSubscribedEvents(),
                ]);
                setProfile(details);
                setEvents(allEventsNotOwned);
                setSubscribedEvents(subscribedEvents);
            } catch (err) {
                if (err?.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
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

    const masteryMeta = getMasteryMeta(profile?.masteryLevel);

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
                        <button className="dashboard-profile-btn" onClick={() => setShowProfilePage(true)}>Open Profile</button>
                    </article>

                    <article className="dashboard-panel">
                        <h3>Favorite Games</h3>
                        <p>{profile?.favoriteGames || 'No favorite games yet.'}</p>
                    </article>

                    <article className={`dashboard-panel mastery-panel ${masteryMeta.className}`}>
                        <h3>Mastery Level</h3>
                        <p>{masteryMeta.label}</p>
                    </article>

                    <article className="dashboard-panel">
                        <h3>Quick Actions</h3>
                        <div className="dashboard-actions">
                            <button className="dashboard-profile-btn" onClick={() => setShowProfilePage(true)}>View Profile</button>
                            <button className="dashboard-my-events-btn" onClick={() => setShowMyEvents(true)}>My Events</button>
                            <button className="dashboard-subscriptions-btn" onClick={() => setShowMySubscriptions(true)}>My Subscriptions</button>    
                            <button className="dashboard-create-event-btn" onClick={() => setShowCreateEvent(true)}>Create Event</button>
                        </div>
                    </article>
                </section>
                    
                <section className="event-section-style">
                    <div className="title-style">
                        <h2>Events Available</h2>
                    </div>
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Search events by game, title, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                <div className="events-display-style">
                         {loading && <p>Loading events...</p>}
                    {error && <p>{error}</p>}
                    {filteredEvents.map(event => (
                        <div key={event.id} className="event-card">
                            <h3>{event.title}</h3>
                            <p className="name-line">
                                <span className="name-label"><strong>Date:</strong></span>
                                <span className="name-value"> {new Date(event.startDate).toLocaleDateString()}</span>
                            </p>
                            <p className="name-line">
                                <span className="name-label"><strong>Party Owner:</strong></span>
                                <span className="name-value"> {event.creatorName}</span>
                            </p>
                            <p className="name-line">
                                <span className="name-label"><strong>Location:</strong></span>
                                <span className="name-value"> {event.location}</span>
                            </p>
                            
                            <button className="btn-details" onClick={() => handleOpenEventDetails(event.id)}>View Details</button>
                        </div>
                    ))}

                </div>
                </section>
            </main>
            
            {showProfilePage && (
                <div
                    className="profile-modal-overlay"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowProfilePage(false); }}
                >
                    <ProfilePage onClose={() => setShowProfilePage(false)} />
                </div>
            )}

            {showMyEvents && (
                <div
                    className="my-events-modal-overlay"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowMyEvents(false); }}
                >
                    <MyEvents onClose={() => setShowMyEvents(false)} />
                </div>
            )}

            {showCreateEvent && (
                <div
                    className="event-modal-overlay"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowCreateEvent(false); }}
                >
                    <CreateEvent onClose={() => setShowCreateEvent(false)} />
                </div>
            )}

            {showMySubscriptions && (
                <div
                    className="my-subscriptions-modal-overlay"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowMySubscriptions(false); }}
                >
                    <MySubscriptions onClose={() => setShowMySubscriptions(false)} />
                </div>
            )}

            {showEventDetailsModal && selectedEventId && (
                <EventDetailsModal
                    eventId={selectedEventId}
                    onClose={handleCloseEventDetails}
                />
            )}
        </div>
    );
}

export default Dashboard;