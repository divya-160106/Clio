# 📖 Clio — Book Discovery & Personal Library Platform

> **Find your next read. Track everything you've read.**

Clio is a full-stack book discovery application that combines the flexibility of GraphQL with the simplicity of REST APIs to provide a seamless reading experience. Search for books through the Hardcover GraphQL API, explore detailed book info, and organize your personal library into To Be Read, Reading, and Read collections.

**Live demo:** https://clio-phi.vercel.app/

---

## ✨ Features (v1.0)

- **Hybrid API architecture** — REST for app-specific functionality, GraphQL for flexible external data retrieval
- **Smart caching** — a MongoDB-backed caching layer stores frequently searched books, cutting down repeated calls to the Hardcover API
- **Secure authentication** — JWT-based auth protects all bookshelf endpoints
- **Personal bookshelves** — organize books into To Be Read, Reading, and Read, and move them freely between shelves
- **Rich book details** — covers, authors, ratings, descriptions, genres, and publication info, all abstracted behind the backend
- **Responsive frontend** — React frontend that talks only to the backend, never directly to GraphQL

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React.js, React Router, Axios, CSS |
| Backend | FastAPI, Python |
| External data | GraphQL (Hardcover API) |
| Database / Cache | MongoDB (Motor / PyMongo) |
| Auth | JWT |

---

## 🏗️ Architecture

```
                +----------------------+
                |    React Frontend    |
                +----------+-----------+
                           |
                     REST API Calls
                           |
                           v
                 +-------------------+
                 |     FastAPI       |
                 +-------------------+
                 | Authentication    |
                 | Bookshelves CRUD  |
                 | Cache Management  |
                 | GraphQL Client    |
                 +---------+---------+
                           |
           +---------------+---------------+
           |                               |
           v                               v
     MongoDB Cache                 Hardcover GraphQL API
```

---

## 🗂️ Project Structure

```
CLIO/
├── backend/
│   └── app/
│       ├── database/
│       │   ├── init_db.py
│       │   └── mongodb.py
│       ├── graphql/
│       │   ├── __init__.py
│       │   ├── queries.py
│       │   ├── schema.py
│       │   └── types.py
│       ├── models/
│       │   ├── auth.py
│       │   ├── book.py
│       │   ├── library.py
│       │   └── user.py
│       ├── routes/
│       │   ├── auth.py
│       │   ├── health.py
│       │   └── library.py
│       ├── services/
│       │   ├── auth.py
│       │   ├── book_catalog.py
│       │   ├── cache.py
│       │   ├── hardcover.py
│       │   └── library.py
│       └── main.py
│   ├── venv/
│   ├── .env
│   ├── requirements.txt
│   └── test_mongo.py
│
└── frontend/
    ├── public/
    │   ├── Clio_transparent.png
    │   ├── Clio.png
    │   ├── favicon.svg
    │   └── icons.svg
    └── src/
        ├── assets/
        ├── components/
        │   ├── Navbar.jsx / .css
        │   ├── ProtectedRoute.jsx
        │   └── ShelfSelector.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Auth.css
        │   ├── BookDetails.jsx / .css
        │   ├── Dashboard.jsx
        │   ├── Library.jsx / .css
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Search.jsx
        ├── services/
        ├── App.jsx / App.css
        ├── index.css
        └── main.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Python 3.10+
- A MongoDB instance (local or Atlas)
- A Hardcover API key

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
HARDCOVER_API_KEY=your_hardcover_api_key
JWT_SECRET=your_jwt_secret
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔄 How It Works

1. A user searches for a book.
2. FastAPI checks whether the book already exists in MongoDB.
3. **If cached** — return the cached data immediately.
4. **If not** — construct a GraphQL query, fetch data from Hardcover, store the response in MongoDB, then return it to the frontend.
5. For bookshelves, authenticated users hit RESTful endpoints to add, move, or remove books from their To Be Read / Reading / Read collections.
6. The frontend never talks to GraphQL directly — the backend abstracts and caches everything behind REST.

---

## 📡 API Design

### REST Endpoints

```
POST   /auth/register
POST   /auth/login

GET    /books/search
GET    /books/{id}

GET    /bookshelves
POST   /bookshelves
PUT    /bookshelves/{id}
DELETE /bookshelves/{id}
```

### GraphQL

The backend consumes the Hardcover GraphQL API for:

- Book search
- Book metadata
- Author information
- Ratings
- Cover images
- Publication details

---

## 🌐 Deployment

Clio is live! You can try it here: https://clio-phi.vercel.app/

---

## 🗺️ Roadmap

### v2.0 (Coming Soon)

- 🤖 AI-powered recommendations based on reading history (personalized recommendations)
- 📊 Reading statistics and analytics
- ⭐ Book reviews and ratings
- 🎯 Wishlist support
- 🔍 Advanced filtering and sorting
- 📴 Offline caching
- 👥 Social reading features

---

## 💡 Why Clio?

Unlike traditional CRUD applications, Clio demonstrates the integration of multiple backend paradigms in a single system:

- RESTful APIs for application-specific functionality
- GraphQL for flexible external data retrieval
- MongoDB caching to improve performance
- Modular FastAPI architecture
- Responsive React frontend

---

## 📄 License & Copyright

© 2026 Divyasree Manikandan. All rights reserved.

This project and its source code are the intellectual property of the author. Unauthorized copying, distribution, or use of this codebase, in whole or in part, without explicit written permission is prohibited.

---

*Built with ☕, 📚, and a healthy respect for API rate limits.*
