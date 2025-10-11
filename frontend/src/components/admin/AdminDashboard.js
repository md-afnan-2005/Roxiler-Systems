import React from "react";
import API from "../../api";

class AdminDashboard extends React.Component {
    state = { users: 0, stores: 0, ratings: 0 };

    async componentDidMount() {
        const res = await API.get("/admin/dashboard");
        this.setState(res.data);
    }

    render() {
        return (
            <div>
                <h2>Admin Dashboard</h2>
                <p>Total Users: {this.state.users}</p>
                <p>Total Stores: {this.state.stores}</p>
                <p>Total Ratings: {this.state.ratings}</p>
            </div>
        );
    }
}

export default AdminDashboard;
