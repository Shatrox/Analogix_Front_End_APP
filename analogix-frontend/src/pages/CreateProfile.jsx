import { useState } from "react";
import {useNavigate} from "react-router-dom";
import api from "../services/api";
import '../styles/CreateProfile.css';


const CreateProfile = () => {
    const [biography, setBiography] = useState("");
    const [favoriteGames, setFavoriteGames] = useState("");
    const [masteryLevel, setMasteryLevel] = useState("");
    const [favoriteGameTags, setFavoriteGameTags] = useState("");
    const navigate = useNavigate();

    const handleCreateProfile = async (e) => {
        e.preventDefault();

        const tags = favoriteGameTags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
        
        try {
            await api.post("/PlayerProfile/create/profile", {
                biography: biography.trim() || null,
                favoriteGames,
                masteryLevel: Number(masteryLevel),
                favoriteGameTags: tags,
            });
            alert("Profile created successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Profile creation failed:", error);

            if (error?.response?.status === 401) {
                alert("You need to loggin first to create a profile.");
                navigate("/login");
                return;
            }

            alert("Profile creation failed. Please check your input and try again.");   
            
        }
    };

    return (
        <div className="create-profile-container">
            <form className="create-profile-form" onSubmit={handleCreateProfile}>
                <h2>Create Your Player Profile</h2>
                <textarea
                    placeholder="Biography"
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                    rows={8}
                />
                <input
                    type="text"
                    placeholder="Favorite Games"
                    value={favoriteGames}
                    onChange={(e) => setFavoriteGames(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Mastery Level"
                    value={masteryLevel}
                    onChange={(e) => setMasteryLevel(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Favorite Game Tags (comma separated)"
                    value={favoriteGameTags}
                    onChange={(e) => setFavoriteGameTags(e.target.value)}
                />
                <button type="submit">
                    Create Profile
                </button>
            </form>


        </div>
    );

};

export default CreateProfile;