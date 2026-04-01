import { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import { getMyEvents } from "../services/api";
import '../styles/MyEvents.css';
import SeeSubscriptionsModal from "../components/SeeSubscriptionsModal";


const MyEvents = ({onClose}) => {
    const [events, setEvents] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);
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

    const handleOpenSubscriptions = (eventId) => {
        setSelectedEventId(eventId);
        setShowSubscriptionsModal(true);
    };

    const handleCloseSubscriptions = () => {
        setShowSubscriptionsModal(false);
        setSelectedEventId(null);
    };

    const content = (
        // If onClose is provided, we are in a modal context and should not render the Navbar
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
                                    <p>Party Owner: {event.creatorName}</p>
                                    <p>{event.description}</p>
                                    <p>Start Date: {new Date(event.startDate).toLocaleDateString()}</p>
                                    <p>End Date: {new Date(event.endDate).toLocaleDateString()}</p>
                                    <p>Location: {event.location}</p>
                                    <p>Max Participants: {event.maxParticipants}</p>
                                    <p>Participants: {event.participants?.length > 0 ? event.participants.join(', ') : 'No participants yet.'}</p>
                                    <button
                                        type="button"
                                        className="btn-details"
                                        onClick={() => handleOpenSubscriptions(event.id)}
                                    >
                                        See Subscriptions
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="my-events-message">You have not created any events yet.</p>
                    )}
                </div>
            )}

            {showSubscriptionsModal && selectedEventId && (
                <SeeSubscriptionsModal
                    eventId={selectedEventId}
                    onClose={handleCloseSubscriptions}
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