import { useState, useEffect } from "react";
import { getEventFQAs, askEventFQA, answerEventFQA, deleteEventFQAQuestion, deleteEventFQAAnswer } from "../services/api";
import '../styles/EventFaq.css';

const EventFaqModal = ({ eventId, isCreator, currentUserId }) => {
    const [faqs, setFaqs] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [answerInput, setAnswerInput] = useState({}); // Track answer input for each question
    const [loading, setLoading] = useState(true);

    const fetchFQAs = async () => {
        try {
            setLoading(true);
            const data = await getEventFQAs(eventId);
            setFaqs(data);
        } catch {

            alert("Failed to load Q&A.")

        } finally {
            setLoading(false);
        }
    };

    // display FQAs in the modal
    useEffect(() => {
        fetchFQAs();
    }, [eventId]);

    const handleAskQuestion = async () => {
        const trimmed = newQuestion.trim();
        if (!trimmed) return;

        try{
            await askEventFQA(eventId, trimmed);
            setNewQuestion("");
            fetchFQAs(); // Refresh the list after asking a question
        }catch{

            alert("Failed to submit question.")
        }

    };

    const handleAnswerQuestion = async (questionId) => {
        const trimmed = (answerInput[questionId] || "").trim();
        if (!trimmed) return;

        try{
            await answerEventFQA(eventId, questionId, trimmed);
            setAnswerInput(prev => ({ ...prev, [questionId]: "" }));
            fetchFQAs(); // Refresh the list after answering a question
        }catch{
            alert("Failed to submit answer.")
        }
    };

    // Deletes question or answer based on the type of deletion requested by the user. Confirmation is required before deletion. 
    const handleDeleteQuestion = async (questionId) => {
        if (!confirm("Are you sure you want to delete this question?")) return;

        try {
            await deleteEventFQAQuestion(eventId, questionId);
            fetchFQAs(); // Refresh the list after deleting a question
        }catch{
            alert("Failed to delete question.")

        }
    };

    const handleDeleteAnswer = async (questionId) => {
        if (!confirm("Are you sure you want to delete this answer?")) return;
        fetchFQAs(); // Refresh the list after deleting an answer
        try {
            await deleteEventFQAAnswer(eventId, questionId);
            fetchFQAs(); // Refresh the list after deleting an answer
        }catch{
            alert("Failed to delete answer.")
        }
    };

    if (loading) return <p>Loading Q&A...</p>;
    

    return(
        <div className="event-faq-modal">
            <h3>Event Q&A</h3>

            {/* Ask a question - subscribers only */}
            {!isCreator && (
                <div className="faq-ask-form">
                    <textarea
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder= "Ask a question about the event..."
                        rows = {2}
                    />
                    <button className="btn-ask-form" onClick={handleAskQuestion}>Submit Question</button>
                </div>
            )}

            {faqs.length === 0 ? (
                <p>No questions have been asked yet.</p>
            ) : ( 
                <ul className="faq-list">
                    {faqs.map ((faq) => {
                        const isQuestionAuthor = 
                            String(faq.authorUserId) === String(currentUserId);
                        
                        return(
                            <li key={faq.id} className="faq-item">
                                <div className="faq-question">
                                    <span className="faq-username">{faq.authorUserName || "Unknown"}</span>
                                    <strong>Q:</strong> {faq.question}
                                    <span className="faq-date">
                                        {new Date(faq.askedAtUtc).toLocaleString()}
                                    </span>
                                    {/* Author of the question or event owner can delete */}
                                    {(isQuestionAuthor) && (
                                        <button className="button-delete-faq" onClick={() => handleDeleteQuestion(faq.id)}>Delete</button>
                                    )}
                                </div>

                                {faq.answer ? (
                                    <div className="faq-answer">
                                        <span className="faq-username">{faq.answeredUserName || "Event Owner"}</span>
                                        <strong>A:</strong> {faq.answer}
                                        <span className="faq-date">
                                            {new Date(faq.answeredAtUtc).toLocaleString()}
                                        </span>
                                        {/* Author of the answer or event owner can delete */}
                                        {isCreator && (
                                            <button className="button-delete-faq" onClick={() => handleDeleteAnswer(faq.id)}>Delete</button>
                                        )}
                                    </div>
                                ): isCreator? (
                                    <div className="faq-answer-form">
                                        <textarea 
                                            value={answerInput[faq.id] || ""}
                                            onChange={(e) => setAnswerInput(prev => ({ ...prev, [faq.id]: e.target.value }))}
                                            placeholder="Write your answer..."
                                            rows={2}
                                        />
                                        <button onClick={() => handleAnswerQuestion(faq.id)}>Reply</button>
                                    </div>
                                ):(
                                    <p className="faq-no-answer">Awaiting answer...</p>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default EventFaqModal;