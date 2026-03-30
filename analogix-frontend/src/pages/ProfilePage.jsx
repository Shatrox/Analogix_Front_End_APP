import {  useEffect, useState } from "react";
import { getPlayerProfileDetails, updatePlayerProfile } from "../services/api";
import { useNavigate } from "react-router-dom";
import '../styles/ProfilePage.css';
import Navbar from "../components/NavBar";

const ProfilePage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        biography: '',
        favoriteGames: '',
        masteryLevel: '',
        favoriteGameTags: '',
    });

    useEffect(() => {
        const displayProfileDetails = async () => {
            try {
                const profileDetails = await getPlayerProfileDetails();

                const normalizeFavoriteTagsForInput = (value) => {
                    if (Array.isArray(value)) {
                        return value
                            .map((item) => {
                                if (typeof item === "string") return item;
                                if (item && typeof item === "object") {
                                    return item.name || item.tag || item.value || "";
                                }
                                return "";
                            })
                            .filter(Boolean)
                            .join(", ");
                    }

                    if (typeof value === "string") return value;
                    return "";
                };
                
                
                setFormData({
                    biography: profileDetails?.biography || '',
                    favoriteGames: profileDetails?.favoriteGames || '',
                    masteryLevel: profileDetails?.masteryLevel || '',
                    favoriteGameTags: normalizeFavoriteTagsForInput(profileDetails?.favoriteGameTags || ''),
                });
            } catch (error) {
                if (error?.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                if (error?.response?.status === 404) {
                    navigate('/createprofile');
                    return;
                }

                setError('Failed to load profile details. Please try again later');
            } finally {
                setLoading(false);
            }   
        };

        displayProfileDetails();
    }, [navigate]);

    // Handles input updates for the profile form, updating the formData state with the new values
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value }));
    };
    
    const handleEdit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsEditing(true);
    };

    const handleCancel = (e) => {
        e.preventDefault();
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

    // Handles the save action
    const handleSave = async (e) => {
        e.preventDefault();

        if (!isEditing) return;

        setSaving(true);
        setError('');
        setSuccess('');
    

        try {
            const tags = formData.favoriteGameTags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);
            
        
            await updatePlayerProfile({
                biography: formData.biography.trim() || null,
                favoriteGames: formData.favoriteGames,
                masteryLevel: Number(formData.masteryLevel),
                favoriteGameTags: tags,
            });

            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            if (error?.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            setError('Failed to update profile. Please try again later');
        } finally {
            setSaving(false);
        }
    
    };

    if (loading) {
        return(
            <div className="profile-container">
                <div className="profile-form">
                    <h2>Loading profile...</h2>
                </div>
            </div>
        );
}

return (

    <>
    <Navbar page="profilepage" />
    <div className="profile-container">
        
        <form className="profile-form" onSubmit={isEditing ? handleSave : (e) => e.preventDefault()}>
            <h2>My Profile</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <label>Biography:</label>
            <textarea
                name="biography"
                rows={8}
                value={formData.biography}
                onChange={handleInputChange}
                disabled={!isEditing}
                />

            <label>Favorite Games:</label>
            <input
                type= "text"
                name="favoriteGames"
                value={formData.favoriteGames}
                onChange={handleInputChange}
                disabled={!isEditing}
                />

            <label>Mastery Level</label>
            <input
                type= "number"
                name="masteryLevel"
                value={formData.masteryLevel}
                onChange={handleInputChange}
                disabled={!isEditing}
                />

            <label>Favorite Game Tags:</label>
            <input
                type= "text"
                name="favoriteGameTags"
                value={formData.favoriteGameTags}
                onChange={handleInputChange}
                disabled={!isEditing}
                />

            <div className="profile-actions">
                {/* If not in editing mode, show the Edit button. If in editing mode, show Save and Cancel buttons */}
                {!isEditing ? (
                    <button type="button" onClick={handleEdit}>Edit Profile</button>
                ) : (
                    <>
                    <button type="submit" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button
                        type="button"
                        className="secondary"
                        onClick={handleCancel}
                        disabled={saving}
                        >
                        Cancel
                    </button>   
                    </>
                )}

            </div>
        </form>



    </div>

    </>
);
};

export default ProfilePage;