import React, { Component } from "react";
import API from "../api";
import "../styles/Forms.css";

class Login extends Component {
    state = { email: "", password: "", error: null };

    handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/login", {
                email: this.state.email,
                password: this.state.password,
            });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            window.location =
                res.data.role === "admin"
                    ? "/admin"
                    : res.data.role === "owner"
                        ? "/owner"
                        : "/stores";
        } catch (err) {
            this.setState({
                error: err.response?.data?.message || "Invalid credentials",
            });
        }
    };

    render() {
        return (
            <div className="form-card">
                <h2>Login</h2>
                <form onSubmit={this.handleSubmit}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        required
                    />

                    {this.state.error && <div className="error">{this.state.error}</div>}

                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
}

export default Login;
