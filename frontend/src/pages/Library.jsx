import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    getLibrary,
    moveBook,
    removeBook
} from "../services/library";
import "./Library.css";

export default function Library() {

    const [library, setLibrary] = useState({
        "To Read": [],
        "Reading": [],
        "Read": []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLibrary();
    }, []);

    async function loadLibrary() {
        setLoading(true);
        try {
            const data = await getLibrary();
            setLibrary(data);
        }
        finally {
            setLoading(false);
        }
    }

    async function handleMove(bookId, shelf) {
        await moveBook(bookId, shelf);
        loadLibrary();
    }

    async function handleRemove(bookId) {
        if (!window.confirm("Remove this book?"))
            return;
        await removeBook(bookId);
        loadLibrary();
    }
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="page">
                    <h2>Loading...</h2>
                </div>
            </>
        );

    }

    return (
        <>
            <Navbar />
            <div className="page">
                <h1>My Library</h1>
                {
                    Object.entries(library).map(([shelf, books]) => (
                        <section
                            key={shelf}
                            className="library-section"
                        >
                            <h2>
                                {shelf}
                                <span>
                                    {books.length}
                                </span>
                            </h2>
                            {
                                books.length === 0 && (
                                    <p className="empty">
                                        No books yet.
                                    </p>
                                )
                            }
                            <div className="books">
                                {
                                    books.map((entry) => {
                                        const book = entry.book;
                                        return (
                                            <div
                                                className="card"
                                                key={book.id}
                                            >
                                                <div className="book-cover">
                                                    {
                                                        book.cover ? <img src={book.cover} alt={book.title} /> :
                                                            <div className="cover-placeholder">
                                                                Not Available
                                                            </div>
                                                    }
                                                </div>
                                                <div className="card-info">
                                                    <h3>{book.title}</h3>
                                                    <p>{book.author}</p>

                                                    <div className="shelf-toggle">
                                                        {["To Read", "Reading", "Read"].map((option) => (
                                                            <button
                                                                key={option}
                                                                type="button"
                                                                className="shelf-btn"
                                                                onClick={() => handleMove(book.id, option)}
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <button className="remove" onClick={() => handleRemove(book.id)}>
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </section>
                    ))
                }
            </div>
        </>
    );
}