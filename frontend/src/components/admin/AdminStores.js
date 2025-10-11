import React from "react";
import API from "../../api";

class AdminStores extends React.Component {
    state = { stores: [] };

    async componentDidMount() {
        const res = await API.get("/admin/stores");
        this.setState({ stores: res.data });
    }

    render() {
        return (
            <div>
                <h2>All Stores</h2>
                <table border="1" cellPadding="6">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Avg Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.stores.map((s) => (
                            <tr key={s.id}>
                                <td>{s.name}</td>
                                <td>{s.email}</td>
                                <td>{s.address}</td>
                                <td>{s.average_rating}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default AdminStores;
