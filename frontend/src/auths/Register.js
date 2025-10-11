import React, { Component } from "react";
import API from "../api";
import "../styles/Forms.css";

class Register extends Component {
    state = { name: "", email: "", address: "", password: "", error: null };

    handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/auth/register", this.state);
            window.location = "/login";
        } catch (err) {
            this.setState({
                error:
                    err.response?.data?.errors?.map((x) => x.msg).join(", ") ||
                    err.response?.data?.message ||
                    "Registration failed",
            });
        }
    };

    render() {
        return (
            <div className="form-card">
                <h2>Register</h2>
                <form onSubmit={this.handleSubmit}>
                    <label>Name</label>
                    <input
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                        required
                    />

                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        required
                    />

                    <label>Address</label>
                    <textarea
                        name="address"
                        value={this.state.address}
                        onChange={this.handleChange}
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

                    <button type="submit">Register</button>
                </form>
            </div>
        );
    }
}

export default Register;
