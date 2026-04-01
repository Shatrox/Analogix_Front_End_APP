import { useEffect, useState } from "react";
import {
    acceptSubscription,
    getEventSubscriptions,
    refuseSubscription,
} from "../services/api";
import "../styles/EventDetailsModal.css";

const SeeSubscriptionsModal = ({ eventId, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [subscriptions, setSubscriptions] = useState([]);

    const loadSubscriptions = async () => {
        try {
            setLoading(true);
            setError("");
            const eventSubscriptions = await getEventSubscriptions(eventId);
            setSubscriptions(Array.isArray(eventSubscriptions) ? eventSubscriptions : []);
        } catch (err) {
            setError("Failed to load subscriptions. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (eventId) {
            loadSubscriptions();
        }
    }, [eventId]);

    const handleAcceptSubscription = async (subscriptionId) => {
        try {
            await acceptSubscription(subscriptionId);
            await loadSubscriptions();
        } catch (err) {
            alert("Failed to accept the subscription. Please try again later.");
        }
    };

    const handleRefuseSubscription = async (subscriptionId) => {
        try {
            await refuseSubscription(subscriptionId);
            await loadSubscriptions();
        } catch (err) {
            alert("Failed to refuse the subscription. Please try again later.");
        }
    };

    return (
        <div className="event-details-modal" onClick={onClose}>
            <div className="event-details-content" onClick={(e) => e.stopPropagation()}>
                <button className="event-details-modal-close-btn" onClick={onClose}>
                    Close
                </button>
                <h3>Event Subscriptions</h3>

                {loading && <p>Loading subscriptions...</p>}
                {error && <p>{error}</p>}

                {!loading && !error && (
                    <div className="subscriptions-list">
                        {subscriptions.length > 0 ? (
                            <ul>
                                {subscriptions.map((sub) => (
                                    <li key={sub.id}>
                                        {sub.status === "Pending" ? (
                                            <div>
                                                <span>{sub.userName || sub.playerName || "Unknown player"}</span>
                                                <button
                                                    className="btn-accept"
                                                    onClick={() => handleAcceptSubscription(sub.id)}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className="btn-refuse"
                                                    onClick={() => handleRefuseSubscription(sub.id)}
                                                >
                                                    Refuse
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <span>{sub.userName || sub.playerName || "Unknown player"}</span>
                                                <span>{sub.status}</span>
                                            </>
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

export default SeeSubscriptionsModal;
