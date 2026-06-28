import "../styles/bookcard.css";

export default function BookCard({ book }) {

    return (

        <div className="book-card">

            {
                book.cover ?

                <img
                    src={book.cover}
                    alt={book.title}
                />

                :

                <div className="cover-placeholder">
                    No Cover
                </div>

            }

            <div className="info">

                <h3>{book.title}</h3>

                <p>{book.author}</p>

                <p>{book.year}</p>

            </div>

        </div>

    )

}