import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import ShelfSelector from "../components/ShelfSelector";
import { getLibrary, moveBook, addBook } from "../services/library";
import { useNavigate } from "react-router-dom";

export default function Search() {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookShelves, setBookShelves] = useState({});

    const navigate = useNavigate();

    // Load saved search query/results
    useEffect(() => {
        const savedQuery = sessionStorage.getItem("searchQuery");
        const savedBooks = sessionStorage.getItem("searchResults");

        if (savedQuery) {
            setQuery(savedQuery);
        }

        if (savedBooks) {
            setBooks(JSON.parse(savedBooks));
        }

        loadBookShelves();
    }, []);

    async function loadBookShelves() {
        try {
            const library = await getLibrary();

            const shelves = {};

            ["To Read", "Reading", "Read"].forEach((shelfName) => {
                const books = library[shelfName] || [];

                books.forEach((entry) => {
                    if (entry.book?.id) {
                        shelves[entry.book.id] = shelfName;
                    }
                });
            });

            setBookShelves(shelves);
        }
        catch (err) {
            console.log(err);
        }
    }

    async function handleShelfChange(book, shelf) {
        try {
            const currentShelf = bookShelves[book.id];

            if (currentShelf) {
                // Book already exists in library
                await moveBook(book.id, shelf);
            }
            else {
                // Book is not in library yet
                await addBook(book, shelf);
            }

            // Update Catalogue immediately
            setBookShelves((prev) => ({
                ...prev,
                [book.id]: shelf
            }));
        }
        catch (err) {
            console.log(err);
        }
    }

    async function searchBooks() {
        if (!query.trim()) return;

        setLoading(true);

        try {
            const res = await api.post("/graphql", {
                query: `
                    query SearchBooks($query: String!) {
                        searchBooks(query: $query) {
                            id
                            title
                            author
                            cover
                            year
                            rating
                            ratingsCount
                            reviewsCount
                            subjects
                            description
                        }
                    }
                `,
                variables: {
                    query,
                },
            });

            const results = res.data.data.searchBooks;

            setBooks(results);

            sessionStorage.setItem(
                "searchQuery",
                query
            );

            sessionStorage.setItem(
                "searchResults",
                JSON.stringify(results)
            );

            // Refresh shelf information
            await loadBookShelves();
        }
        catch (err) {
            console.log(err);
        }
        finally {
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

                    <button onClick={searchBooks}>
                        Search
                    </button>
                </div>

                {loading && (
                    <p className="status-text">
                        Searching...
                    </p>
                )}

                <div className="books">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="card"
                        >
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
                                        <span>
                                            Not Available
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="card-info">
                                <h3>{book.title}</h3>

                                <p>
                                    {book.author}
                                    {book.year
                                        ? ` · ${book.year}`
                                        : ""}
                                </p>

                                {book.rating != null && (
                                    <p className="rating">
                                        ★{" "}
                                        {Number(book.rating).toFixed(1)}

                                        {book.ratings_count
                                            ? ` (${book.ratings_count.toLocaleString()})`
                                            : ""}
                                    </p>
                                )}

                                {book.subjects?.length > 0 && (
                                    <div className="tags">
                                        {book.subjects.map((subject) => (
                                            <span
                                                key={subject}
                                                className="tag"
                                            >
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

                                <div className="card-actions">
                                    <div
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                    >
                                        <ShelfSelector
                                            book={book}
                                            currentShelf={
                                                bookShelves[book.id] || null
                                            }
                                            onFinished={() =>
                                                loadBookShelves()
                                            }
                                        />
                                    </div>
                                </div>

                                <button
                                    className="view-btn"
                                    onClick={() =>
                                        navigate(`/book/${book.id}`)
                                    }
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}