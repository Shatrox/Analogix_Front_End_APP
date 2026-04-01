import { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import { getSubscribedEvents, unsubscribeFromEvent } from "../services/api";
import '../styles/MySubscriptions.css';


const MySubscriptions = ({onClose}) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const events = await getSubscribedEvents();
                setSubscriptions(events);
            }catch (err) {
                setError('Failed to load your subscriptions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    const handleUnsubscribe = async (eventId, subscriptionId) => {
        try{
            await unsubscribeFromEvent(eventId);
            setSubscriptions(subscriptions.filter(sub => sub.id !== subscriptionId));
            alert('You have successfully unsubscribed from the event.');

        }catch (err) {
            alert('Failed to unsubscribe from the event. Please try again later.');
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
                            <div key={event.id} className="subscription-card">
                                <h3>{event.eventTitle}</h3>
                                <p>Party Owner: {event.creatorName}</p>
                                <p>Status: {event.status}</p>
                                <p>Date of creation: {new Date(event.createdAt).toLocaleDateString()}</p>
                                <p>Date of response: {new Date(event.responseAt).toLocaleDateString()}</p>
                                <p>Location: {event.eventLocation}</p>
                                <div className="subscription-actions">
                                    <button className="btn-details">View Details</button>
                                    <button className="btn-unsubscribe" onClick={() => handleUnsubscribe(event.eventId)}>Unsubscribe</button>
                                </div>
                            </div>
                        ))}    
                    </div>
                ) : (
                    <p>You are not subscribed to any events yet.</p>
                )}
            </div>
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
