import { useState } from "react";
import { addBook, moveBook } from "../services/library";
import "./Navbar.css";

export default function ShelfSelector({ book, currentShelf, onFinished }) {

    const [loading, setLoading] = useState(false);
    async function handleChange(e) {
        const shelf = e.target.value;
        if (!shelf) return;
        setLoading(true);
        try {
            if (currentShelf) {
                await moveBook(book.id, shelf);
            } else {
                await addBook(book, shelf);
            }

            if (onFinished) {
                onFinished();
            }
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="shelf-toggle">
        {["To Read", "Reading", "Read"].map((option) => (
            <button
                key={option}
                type="button"
                disabled={loading}
                className={`shelf-btn ${currentShelf === option ? "active" : ""}`}
                onClick={() => handleChange({ target: { value: option } })}
            >
                {option}
            </button>
        ))}
    </div>
        
    );
}