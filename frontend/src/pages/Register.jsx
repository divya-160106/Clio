import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Auth.css";

export default function Register() {

    const navigate = useNavigate();

    const { register } = useAuth();

    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    async function handleSubmit(e){

        e.preventDefault();

        setError("");

        try{

            await register(

                username,

                email,

                password

            );

            navigate("/dashboard");

        }

        catch(err){

            setError(

                err.response?.data?.detail ||

                "Registration failed."

            );

        }

    }

    return(

        <div className="auth-container">

            <form
                className="auth-card"
                onSubmit={handleSubmit}
            >

                <h1>Create Account</h1>

                <p>Join Clio</p>

                {error &&

                    <div className="error">

                        {error}

                    </div>

                }

                <input

                    placeholder="Username"

                    value={username}

                    onChange={(e)=>

                        setUsername(e.target.value)

                    }

                />

                <input

                    placeholder="Email"

                    value={email}

                    onChange={(e)=>

                        setEmail(e.target.value)

                    }

                />

                <input

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={(e)=>

                        setPassword(e.target.value)

                    }

                />

                <button>

                    Register

                </button>

                <p>

                    Already have an account?

                    <Link to="/login">

                        Login

                    </Link>

                </p>

            </form>

        </div>

    );

}