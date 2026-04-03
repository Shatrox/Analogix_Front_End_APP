import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/api";
import Navbar from "../components/NavBar";
import '../styles/CreateEvent.css';

const CreateEvent = ({ onClose }) => {
    const [eventTitle, setEventTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [gameTags, setGameTags] = useState("");
    const navigate = useNavigate();

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        const tags = gameTags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
        try {
            await createEvent({
                title: eventTitle,
                description: description.trim() || null,
                startDate,
                endDate,
                location: eventLocation,
                maxParticipants: Number(maxParticipants),
                gameTags: tags,
            });
            alert("Event created successfully!");
            if (onClose) {
                onClose();
            } else {
                navigate("/events");
            }
        } catch (error) {
            console.error("Event creation failed:", error);
            alert("Event creation failed. Please try again.");
        }
    };


    const form = (
        <form className="create-event-form" onSubmit={handleCreateEvent}>
            <h2>Create Your Event</h2>
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
                placeholder="Start Date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <input
                placeholder="End Date"
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
            <button type="submit">Create Event</button>
            {onClose && (
                <button type="button" className="create-event-cancel" onClick={onClose}>
                    Cancel
                </button>
            )}
        </form>
    );

    if (onClose) return form;

    return (
        <div className="create-event-container">
            <Navbar page="create-event" />
            {form}
        </div>
    );

};
export default CreateEvent;