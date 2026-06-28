import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const searchBooks = async (query) => {
    const res = await axios.get(`${API_BASE}/books`, {
        params: { query }
    });

    return res.data.results;
};