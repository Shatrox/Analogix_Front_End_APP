import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import { getSubscribedEvents, unsubscribeFromEvent } from "../services/api";
import '../styles/MySubscriptions.css';

const MySubscriptions = () => {
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

    const handleUnsubscribe = async (eventId) => {
        try{
            await unsubscribeFromEvent(eventId);
            setSubscriptions(subscriptions.filter(event => event.id !== eventId));
            alert('You have successfully unsubscribed from the event.');

        }catch (err) {
            alert('Failed to unsubscribe from the event. Please try again later.');
        }
    };

    if (loading) {
        return (<div>Loading...</div>);
    }

    if (error) {
        return (<div>{error}</div>);
    }

    return (
        <div className="subscriptions-container">
            <Navbar page="my-subscriptions" />
            <h1>My Subscriptions</h1>
            <div className="subscriptions-section">
                {subscriptions.length > 0 ? (
                    <div className="subscriptions-list">
                        {subscriptions.map(event => (
                            <div key={event.id} className="subscription-card">
                                <h3>{event.title}</h3>
                                <p>Party Owner: {event.creatorName}</p>
                                <p>{event.description}</p>
                                <p>Start Date: {new Date(event.startDate).toLocaleDateString()}</p>
                                <p>End Date: {new Date(event.endDate).toLocaleDateString()}</p>
                                <p>Location: {event.location}</p>
                                <div className="subscription-actions">
                                    <button className="btn-details">View Details</button>
                                    <button className="btn-unsubscribe" onClick={() => handleUnsubscribe(event.id)}>Unsubscribe</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You are not subscribed to any events yet.</p>
                )}
            </div>
        </div>
    )
};

export default MySubscriptions;
