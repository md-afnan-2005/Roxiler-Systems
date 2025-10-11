import React from "react";
import API from "../../api";

class OwnerDashboard extends React.Component {
    state = { stores: [] };

    async componentDidMount() {
        const res = await API.get("/owner/stores");
        this.setState({ stores: res.data });
    }

    render() {
        return (
            <div>
                <h2>Your Stores</h2>
                {this.state.stores.map((s) => (
                    <div key={s.store.id} className="card">
                        <h3>{s.store.name}</h3>
                        <p>Average rating: {s.average_rating}</p>
                        <p>Ratings:</p>
                        <ul>
                            {s.raters.map((r) => (
                                <li key={r.id}>
                                    {r.name} — {r.rating}★ — {r.comment}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    }
}

export default OwnerDashboard;
