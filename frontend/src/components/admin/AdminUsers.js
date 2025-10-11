import React from "react";
import API from "../../api";

class AdminUsers extends React.Component {
    state = { users: [], q: "" };

    async componentDidMount() {
        this.loadUsers();
    }

    loadUsers = async () => {
        const res = await API.get("/admin/users", { params: { q: this.state.q } });
        this.setState({ users: res.data });
    };

    render() {
        return (
            <div>
                <h2>All Users</h2>
                <input
                    placeholder="Search..."
                    value={this.state.q}
                    onChange={(e) => this.setState({ q: e.target.value })}
                />
                <button onClick={this.loadUsers}>Search</button>

                <table border="1" cellPadding="6">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default AdminUsers;
