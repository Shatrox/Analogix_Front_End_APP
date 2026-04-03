import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import { getAllEvents } from "../services/api";
import EventDetailsModal from "../components/EventDetailsModal";
import '../styles/HomePage.css';

const HomePage = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const allEvents = await getAllEvents();
                
                setEvents(allEvents);
            } catch (err) {
                setError('Failed to load events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    const handleOpenEventDetails = (eventId) => {
        setSelectedEventId(eventId);
        setShowEventDetailsModal(true);
    };

    const handleCloseEventDetails = () => {
        setShowEventDetailsModal(false);
        setSelectedEventId(null);
    };

    return(
        
        <div className="home-container">
            <Navbar />

            <header className="home-header">
                <button 
                    className="title-button"
                    onClick={toggleDescription}
                    style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>
                    <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span>
                        Welcome To Analogix
                        </span>
                        <span style={{ 
                        display: 'inline-block', 
                        marginLeft: '10px',
                        transition: 'transform 0.3s ease',
                        animation: 'bounce 1s infinite',
                    }}>
                        ▼
                        </span>    
                    </h1>
                </button>

                {isExpanded && (
                    <>
                        <p>You came to the place where you can find people playing your favorite analogical games all around the world! </p>  
                        <p>Here you can create your own events or subscribe to existing events close to your location, whether it be your or someone elses place, a park, a coffee shop or even in a beach close to you!</p>
                        <p>Our goal is to allow you to easily find partners to play while promoting a more inperson World</p>
                        <p>Here Games Turn Into New Friendships</p>
                    </>
                )}
            </header>

            <main className="event-section-style">
                <div className="title-style">
                    <h2>Events Available</h2>
                </div>

                <div className="events-display-style">
                         {loading && <p>Loading events...</p>}
                    {error && <p>{error}</p>}
                    {events.map(event => (
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

            </main>

            {showEventDetailsModal && selectedEventId && (
                <EventDetailsModal
                    eventId={selectedEventId}
                    onClose={handleCloseEventDetails}
                />
            )}
        </div>
    )
}

export default HomePage;