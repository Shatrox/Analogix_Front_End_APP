import {  useEffect, useState } from "react";
import { getPlayerProfileDetails, updatePlayerProfile } from "../services/api";
import { useNavigate } from "react-router-dom";
import '../styles/ProfilePage.css';
import Navbar from "../components/NavBar";

const ProfilePage = ({ onClose }) => {
    const navigate = useNavigate();

    const masteryLevelOptions = [
        { value: '1', label: 'Level 1 - Meeple Newbie' },
        { value: '2', label: 'Level 2 - Dice Goblin' },
        { value: '3', label: 'Level 3 - Rulebook Wizard' },
        { value: '4', label: 'Level 4 - Archduke Of Meeples' },
    ];

    const masteryAliases = {
        meeplenewbie: '1',
        dicegoblin: '2',
        rulebookwizard: '3',
        archdukeofmeeples: '4',
    };

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

    const normalizeMasteryLevelValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return '';
        }

        const numericValue = Number(value);
        if (Number.isFinite(numericValue) && numericValue >= 1 && numericValue <= 4) {
            return String(numericValue);
        }

        const normalizedText = String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
        if (masteryAliases[normalizedText]) {
            return masteryAliases[normalizedText];
        }

        return '';
    };

    const getMasteryLevelLabel = (level) => {
        const normalized = normalizeMasteryLevelValue(level);
        const found = masteryLevelOptions.find((option) => option.value === normalized);
        if (found) return found.label;

        const rawText = String(level ?? '').trim();
        return rawText ? rawText : 'Not set';
    };

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
                    masteryLevel: normalizeMasteryLevelValue(profileDetails?.masteryLevel),
                    favoriteGameTags: normalizeFavoriteTagsForInput(profileDetails?.favoriteGameTags || ''),
                });
            } catch (error) {
                if (error?.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
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

            const normalizedMasteryLevel = normalizeMasteryLevelValue(formData.masteryLevel);
            
        
            await updatePlayerProfile({
                biography: formData.biography.trim() || null,
                favoriteGames: formData.favoriteGames,
                masteryLevel: normalizedMasteryLevel === '' ? null : Number(normalizedMasteryLevel),
                favoriteGameTags: tags,
            });

            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            if (error?.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
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
            <div className="profile-form">
                <h2>Loading profile...</h2>
            </div>
        );
    }

    const form = (
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
                type="text"
                name="favoriteGames"
                value={formData.favoriteGames}
                onChange={handleInputChange}
                disabled={!isEditing}
            />

            <label>Mastery Level</label>
            {isEditing ? (
                <select
                    name="masteryLevel"
                    value={formData.masteryLevel}
                    onChange={handleInputChange}
                >
                    <option value="">Select mastery level</option>
                    {masteryLevelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type="text"
                    value={getMasteryLevelLabel(formData.masteryLevel)}
                    disabled
                    readOnly
                />
            )}

            <label>Favorite Game Tags:</label>
            <input
                type="text"
                name="favoriteGameTags"
                value={formData.favoriteGameTags}
                onChange={handleInputChange}
                disabled={!isEditing}
            />

            <div className="profile-actions">
                {!isEditing ? (
                    <>
                        <button type="button" onClick={handleEdit}>Edit Profile</button>
                        {onClose && (
                            <button type="button" className="secondary" onClick={onClose}>Close</button>
                        )}
                    </>
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
    );

    if (onClose) return form;

    return (
        <>
            <Navbar page="profilepage" />
            <div className="profile-container">
                {form}
            </div>
        </>
    );
};

export default ProfilePage;