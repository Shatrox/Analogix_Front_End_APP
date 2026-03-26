import React from "react";
import Navbar from "../components/NavBar";
import '../styles/HomePage.css';

const HomePage = () => {
    return(
        <div className="home-container">
            

            <header className="home-header">
                <h1>Welcome To Analogix</h1>
                <p>You came to the place where you can find people playing your favorite analogical games all around the world! </p>
                <p>Here you can create your own events or subscribe to existing events close to your location, whether it be your or someonee elses place, a park, a coffee shop or even in a beach close to you!</p>
                <p>Our goal is to allow you to easily find partners to play while promoting a more inperson World</p>
            </header>

            <main className="event-section-style">
                <div className="title-style">
                    <h2>Events Available</h2>
                </div>

                <div className="events-display-style">
                    {/*display example */}
                    <div className="event-card">
                        <h3>Torneio de LoL</h3>
                        <p><strong>Data:</strong> 20 de Abril de 2026</p>
                        <p><strong>Vagas:</strong> 5/10</p>
                        <button className="btn-details">Ver Detalhes</button>
                    </div>

                    <div className="event-card">
                        <h3>Sessão de RPG (D&D)</h3>
                        <p><strong>Data:</strong> 25 de Abril de 2026</p>
                        <p><strong>Vagas:</strong> 2/4</p>
                        <button className="btn-details">Ver Detalhes</button>
                    </div>

                </div>

            </main>
        </div>
    )
}

export default HomePage;