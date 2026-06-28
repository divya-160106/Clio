import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/dashboard" />}
                />
                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
                    path="/register"
                    element={<Register />}
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/search"
                    element={
                        <ProtectedRoute>
                            <Search />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;