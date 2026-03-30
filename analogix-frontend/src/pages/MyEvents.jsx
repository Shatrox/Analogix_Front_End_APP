import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import { getParticipatedEvents } from "../services/api";
import '../styles/MyEvents.css';


const MyEvents = () => {
    const [events, setEvents] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const myEvents = await getParticipatedEvents();
                setEvents(myEvents);
            } catch (err) {
                setError('Failed to load your events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (<div>Loading...</div>);
    }

    if (error) {
        return (<div>{error}</div>);
    }

    return (
        
            
            <div className="my-events-container">
                <Navbar page="my-events" />
                <h1>My Events</h1>
                <div className="events-section">
                    <h2>All Events</h2>
                    {events.length > 0 ? (
                        <div className="events-list">
                            {events.map(event => (
                                <div key={event.id} className="event-card">
                                    <h3>{event.title}</h3>
                                    <p>Party Owner: {event.creatorName}</p>
                                    <p>{event.description}</p>
                                    <p>Start Date: {new Date(event.startDate).toLocaleDateString()}</p>
                                    <p>End Date: {new Date(event.endDate).toLocaleDateString()}</p>
                                    <p>Location: {event.location}</p>
                                    <p>Max Participants: {event.maxParticipants}</p>
                                    <p>Participants: {event.participants?.length > 0 ? event.participants.join(', ') : 'No participants yet.'}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>You are not participating in any events yet.</p>
                    )}

                </div>

            </div>
            
            
        
    );
};

export default MyEvents;