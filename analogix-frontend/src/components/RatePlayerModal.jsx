import { useState, useEffect } from 'react';
import { getEventSubscriptions, ratePlayer, getMyRatingsForEvent } from '../services/api';
import '../styles/RatePlayerModal.css';

// Create the StarRating component
const StarRating = ({ score, onRate}) => {
    const [hoveredStar, setHoveredStar] = useState(0);

    return (

        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`star ${star <= (hoveredStar || score) ? 'star-filled' : ''}`}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => onRate(star)}
                >
                    ★
                </span>
            ))}
            
        </div>
    );
};

// Create the RatePlayerModal component
const RatePlayerModal = ({ eventId, creatorId, creatorName, currentUserId, onClose}) =>{
    const [participants, setParticipants] = useState([]);
    const [ratings, setRatings] = useState({}); // Store ratings for each participant
    const [submittedRatings, setSubmittedRatings] = useState({}); // Track submitted ratings
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParticipants = async () => {
            try{
                const subscriptions = await getEventSubscriptions(eventId);
                const accepted = (subscriptions || [])
                    .filter(sub => String(sub.status.trim().toLowerCase()) === 'accepted')
                    .map(sub => ({
                        userId: sub.userId,
                        name: sub.userName
                    })); 
            
                // Includes the creator in the rating list
                if(creatorId){
                    const creatorAlreadyInList = accepted.some(p => Number(p.userId) === Number(creatorId));
                    if(!creatorAlreadyInList){
                        accepted.unshift({ userId: creatorId, name: creatorName });
                    }
                }

                // Exclude the current user from the rating list(can't rate themselves)
                const filtered = accepted.filter (p => Number(p.userId) !== Number(currentUserId));
                setParticipants(filtered);

                // Fetch existing ratings for the current user to pre-fill the stars
                const myRatings = await getMyRatingsForEvent(eventId);
                const alreadyRated = {};
                (myRatings || []).forEach(r => {
                    if (r.targetUserId) {
                        alreadyRated[r.targetUserId] = r.score;
            }
});
setSubmittedRatings(alreadyRated);

            }catch (err){
                setError('Failed to load participants. Please try again later.');
            }finally {
                setLoading(false);
            }
            
        };
        fetchParticipants();
    }, [eventId, creatorId, creatorName, currentUserId]); // Re-fetch if eventId or creatorId changes

    // Handlers for rating changes and submission
    const handleRate = (userId, score) => {
        setRatings(prev => ({ ...prev, [userId]: score })); 
    }

    const handleSubmitRate = async (userId) => {
        const score = ratings[userId];
        if(!score){
            alert('Please select a rating before submitting.');
            return;
        }
        try{
            await ratePlayer({
                eventId: Number(eventId),
                targetUserId: Number(userId),
                targetType: 'Player',
                score: score
            });
            setSubmittedRatings(prev => ({ ...prev, [userId]: score }));
        }catch (err){
            alert('Failed to submit rating. Please try again later.');
        }
    }

    return (
        <div>
            <div>
                
                <h2>Rate Players</h2>
                {loading && <p>Loading participants...</p>}
                {error && <p className='rate-error'>{error}</p>}

                {!loading && !error && participants.length === 0 && ( <p>No participants to rate.</p>)}

                <div className='rate-players-list'>
                    {participants.map (p =>
                        <div key={p.userId} className='rate-player-item'>
                            <span className='rate-player-name'>{p.name}</span>
                            {submittedRatings[p.userId] ? (
                                <span className='rate-submitted'>Rated: {submittedRatings[p.userId]} ★</span>
                            ) : (
                                <div>
                                    <StarRating
                                        score = {ratings[p.userId] || 0}
                                        onRate = {(score) => handleRate(p.userId, score)}
                                    />
                                    <button className= 'btn-submit-rating' onClick={() => handleSubmitRate(p.userId)}>Submit</button>
                                </div>
                            )}

                            
                        </div>
                    )}

                </div>







            </div>
        </div>
    )

}

export default RatePlayerModal;
