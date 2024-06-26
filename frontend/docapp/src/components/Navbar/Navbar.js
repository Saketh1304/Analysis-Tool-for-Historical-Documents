import React, { Component } from 'react'
import './Navbar.css';
import logo from '../../images/logo-transparent.png'
import { useNavigate, Link } from 'react-router-dom';
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/themes/theme-blue.css";
import { useLocation } from "react-router-dom";


class Navbar extends Component {

    constructor(props) {
        super(props)
    }

    logout = () => {
        this.props.setToken();
        this.props.navigate("/", { replace: true });
    }

    getUser = () => {
        const userDetail = localStorage.getItem('user');
        const user = JSON.parse(userDetail);
        return <div class="mx-5 mt-2 fs-4">
            <span class="badge bg-light text-dark mx-2 p-2">
                <img class="mx-2" src="https://cdn-icons-png.flaticon.com/512/1177/1177568.png" height={25} width={25} />
                {user.username}
            </span>

        </div>;
    }

    goToLogin = () => {
        this.props.navigate("/login", { replace: true });
    }

    goToRegistration = () => {
        this.props.navigate("/registration", { replace: true });
    }

    showUserButton() {
        const path = this.props.path;
        if (path === "/registration") {
            return (<nav class="navbar navbar-expand-md">
                <div class="container">
                    <Link to="/" class="pt-3">
                        <a class="navbar-brand text-dark" href="/">
                            <img src={logo} height={35} width={35} class="d-inline-block mb-3" />
                            <span class="h3 mx-2">ATHD</span>
                        </a>
                    </Link>
                    <div class='px-5'>
                        <AwesomeButton style={{ "margin-top": "10px" }} type="primary"
                            onPress={(e) => this.goToLogin()}
                        >Login</AwesomeButton>
                    </div>
                </div>
            </nav >);
        } else if (path === "/login") {
            return <nav class="navbar navbar-expand-md">
                <div class="container">
                    <Link to="/" class="pt-3">
                        <a class="navbar-brand text-dark" href="/">
                            <img src={logo} height={35} width={35} class="d-inline-block mb-3" />
                            <span class="h3 mx-2">ATHD</span>
                        </a>
                    </Link>
                    <div class='px-5'>
                        <AwesomeButton style={{ "margin-right": "50px", "margin-top": "10px" }}
                            onPress={(e) => this.goToRegistration()} type="primary" >Register</AwesomeButton>
                    </div>
                </div>
            </nav >;
        } else {
            return <nav class="navbar navbar-expand-md">
                <div class="container">
                    <Link to="/" class="pt-3">
                        <a class="navbar-brand text-dark" href="/">
                            <img src={logo} height={35} width={35} class="d-inline-block mb-3" />
                            <span class="h3 mx-2">ATHD</span>
                        </a>
                    </Link>
                    <div class='px-5'>
                        <AwesomeButton style={{ "margin-right": "50px", "margin-top": "10px" }}
                            onPress={(e) => this.goToRegistration()} type="primary" >Register</AwesomeButton>
                        <AwesomeButton style={{ "margin-top": "10px" }} type="primary"
                            onPress={(e) => this.goToLogin()}
                        >Login</AwesomeButton>
                    </div>
                </div>
            </nav >;
        }
    }


    render() {
        const body = this.props.token ?
            /* Logged In Navbar */
            <nav class="navbar navbar-expand-md">
                <div class="container">
                    <Link to="/" class='pt-3'>
                        <a class="navbar-brand text-dark" href="/">
                            <img src={logo} height={35} width={35} class="d-inline-block mb-3" />
                            <span class="h3 mx-2">ATHD</span>
                        </a>
                    </Link>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ms-auto md-2 mb-lg-0">
                            <li class="nav-item">
                                {this.getUser()}
                            </li>
                            <li class="nav-item">
                                <AwesomeButton type="secondary" onPress={(e) => this.logout()}>Log Out</AwesomeButton>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav >
            :
            /* Before Log In Navbar */
            <div>
                {this.showUserButton()}
            </div>
        return body;
    }
}

export default Navbar;