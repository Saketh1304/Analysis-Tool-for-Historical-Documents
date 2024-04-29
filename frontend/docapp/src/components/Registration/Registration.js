import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/themes/theme-blue.css";
import './Registration.css'; // Ensure this path is correct based on your project structure
import login from '../../images/login-image.png'; // Ensure this path is correct

const Registration = () => {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    // const [organization, setOrganization] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onRegistration = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !email || !firstName || !lastName || !password) {
            setError("All fields are required");
            return;
        }
        const url = "http://localhost:3000/api/auth/register";

        await axios.post(url, {
            username: username,
            email: email,
            firstname: firstName,
            lastname: lastName,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        
            
        ).then((response) => {
            if (response.status === 201) {
                navigate("/login", { replace: true });
            }
        }).catch((error) => {
            if (error.response) {
                if (error.response.data.email) {
                    setError(error.response.data.email[0]);
                }
                else if (error.response.data.first_name) {
                    setError(error.response.data.first_name[0]);
                }
                else if (error.response.data.last_name) {
                    setError(error.response.data.last_name[0]);
                }
                else if (error.response.data.username) {
                    setError(error.response.data.username[0]);
                }
               
                else if (error.response.data.password) {
                    setError(error.response.data.password[0]);
                }
                else if (error.response.data.non_field_errors) {
                    setError(error.response.data.non_field_errors[0]);

                }
            }

        });

       
              
          
    };

    return (
        <div className='container register-container mt-5'>
            <div className="card mb-5 shadow" style={{ maxWidth: "1000px", margin: "auto", borderRadius: "2%" }}>
                <div className="row g-0">
                    <div className="col-md-5">
                        <img src={login} alt="Login" style={{ height: "100%", width: "100%", borderRadius: "2%" }} />
                    </div>
                    <div className="col-md-7 p-5">
                        <h1 className='text-center login-header mb-5'>REGISTER</h1>
                        <form onSubmit={onRegistration}>
                            
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="username" placeholder="Username"
                                    value={username} onChange={(e) => setUsername(e.target.value)}
                                />
                                <label htmlFor="username">Username</label>
                            </div>
                           
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="email" placeholder="name@example.com"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="firstName" placeholder="First Name"
                                    value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                />
                                <label htmlFor="firstName">First Name</label>
                            </div>
                           
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="lastName" placeholder="Last Name"
                                    value={lastName} onChange={(e) => setLastName(e.target.value)}
                                />
                                <label htmlFor="lastName">Last Name</label>
                            </div>
                            
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="password" placeholder="Password"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                          
                            {/* <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="organization" placeholder="Organization"
                                    value={organization} onChange={(e) => setOrganization(e.target.value)}
                                />
                                <label htmlFor="organization">Organization</label>
                            </div> */}
                          
                            {error && <div style={{ color: "red" }}>{error}</div>}
                          
                            <div className="d-grid gap-2 mt-4">
                                <AwesomeButton type="primary">Register</AwesomeButton>
                            </div>
                            <div className='mt-3 text-center'>
                                <Link to="/login">Already have an Account? Login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
