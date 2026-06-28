import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Search() {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    async function searchBooks() {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await api.get(
                `/books?query=${encodeURIComponent(query)}`
            );
            setBooks(res.data.results);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />
            <div className="page">
                <h1>Catalogue</h1>

                <div className="search-bar">
                    <input
                        value={query}
                        placeholder="Search..."
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchBooks();
                            }
                        }}
                    />
                    <button onClick={searchBooks}>Search</button>
                </div>

                {loading && <p className="status-text">Searching...</p>}

                <div className="books">
                    {books.map((book) => (
                        <div key={book.id} className="card">
                            <div className="book-cover">
                                {book.cover ? (
                                    <img
                                        src={book.cover || "/placeholder.png"}
                                        alt={book.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/placeholder.png";
                                        }}
                                    />
                                ) : (
                                    <div className="cover-placeholder">
                                        <span>Not Available</span>
                                    </div>
                                )}
                            </div>

                            <div className="card-info">
                                <h3>{book.title}</h3>
                                <p>
                                    {book.author}
                                    {book.year ? ` · ${book.year}` : ""}
                                </p>

                                {book.rating != null && (
                                    <p className="rating">
                                        ★ {Number(book.rating).toFixed(1)}
                                        {book.ratings_count
                                            ? ` (${book.ratings_count.toLocaleString()})`
                                            : ""}
                                    </p>
                                )}

                                {book.subjects?.length > 0 && (
                                    <div className="tags">
                                        {book.subjects.map((subject) => (
                                            <span key={subject} className="tag">
                                                {subject}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {book.description && (
                                    <p className="description">
                                        {book.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}