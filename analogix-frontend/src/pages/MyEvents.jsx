import { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import { getMyEvents } from "../services/api";
import '../styles/MyEvents.css';
import EventDetailsModal from "../components/EventDetailsModal";


const MyEvents = ({onClose}) => {
    const [events, setEvents] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const myEvents = await getMyEvents();
                setEvents(myEvents);
            } catch (err) {
                setError('Failed to load your events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleOpenEventDetails = (eventId) => {
        setSelectedEventId(eventId);
        setShowEventDetailsModal(true);
    };

    const handleCloseEventDetails = () => {
        setShowEventDetailsModal(false);
        setSelectedEventId(null);
    };

    const content = (
        <div className={onClose ? "my-events-panel" : "my-events-content"}>
            <div className="my-events-header">
                <div>
                    <h1>My Events</h1>
                    <h2>All Events</h2>
                </div>
                {onClose && (
                    <button type="button" className="my-events-close" onClick={onClose}>
                        Close
                    </button>
                )}
            </div>

            {loading && <p className="my-events-message">Loading...</p>}
            {error && <p className="my-events-message">{error}</p>}
            {!loading && !error && (
                <div className="events-section">
                    {events.length > 0 ? (
                        <div className="events-list">
                            {events.map(event => (
                                <div key={event.id} className="event-card">
                                    <h3>{event.title}</h3>
                                   
                                    <p className="name-line">
                                        <span className="name-label">Description:</span>{' '}
                                        <span className="name-value">{event.description}</span>
                                    </p>
                                    <p className="name-line">
                                        <span className="name-label">Start Date:</span>{' '}
                                        <span className="name-value">{new Date(event.startDate).toLocaleDateString()}</span>
                                    </p>
                                    <p className="name-line">
                                        <span className="name-label">End Date:</span>{' '}
                                        <span className="name-value">{new Date(event.endDate).toLocaleDateString()}</span>
                                    </p>
                                    <p className="name-line">
                                        <span className="name-label">Location:</span>{' '}
                                        <span className="name-value">{event.location}</span>
                                    </p>
                                    <p className="name-line">
                                        <span className="name-label">Max Participants:</span>{' '}
                                        <span className="name-value">{event.maxParticipants}</span>
                                    </p>
                                    <p className="name-line">
                                        <span className="name-label">Participants:</span>{' '}
                                        <span className="name-value">{event.participants?.length > 0 ? event.participants.join(', ') : 'No participants yet.'}</span>
                                    </p>
                                    <button
                                        type="button"
                                        className="btn-details"
                                        onClick={() => handleOpenEventDetails(event.id)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="my-events-message">You have not created any events yet.</p>
                    )}
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

    if (onClose) {
        return content;
    }

    return (
        <div className="my-events-container">
            <Navbar page="my-events" />
            {content}
        </div>
    );
};

export default MyEvents;