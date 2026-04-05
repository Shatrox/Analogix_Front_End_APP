import axios from 'axios';

// Allows for connection with the backend API, which is running on localhost:7249
const api = axios.create({
    baseURL: 'https://localhost:7249/api',
    headers: {
        'Content-Type': 'application/json',
    },
});



// Authentication Token Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// checks if the player profile exists for the logged-in user, if not, it will return false and the user will be redirected to the CreateProfile page
export const getPlayerProfile = async () => {
    try {
        const response = await api.get('/PlayerProfile/my-profile');
        return true; // Profile exists
    } catch (error) {
        if (error?.response?.status === 404) {
            return false; // Profile does not exist
        }
        throw error; 
    }
};

//displays the player profile details on the Profile page
export const getPlayerProfileDetails = async () => {
    const response = await api.get('/PlayerProfile/my-profile');
    return response.data; // Return profile details
};

// Updates the player profile with the provided data
export const updatePlayerProfile = async (profileData) => {
    const response = await api.put('/PlayerProfile/update/profile', profileData);
    return response.data; // Return updated profile details
};

export const getParticipatedEvents = async () => {
    const response = await api.get('/Event/my-participations');
    return response.data; // Return list of participated events
};

export const getAllEvents = async () => {
    const response = await api.get('/Event/all-events');
    return response.data; // Return list of all events
};

export const getMyEvents = async () => {
    const response = await api.get('/Event/my-events');
    return response.data; // Return list of events created by the user
}

export const getAllEventsNotOwned = async () => {
    const response = await api.get('/Event/all-events-not-owned');
    return response.data; // Return list of events not owned by the user
}

export const getSubscribedEvents = async () =>{
    const response = await api.get('/EventSubscription/my-subscriptions'); 
    return response.data; // Return list of subscribed events 
}

export const unsubscribeFromEvent = async (eventId) => {
    await api.post(`/EventSubscription/event/${eventId}/unsubscribe`);
}

export const createEvent = async (eventData) => {
    const response = await api.post('/Event/events/create', eventData);
    return response.data; // Return created event details
}

export const updateEvent = async (eventId, eventData) => {
    const response = await api.put(`/Event/events/update/${eventId}`, eventData);
    return response.data; // Return updated event details
}

export const getEventDetails = async (eventId) => {
    const response = await api.get(`/Event/events/${eventId}`);
    return response.data; // Return event details
}

export const subscribeToEvent = async (eventId) => {
    await api.post(`/EventSubscription/event/${eventId}/subscribe`);
}

export const getEventSubscriptions = async (eventId) => {
    const response = await api.get(`/EventSubscription/event/${eventId}/subscriptions`);
    return response.data; // Return list of subscriptions for the event
}

export const acceptSubscription = async (subscriptionId) => {
    await api.patch(`/EventSubscription/subscription/${subscriptionId}/accept`);
}

export const refuseSubscription = async (subscriptionId) => {
    await api.patch(`/EventSubscription/subscription/${subscriptionId}/refuse`);
}

// Get all EventFQAs for a specific event
export const getEventFQAs = async (eventId) => {
    const response = await api.get(`/EventFaq`, { params: { eventId } });
    return response.data; // Return list of FQAs for the event
}

// Ask a question for a specific event
export const askEventFQA = async (eventId, question) => {
    const response = await api.post(`/EventFaq/questions`, { question }, { params: { eventId } });
    return response.data; // Return the created FQA
}

// Answer a question for a specific event
export const answerEventFQA = async (eventId, questionId, answer) => {
    const response = await api.post(`/EventFaq/questions/${questionId}/answer`, { answer }, {params: { eventId, questionId }});
    return response.data; // Return the created answer
}

// Delete a question for a specific event
export const deleteEventFQAQuestion = async (eventId, questionId) => {
    await api.delete(`/EventFaq/questions/${questionId}/delete/question`, { params: { eventId } });
}

// Delete an answer for a specific event
export const deleteEventFQAAnswer = async (eventId, questionId) => {
    await api.delete(`/EventFaq/questions/${questionId}/delete/answer`, { params: { eventId } });
}

// Rate a player
export const ratePlayer = async(ratingData) => {
    const response = await api.post('/Rating/rate', ratingData);
    return response.data; // Return the created rating
}

// Get my ratings for a specific event
export const getMyRatingsForEvent = async (eventId) => {
    const response = await api.get(`/Rating/events/${eventId}/my-ratings`);
    return response.data;
}

// Get average rating for a specific player
export const getUserRatingSummary = async (userId) => {
    const response = await api.get(`/Rating/players/${userId}/rating-summary`);
    return response.data; // Return the rating summary
}

export default api;