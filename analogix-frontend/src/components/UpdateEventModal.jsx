import { useEffect, useState } from "react";
import { updateEvent } from "../services/api";
import "../styles/CreateEvent.css";

const formatDateForInput = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toIsoString = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const UpdateEventModal = ({ event, onClose, onUpdated }) => {
    const [eventTitle, setEventTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [gameTags, setGameTags] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!event) return;

        setEventTitle(event.title || "");
        setDescription(event.description || "");
        setStartDate(formatDateForInput(event.startDate));
        setEndDate(formatDateForInput(event.endDate));
        setEventLocation(event.location || "");
        setMaxParticipants(event.maxParticipants ?? "");
        const tags = Array.isArray(event.gameTags)
            ? event.gameTags
            : Array.isArray(event.tags)
                ? event.tags
                : [];
        setGameTags(tags.join(", "));
    }, [event]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!event?.id) return;

        setSaving(true);

        try {
            const tags = gameTags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);

            const updatedEvent = await updateEvent(event.id, {
                title: eventTitle,
                description: description.trim() || null,
                startDate: toIsoString(startDate),
                endDate: toIsoString(endDate),
                location: eventLocation,
                maxParticipants: Number(maxParticipants),
                gameTags: tags,
            });

            if (onUpdated) {
                onUpdated(updatedEvent);
            }

            onClose();
        } catch (error) {
            const apiErrors = error?.response?.data?.errors;
            const firstError = apiErrors
                ? Object.values(apiErrors).flat().find(Boolean)
                : null;
            const message = firstError || error?.response?.data?.title || "Failed to update event. Please try again later.";
            alert(message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="event-details-modal" onClick={onClose}>
            <form className="create-event-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                <h2>Update Event</h2>
                <input
                    placeholder="Title"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <input
                    placeholder="Location"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                />
                <input
                    placeholder="Max Participants"
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                />
                <input
                    placeholder="Game Tags (comma separated)"
                    value={gameTags}
                    onChange={(e) => setGameTags(e.target.value)}
                />
                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" className="create-event-cancel" onClick={onClose} disabled={saving}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default UpdateEventModal;