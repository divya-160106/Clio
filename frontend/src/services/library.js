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