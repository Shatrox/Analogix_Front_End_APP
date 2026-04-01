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

export default api;