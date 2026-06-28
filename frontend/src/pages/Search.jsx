import { useState } from "react";
import { searchBooks } from "../services/api";
import BookCard from "../components/BookCard";
import "../styles/search.css";

export default function Search() {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);
    const handleSearch = async () => {
        if (!query) return;
        const results = await searchBooks(query);
        setBooks(results);
    };

    return (
        <div className="search-page">
            <h1>Clio</h1>
            <div className="search-box">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search books..."
                />
                <button onClick={handleSearch}>
                    Search
                </button>
            </div>
            <div className="results">
                {books.map((book, index) => (
                    <BookCard key={index} book={book} />
                ))}
            </div>
        </div>
    );
}