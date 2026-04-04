import { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import { getSubscribedEvents, subscribeToEvent, unsubscribeFromEvent } from "../services/api";
import EventDetailsModal from "../components/EventDetailsModal";
import '../styles/MySubscriptions.css';


const MySubscriptions = ({onClose}) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isUnsubscribedStatus = (status) => {
        const normalizedStatus = String(status || '').trim().toLowerCase();
        return normalizedStatus === 'deleted' || normalizedStatus === 'unsubscribed';
    };

    const normalizeSubscriptions = (items) => {
        const normalized = (items || []).map((sub) => ({
            ...sub,
            isUnsubscribed: Boolean(sub.isUnsubscribed) || isUnsubscribedStatus(sub.status),
        }));

        const active = normalized.filter((sub) => !sub.isUnsubscribed);
        const unsubscribed = normalized.filter((sub) => sub.isUnsubscribed);
        return [...active, ...unsubscribed];
    };

     const handleOpenEventDetails = (eventId) => {
        setSelectedEventId(eventId);
        setShowEventDetailsModal(true);
    };

    const handleCloseEventDetails = () => {
        setShowEventDetailsModal(false);
        setSelectedEventId(null);
    };

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const events = await getSubscribedEvents();
                setSubscriptions(normalizeSubscriptions(events));
            }catch (err) {
                setError('Failed to load your subscriptions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    const handleUnsubscribe = async (eventId) => {
        try{
            await unsubscribeFromEvent(eventId);

            setSubscriptions((prev) => {
                const updated = prev.map((sub) => {
                    const subEventId = sub.eventId ?? sub.id;
                    if (String(subEventId) === String(eventId)) {
                        return { ...sub, isUnsubscribed: true, status: 'Deleted' };
                    }
                    return sub;
                });

                return normalizeSubscriptions(updated);
            });

            alert('You have successfully unsubscribed from the event.');

        }catch (err) {
            alert('Failed to unsubscribe from the event. Please try again later.');
        }
        
    };

    const handleSubscribeAgain = async (eventId) => {
        try {
            await subscribeToEvent(eventId);

            setSubscriptions((prev) => {
                const updated = prev.map((sub) => {
                    const subEventId = sub.eventId ?? sub.id;
                    if (String(subEventId) === String(eventId)) {
                        return { ...sub, isUnsubscribed: false, status: 'Pending' };
                    }
                    return sub;
                });

                return normalizeSubscriptions(updated);
            });

            alert('Subscription request sent again. Waiting for approval.');
        } catch (err) {
            alert('Failed to subscribe to the event. Please try again later.');
        }
    };

    const content = (
        <div className={onClose ? "subscriptions-panel" : "subscriptions-content"}>
            <div className="subscriptions-header">
                <div>
                    <h1>My Subscriptions</h1>
                    <h2>All Subscriptions</h2>
                </div>
                {onClose && (
                    <button type="button" className="subscriptions-close" onClick={onClose}>
                        Close
                    </button>
                )}
            </div>  
            {loading && <p className="subscriptions-message">Loading...</p>}
            {error && <p className="subscriptions-message">{error}</p>}
            {!loading && !error && (
                <div className="subscriptions-section">
                    {subscriptions.length > 0 ? (
                        <div className="subscriptions-list">
                         {subscriptions.map(event => (
                            <div key={event.id} className={`subscription-card ${event.isUnsubscribed ? 'unsubscribed' : ''}`}>
                                <h3>{event.eventTitle}</h3>
                                <p className="name-line">
                                    <span className="name-label">Party Owner:</span>
                                    <span className="name-value">{event.creatorName}</span>
                                </p>
                                <p className="name-line">
                                    <span className="name-label">Status:</span>
                                    <span className="name-value">{event.status}</span>
                                </p>
                                <p className="name-line">
                                    <span className="name-label">Date of subscription:</span>
                                    <span className="name-value">{new Date(event.createdAt).toLocaleDateString()}</span>
                                </p>
                                <p className="name-line">
                                    <span className="name-label">Date of response:</span>
                                    <span className="name-value">{new Date(event.responseAt).toLocaleDateString()}</span>
                                </p>
                                <p className="name-line">
                                    <span className="name-label">Location:</span>
                                    <span className="name-value">{event.eventLocation}</span>
                                </p>
                                {event.isUnsubscribed && (
                                    <p className="unsubscribe-note">You have unsubscribed this event</p>
                                )}
                                <div className="subscription-actions">
                                    <button className="btn-details" onClick={() => handleOpenEventDetails(event.eventId ?? event.id)}>View Details</button>
                                    {event.isUnsubscribed ? (
                                        <button
                                            className="btn-subscribe"
                                            onClick={() => handleSubscribeAgain(event.eventId ?? event.id)}
                                        >
                                            Subscribe
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-unsubscribe"
                                            onClick={() => handleUnsubscribe(event.eventId ?? event.id)}
                                        >
                                            Unsubscribe
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}    
                    </div>
                ) : (
                    <p>You are not subscribed to any events yet.</p>
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
    )

    if (onClose) {
        return content;
    }

    return (
        <div className="my-subscriptions-container">
            <Navbar page="my-subscriptions" />
            {content}
        </div>
    );    

   
};

export default MySubscriptions;
