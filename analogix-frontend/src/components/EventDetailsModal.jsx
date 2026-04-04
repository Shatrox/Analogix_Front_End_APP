import { useState, useEffect } from "react";
import { getEventDetails, subscribeToEvent, getEventSubscriptions, acceptSubscription, refuseSubscription, getSubscribedEvents } from "../services/api"; 
import '../styles/EventDetailsModal.css';
import UpdateEventModal from "./UpdateEventModal";
import EventFaqModal from "./EventFaqModal";


const EventDetailsModal = ({ eventId, onClose }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscriptionsStatus, setSubscriptionsStatus] = useState(null);
    const [showSubscriptions, setShowSubscriptions] = useState(false);
    const [subscriptions, setSubscriptions] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showFaq, setShowFaq] = useState(false);

    const isAuthenticated = !!localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');

   

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                setLoading(true);
                const eventDetails = await getEventDetails(eventId);
                setEvent(eventDetails);
                setSubscriptionsStatus(null);

                if (isAuthenticated) {
                    const mySubscriptions = await getSubscribedEvents();
                    const userSubscription = (mySubscriptions || []).find(
                        (subscription) => Number(subscription.eventId) === Number(eventId)
                    );
                    if (userSubscription) {
                        setSubscriptionsStatus(userSubscription.status);
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

    const handleEventUpdated = (updatedEvent) => {
        setEvent(updatedEvent);
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
    const eventCreatorId = event.creatorId ?? event.creator?.id;
    const normalizedCurrentUserId = currentUserId ? String(currentUserId).trim() : '';
    const normalizedEventCreatorId = eventCreatorId !== undefined && eventCreatorId !== null
        ? String(eventCreatorId).trim()
        : '';
    const currentUserIdAsNumber = Number(normalizedCurrentUserId);
    const eventCreatorIdAsNumber = Number(normalizedEventCreatorId);
    const sameNumericId = Number.isFinite(currentUserIdAsNumber) && Number.isFinite(eventCreatorIdAsNumber)
        ? currentUserIdAsNumber === eventCreatorIdAsNumber
        : false;
    const sameStringId = normalizedCurrentUserId !== '' && normalizedEventCreatorId !== ''
        ? normalizedCurrentUserId.toLowerCase() === normalizedEventCreatorId.toLowerCase()
        : false;
    const isCreator = isAuthenticated && (sameNumericId || sameStringId);

    const isAcceptedSubscriber = subscriptionsStatus && String(subscriptionsStatus).trim().toLowerCase() === 'accepted';
    const canSeeFaq = isCreator || isAcceptedSubscriber;

    return (
        <div className="event-details-modal" onClick={onClose}>
            <div className="event-details-content" onClick={(e) => e.stopPropagation()}>
                <button className="event-details-modal-close-btn" onClick={onClose}>Close</button>
                <h2>{event.title}</h2>
                <p className="name-line">
                    <span className="name-label">Description:</span>
                    <span className="name-value">{event.description}</span>
                </p>
                <p className="name-line">
                    <span className="name-label">Start Date:</span>
                    <span className="name-value">{new Date(event.startDate).toLocaleString()}</span>
                </p>
                <p className="name-line">
                    <span className="name-label">End Date:</span>
                    <span className="name-value">{new Date(event.endDate).toLocaleString()}</span>
                </p>
                <p className="name-line">
                    <span className="name-label">Location:</span>
                    <span className="name-value">{event.location}</span>
                </p>
                <p className="name-line">
                    <span className="name-label">Max Participants:</span>
                    <span className="name-value">{participants.length} / {event.maxParticipants}</span>
                </p>
                <p className="name-line">
                    <span className="name-label">Participants:</span>
                    <span className="name-value">{event.participants?.length > 0 ? event.participants.join(', ') : 'No participants yet.'}</span>
                </p>
                <p className="name-line">
                    <span className="name-label">Creator:</span>
                    <span className="name-value">{event.creator || event.creatorName || 'Unknown'}</span>
                </p>
                <p className="name-line">
                    <span className="name-label">Tags:</span>
                    <span className="name-value">{tags.length > 0 ? tags.join(', ') : 'No tags'}</span>
                </p>

                <div className="event-details-modal-actions">
                    
                    {isAuthenticated && (
                    <>
                    {isCreator ? (
                    <>
                        <button className="btn-manage-event" onClick={() => setShowUpdateModal(true)}>Manage Event</button>
                        <button className="btn-see-subscriptions" onClick={() => showSubscriptions ? setShowSubscriptions(false) : handleShowSubscriptions()}>
                            {showSubscriptions ? 'Hide Subscriptions' : 'See Subscriptions'}
                        </button>
                    </>
                    ) : (
                    <>
                    {subscriptionsStatus ? (
                        <p>Your subscription status: {subscriptionsStatus}</p>
                    ) : (
                        <button className="btn-subscribe" onClick={handleSubscribe}>
                            Subscribe to Event
                        </button>
                )}
            </>
        )}
    </>
)}
                </div>

                {showSubscriptions && (
                    <div className="subscriptions-list">
                        <h3>Event Subscriptions</h3>
                        {subscriptions.length > 0 ? (
                            <ul>
                                {subscriptions.map(sub => {
                                    const normalizedStatus = String(sub.status || '').trim().toLowerCase();
                                    const displayName = sub.userName || sub.playerName || 'Unknown player';

                                    return (
                                        <li key={sub.id}>
                                            {normalizedStatus === 'pending' ? (
                                                <div>
                                                    <span>{displayName}</span>
                                                    <button className="btn-accept" onClick={() => handleAcceptSubscription(sub.id)}>Accept</button>
                                                    <button className="btn-refuse" onClick={() => handleRefuseSubscription(sub.id)}>Refuse</button>
                                                </div>
                                            ) : normalizedStatus === 'accepted' ? (
                                                <div>
                                                    <span>{displayName} - Subscription Accepted</span>
                                                    <button className="btn-refuse" onClick={() => handleRefuseSubscription(sub.id)}>Refuse</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span>{displayName}</span>
                                                    <span>{sub.status}</span>
                                                </>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p>No subscriptions for this event yet.</p>
                        )}
                    </div>
                )}

                {showUpdateModal && (
                    <UpdateEventModal
                        event={event}
                        onClose={() => setShowUpdateModal(false)}
                        onUpdated={handleEventUpdated}
                    />
                )}

                {canSeeFaq && (
                    <>
                        <button className="btn-show-faq" onClick={() => setShowFaq((prev) => !prev)}>
                            {showFaq ? "Hide Q&A" : "Show Q&A"}
                        </button>

                        {showFaq && (
                            <EventFaqModal 
                                eventId={eventId} 
                                isCreator={isCreator}
                                currentUserId={currentUserId} 
                            />
                        )}
                    </>
                )}      
            </div>
        </div>
    );
};

export default EventDetailsModal;
