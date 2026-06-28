import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
export default function Dashboard() {
    const { user } = useAuth();

    return (
        <>
            <Navbar />
            <div className="page">
              <h1>
                    Welcome,
                    {" "}
                    {user?.username}
                </h1>
                <p>
                    Ready to continue your reading journey?
                </p>
            </div>
        </>
    );
}