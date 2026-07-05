import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./BookDetails.css";

export default function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadBook();
    }, [id]);

    async function loadBook() {
        setLoading(true);
        try {
            const res = await api.post("/graphql", {
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
            });
            setBook(res.data.data.book);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
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
                    {book.cover ?
                        <img src={book.cover} alt={book.title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder.png";
                            }}
                        /> :
                        <div className="cover-placeholder large">
                            Not Available
                        </div>
                    }
                </div>
                <div className="book-right">
                    <h1>{book.title}</h1>
                    <h3>{book.author}</h3>
                    {book.year &&
                        <p>
                            Published {book.year}
                        </p>
                    }
                    {book.rating != null &&
                        <p>
                            ★ {Number(book.rating).toFixed(1)}
                            {" · "}
                            {book.ratingsCount} ratings
                        </p>
                    }
                    <br />
                    <h4>Description</h4>
                    <p>
                        {book.description || "No description available."}
                    </p>
                    <br />
                    <h4>Genres</h4>
                    <div className="tags">
                        {book.subjects?.map(tag => (
                            <span  key={tag} className="tag">
                                  {tag}
                            </span>
                        ))}
                    </div>
                    <br />
                    <h4>Series</h4>
                    {
                        book.series?.length ?
                            <ul>
                                {
                                    book.series.map(series => (
                                        <li key={series}>
                                            {series}
                                        </li>
                                    ))
                                }
                            </ul> :
                            <p>Standalone</p>
                    }
                    <br />
                    <h4>ISBN</h4>
                    {
                        book.isbn?.length ?
                            <ul>
                                {
                                    book.isbn.map(code => (
                                        <li key={code}>
                                            {code}
                                        </li>
                                    ))
                                }
                            </ul>  :
                            <p>No ISBN available.</p>
                    }
                </div>
            </div>
        </>
    );
}