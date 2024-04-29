import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import login from '../../images/login-image.png';
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/themes/theme-blue.css";
import { useAuth } from '../../AuthContext'; // Import useAuth

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUserId } = useAuth();

    const onLogin = async (e) => {
        e.preventDefault();
        setError("");
        if (!email) {
            setError("Email is required");
            return;
        }
        if (!password) {
            setError("Password is required");
            return;
        }
        const url = "http://localhost:3000/api/auth/signin";
        try {
            const response = await axios.post(url, { email, password }, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.data.token) {
                const userUrl = "http://localhost:3000/api/auth/users/me";
                const { data } = await axios.get(userUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${response.data.token}` // Ensure this matches what your backend expects
                    }
                });

                if (data._id) {
                    setUserId(data._id);
                    data.token = response.data.token;
                    setToken(data); // Assuming setToken is a function you've defined to handle setting the token
                    navigate('/', { replace: true }); // Navigate to the home page after login
                } else {
                    setError("Failed to retrieve user ID");
                }
            } else {
                setError("Login failed, token not provided.");
            }
        } catch (error) {
            setError("An error occurred during login.");
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError(error.message);
            }
        }
    };

    const showError = () => <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className='container login-container mt-5'>
            <div className="card mb-5 shadow" style={{ maxWidth: "800px", margin: "auto", borderRadius: "2%" }}>
                <div className="row g-0">
                    <div className="col-md-5">
                        <img src={login} alt="login" style={{ height: "100%", width: "100%", borderRadius: "2%" }} />
                    </div>
                    <div className="col-md-7 p-5">
                        <h1 className='text-center login-header mb-5'>LOGIN</h1>
                        <form onSubmit={onLogin}>
                            <div className="mb-3 form-floating">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="mb-3 form-floating">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="pw"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label htmlFor="pw">Password</label>
                            </div>
                            {showError()}
                            <div className="d-grid gap-2 mt-5">
                                <AwesomeButton type="primary">LOGIN</AwesomeButton>
                            </div>
                            <div className='mt-3'>
                                <Link to="/registration">Don't have an account? Register here.</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};

export default Login;
