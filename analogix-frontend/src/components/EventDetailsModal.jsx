import { useState, useEffect } from "react";
import { getEventDetails, subscribeToEvent, unsubscribeFromEvent, getEventSubscriptions, acceptSubscription, refuseSubscription, getSubscribedEvents } from "../services/api"; 
import '../styles/EventDetailsModal.css';

const EventDetailsModal = ({ eventId, onClose }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscriptionsStatus, setSubscriptionsStatus] = useState(null);
    const [isCreator, setIsCreator] = useState(false);
    const [showSubscriptions, setShowSubscriptions] = useState(false);
    const [subscriptions, setSubscriptions] = useState([]);

    const isAuthenticated = !!localStorage.getItem('token');
    const currentUserId = Number(localStorage.getItem('userId'));

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                setLoading(true);
                const eventDetails = await getEventDetails(eventId);
                setEvent(eventDetails);

                if (isAuthenticated) {
                    
                    // Check if the current user is the creator of the event
                    if (eventDetails.creatorId === currentUserId) {
                        setIsCreator(true);
                    }
                    // Check if the current user is subscribed to the event and get their subscription status
                    const mySubscriptions = await getSubscribedEvents();
                    console.log('My Subscriptions:', mySubscriptions, 'eventId:', eventId, 'currentUserId:', currentUserId);
                    const userSubscription = mySubscriptions.find(p => Number(p.eventId) === eventId && Number(p.userId) === currentUserId);
                    if (userSubscription) {
                        setSubscriptionsStatus(userSubscription.status);
                    }else {
                        setSubscriptionsStatus(null);
                    }

                }
            } catch (err) {
                setError('Failed to load event details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        if (eventId) {
            fetchEventDetails();
        }
    }, [eventId, isAuthenticated, currentUserId]); // Re-fetch event details when eventId changes or when authentication status changes


    const handleSubscribe = async () => {
        if (!isAuthenticated) {
            alert('You need to be logged in to subscribe to an event.');
            return;
        }
        try {
            await subscribeToEvent(eventId);
            setSubscriptionsStatus('Pending');
            alert('Your subscription request has been sent. Please wait for the event creator to approve it.');
        } catch (err) {
            alert('Failed to subscribe to the event. Please try again later.'); 
        }
    };

    const handleUnsubscribe = async () => {
        try {
            await unsubscribeFromEvent(eventId);
            setSubscriptionsStatus(null);
            alert('You have unsubscribed from the event.');
        } catch (err) {
            alert('Failed to unsubscribe from the event. Please try again later.');
        }
    };


    const handleShowSubscriptions = async () => {
        try {
            const eventSubscriptions = await getEventSubscriptions(eventId);
            setSubscriptions(eventSubscriptions);
            setShowSubscriptions(true);
        } catch (err) {
            alert('Failed to load subscriptions. Please try again later.');
        }
    };

    const handleAcceptSubscription = async (subscriptionId) => {
        try{
            await acceptSubscription(subscriptionId);

            handleShowSubscriptions(); // Refresh the subscriptions list after accepting

        } catch (err) {
            alert('Failed to accept the subscription. Please try again later.');
        }
    };

    const handleRefuseSubscription = async (subscriptionId) => {
        try{
            await refuseSubscription(subscriptionId);

            handleShowSubscriptions(); // Refresh the subscriptions list after refusing

        } catch (err) {
            alert('Failed to refuse the subscription. Please try again later.');
        }
    };


    if (loading) {
        return (
            <div className="event-details-modal" onClick={onClose}>
                <div className="event-details-content" onClick={(e) => e.stopPropagation()}>
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    };

    if (error) {
        return (
            <div className="event-details-modal" onClick={onClose}>
                <div className="event-details-content" onClick={(e) => e.stopPropagation()}>
                    <p> {error} </p>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }

    if (!event) {
        return null;
    }

    const tags = Array.isArray(event.tags)
        ? event.tags
        : Array.isArray(event.gameTags)
            ? event.gameTags
            : [];
    const participants = Array.isArray(event.participants) ? event.participants : [];

    return (
        <div className="event-details-modal" onClick={onClose}>
            <div className="event-details-content" onClick={(e) => e.stopPropagation()}>
                <button className="event-details-modal-close-btn" onClick={onClose}>Close</button>
                <h2>{event.title}</h2>
                <p><strong>Description:</strong> {event.description}</p>
                <p><strong>Start Date:</strong> {new Date(event.startDate).toLocaleString()}</p>
                <p><strong>End Date:</strong> {new Date(event.endDate).toLocaleString()}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Places Taken:</strong> {event.participants.length} / {event.maxParticipants}</p>
                <p><strong>Participants:</strong> {participants.length > 0 ? participants.join(', ') : 'No participants yet.'}</p>
                <p><strong>Creator:</strong> {event.creator || event.creatorName || 'Unknown'}</p>
                <p><strong>Tags:</strong> {tags.length > 0 ? tags.join(', ') : 'No tags'}</p>

                <div className="event-details-modal-actions">
                    {!isAuthenticated &&(
                        <p>You need to be logged in to subscribe to this event.</p>
                    )}
                    {isAuthenticated && !isCreator && (
                         <>
                            {subscriptionsStatus === "Accepted" && (
                                <p>Your subscription status: {subscriptionsStatus} <button onClick={handleUnsubscribe}>Unsubscribe</button></p>
                            )}
                            {subscriptionsStatus === "Pending" && (
                                <p>Your subscription status: {subscriptionsStatus} <button onClick={handleUnsubscribe}>Unsubscribe</button></p>
                            )}
                            {!subscriptionsStatus && (
                                <button className="btn-subscribe" onClick={handleSubscribe}>Subscribe to Event</button>
                            )}
                        </>
                    )}
                    {isCreator && (
                        <>
                            <button> Manage Event</button>
                            <button onClick={handleShowSubscriptions}>See Subscriptions</button>
                        </>
                    )}
                </div>

                {showSubscriptions && (
                    <div className="subscriptions-list">
                        <h3>Event Subscriptions</h3>
                        {subscriptions.length > 0 ? (
                            <ul>
                                {subscriptions.map(sub => (
                                    <li key={sub.id}>
                                        <span>{sub.userName}</span>
                                        {sub.status === 'Pending' && (
                                            <div>
                                                <button className="btn-accept" onClick={() => handleAcceptSubscription(sub.id)}>Accept</button>
                                                <button className="btn-refuse" onClick={() => handleRefuseSubscription(sub.id)}>Refuse</button>
                                            </div>
                                        )}
                                        {sub.status !== 'Pending' &&(
                                            <span>{sub.status}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No subscriptions for this event yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetailsModal;
