import api from "./api";

export async function getLibrary() {
    const res = await api.get("/library");
    return res.data;
}

export async function addBook(book, shelf) {
    return api.post("/library/add", {
        shelf,
        book
    });
}

export async function moveBook(book_id, shelf) {
    return api.patch("/library/move", {
        book_id,
        shelf
    });
}

export async function removeBook(book_id) {
    return api.delete("/library/remove", {
        data: {
            book_id
        }
    });
}

export async function rateBook(book_id, rating) {
    const res = await api.post("/graphql", {
        query: `
            mutation RateBook($bookId: String!, $rating: Int!) {
                rateBook(bookId: $bookId, rating: $rating)
            }
        `,
        variables: {
            bookId: book_id,
            rating
        }
    });

    return res.data;
}

export async function reviewBook(book_id, review) {
    const res = await api.post("/graphql", {
        query: `
            mutation ReviewBook($bookId: String!, $review: String!) {
                reviewBook(bookId: $bookId, review: $review)
            }
        `,
        variables: {
            bookId: book_id,
            review
        }
    });

    return res.data;
}

export async function clearRating(book_id) {
    const res = await api.post("/graphql", {
        query: `
            mutation ClearRating($bookId: String!) {
                clearRating(bookId: $bookId)
            }
        `,
        variables: {
            bookId: book_id
        }
    });

    return res.data;
}

export async function clearReview(book_id) {
    const res = await api.post("/graphql", {
        query: `
            mutation ClearReview($bookId: String!) {
                clearReview(bookId: $bookId)
            }
        `,
        variables: {
            bookId: book_id
        }
    });

    return res.data;
}