import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

class Header extends React.Component {
    logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location = "/login";
    };

    render() {
        const role = localStorage.getItem("role");
        const loggedIn = !!localStorage.getItem("token");

        return (
            <header className="app-header">
                <div className="logo">
                    <Link to="/">StoreRatings</Link>
                </div>
                <nav>
                    <Link to="/stores">Stores</Link>
                    {!loggedIn && (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                    {loggedIn && (
                        <>
                            {role === "admin" && <Link to="/admin">Admin</Link>}
                            {role === "owner" && <Link to="/owner">Owner</Link>}
                            <button onClick={this.logout} className="btn-link">
                                Logout
                            </button>
                        </>
                    )}
                </nav>
            </header>
        );
    }
}

export default Header;
