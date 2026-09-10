import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { getLibrary, rateBook, reviewBook, clearRating, clearReview } from "../services/library";
import ShelfSelector from "../components/ShelfSelector";
import "./BookDetails.css";

export default function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shelf, setShelf] = useState(null);
    const [userRating, setUserRating] = useState(null);
    const [userReview, setUserReview] = useState("");
    const [ratingLoading, setRatingLoading] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [ratingMessage, setRatingMessage] = useState("");
    const [reviewMessage, setReviewMessage] = useState("");
    const [editingReview, setEditingReview] = useState(false);

    useEffect(() => { loadBook(); }, [id]);

    async function loadBook() {
        setLoading(true);
        try {
            const [bookResponse, library] = await Promise.all([
                api.post("/graphql", {
                    query: `
                        query Book($id: String!) {
                            book(id: $id) {
                                id
                                title
                                author
                                cover
                                year
                                rating
                                ratingsCount
                                reviewsCount
                                description
                                subjects
                                isbn
                                series
                            }
                        }
                    `,
                    variables: { id }
                }),
                getLibrary()
            ]);

            const fetchedBook = bookResponse.data.data.book;
            setBook(fetchedBook);
            
            /* Find the book in the user's library and determine its shelf. */
            let libraryEntry = null;
            let currentShelf = null;

            for (const shelfName of ["To Read", "Reading", "Read"]) {
                const books = library[shelfName] || [];

                const found = books.find(
                    entry => entry.book?.id === id
                );

                if (found) {
                    libraryEntry = found;
                    currentShelf = shelfName;
                    break;
                }
            }

            setShelf(currentShelf);

            /* Only Read books can have ratings/reviews. */
            if (libraryEntry && currentShelf === "Read") {
                setUserRating(libraryEntry.rating ?? null);
                setUserReview(libraryEntry.review ?? "");
            } else {
                setUserRating(null);
                setUserReview("");
            }
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }

    async function handleRating(rating) {
        setRatingLoading(true);
        setRatingMessage("");
        try {
            const response = await rateBook(id, rating);
            if (response.errors) {
                throw new Error(response.errors[0].message);
            }
            setUserRating(rating);
            setRatingMessage("Rating saved.");
        }
        catch (err) {
            console.log(err);
            setRatingMessage("Could not save rating.");
        }
        finally {
            setRatingLoading(false);
        }
    }

    async function handleClearRating() {
        setRatingLoading(true);
        setRatingMessage("");
        try {
            const response = await clearRating(id);
            if (response.errors) {
                throw new Error(response.errors[0].message);
            }
            setUserRating(null);
            setRatingMessage("Rating cleared.");
        }
        catch (err) {
            console.log(err);
            setRatingMessage("Could not clear rating.");
        }
        finally {
            setRatingLoading(false);
        }
    }

    async function handleReview() {
        if (!userReview.trim()) return;
        setReviewLoading(true);
        setReviewMessage("");
        try {
            const response = await reviewBook( id, userReview.trim() );
            if (response.errors) {
                throw new Error(response.errors[0].message);
            }
            setReviewMessage(
                editingReview
                    ? "Review updated."
                    : "Review saved."
            );

            setEditingReview(false);
        }
        catch (err) {
            console.log(err);
            setReviewMessage("Could not save review.");
        }
        finally {
            setReviewLoading(false);
        }
    }

    async function handleClearReview() {
        setReviewLoading(true);
        setReviewMessage("");
        try {
            const response = await clearReview(id);
            if (response.errors) {
                throw new Error(response.errors[0].message);
            }
            setUserReview("");
            setEditingReview(false);
            setReviewMessage("Review cleared.");
        }
        catch (err) {
            console.log(err);
            setReviewMessage("Could not clear review.");
        }
        finally {
            setReviewLoading(false);
        }
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

    if (!book) {
        return (
            <>
                <Navbar />
                <div className="page">
                    <h2>Book not found.</h2>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="book-page">
                <div className="book-left">
                    {book.cover ? (
                        <img
                            src={book.cover}
                            alt={book.title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder.png";
                            }}
                        />
                    ) : (
                        <div className="cover-placeholder large">
                            Not Available
                        </div>
                    )}
                </div>

                <div className="book-right">
                    <h1>{book.title}</h1>
                    <h3>{book.author}</h3>
                    {book.year && (
                        <p>
                            Published {book.year}
                        </p>
                    )}
                    {book.rating != null && (
                        <p>
                            ★ {Number(book.rating).toFixed(1)}
                            {" · "}
                            {book.ratingsCount} ratings
                        </p>
                    )}
                    <br />
                    <h4>Description</h4>
                    <p>
                        {book.description ||
                            "No description available."}
                    </p>
                    <br />
                    <h4>Genres</h4>
                    <div className="tags">
                        {book.subjects?.map(tag => (
                            <span
                                key={tag}
                                className="tag"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <br />
                    <h4>Series</h4>

                    {book.series?.length ? (
                        <ul>
                            {book.series.map(series => (
                                <li key={series}>
                                    {series}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Standalone</p>
                    )}

                    <br/>
                    <h4>ISBN</h4>

                    {book.isbn?.length ? (
                        <ul>
                            {book.isbn.map(code => (
                                <li key={code}>
                                    {code}
                                </li>
                            ))}
                        </ul>
                    ) 
                    : 
                    (
                        <p>No ISBN available.</p>
                    )}

                    <div className="your-library-section">
                        <br />
                        <h4>Your Library</h4>
                        {shelf ? (
                            <>
                                <p>
                                    Shelf: <strong>{shelf}</strong>
                                </p>

                                <ShelfSelector
                                    book={book}
                                    currentShelf={shelf}
                                    onFinished={loadBook}
                                />
                            </>
                        ) : (
                            <>
                                <p>
                                    This book is not in your library.
                                </p>

                                <ShelfSelector
                                    book={book}
                                    currentShelf={null}
                                    onFinished={loadBook}
                                />
                            </>
                        )}
                    </div>

                    {/* User Rating Section */}
                    {shelf === "Read" && (
                        <div className="user-review-section">
                            <br />
                            <h4>Your Rating</h4>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map(value => (
                                        <button
                                            key={value}
                                            type="button"
                                            className={
                                                value <= (userRating || 0)
                                                    ? "star active"
                                                    : "star"
                                            }
                                            onClick={() => handleRating(value)}
                                            disabled={ratingLoading}
                                            aria-label={`Rate ${value} out of 5`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>

                                {ratingLoading && (
                                    <p className="action-message">
                                        Saving rating...
                                    </p>
                                )}

                                {ratingMessage && (
                                    <p className="action-message">
                                        {ratingMessage}
                                    </p>
                                )}

                                {userRating !== null && !ratingLoading && (
                                    <button
                                        type="button"
                                        onClick={handleClearRating}
                                        className="clear-button"
                                    >
                                        Clear Rating
                                    </button>
                                )}

                            {ratingMessage && (
                                <p className="action-message">
                                    {ratingMessage}
                                </p>
                            )}

                            <br />

                            {/* User Review Section */}
                        <h4>Your Review</h4>
                            {userReview && !editingReview ? (
                                <div className="saved-review">
                                    <p>{userReview}</p>
                                    <div className="review-actions">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingReview(true);
                                                setReviewMessage("");
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleClearReview}
                                            disabled={reviewLoading}
                                            className="clear-button"
                                        >
                                            {reviewLoading ? "Clearing..." : "Clear"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <textarea
                                        value={userReview}
                                        placeholder="Write your review..."
                                        onChange={(e) =>
                                            setUserReview(e.target.value)
                                        }
                                        rows={6}
                                    />
                                    <div className="review-actions">
                                        <button
                                            type="button"
                                            onClick={handleReview}
                                            disabled={
                                                reviewLoading ||
                                                !userReview.trim()
                                            }
                                        >
                                            {reviewLoading
                                                ? "Saving..."
                                                : editingReview
                                                    ? "Update Review"
                                                    : "Save Review"}
                                        </button>

                                        {editingReview && (
                                            <button
                                                type="button"
                                                className="clear-button"
                                                onClick={() => {
                                                    setEditingReview(false);
                                                    setReviewMessage("");
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}

                                    </div>
                                </>
                            )}

                            {reviewMessage && (
                                <p className="action-message">
                                    {reviewMessage}
                                </p>
                            )}

                        </div>
                    )}

                </div>
            </div>
        </>
    );
}