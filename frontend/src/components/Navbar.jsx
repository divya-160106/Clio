import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    function handleLogout() { logout(); navigate("/login"); }
    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/dashboard">
                    Clio
                </Link>
            </div>
            <div className="nav-links">
                <Link to="/dashboard">
                    Dashboard
                </Link>
                <Link to="/search">
                    Search
                </Link>
                <Link to="/library">
                    Library
                </Link>
            </div>
            <div className="nav-user">
                <span>
                    {user?.username}
                </span>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}