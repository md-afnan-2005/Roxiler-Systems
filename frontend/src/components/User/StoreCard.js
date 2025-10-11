import React from "react";
import API from "../../api";

class StoreCard extends React.Component {
    state = { rating: this.props.store.user_rating || 0, comment: "" };

    setRating = (r) => this.setState({ rating: r }, this.submitRating);

    submitRating = async () => {
        try {
            await API.post(`/stores/${this.props.store.id}/rate`, {
                rating: this.state.rating,
                comment: this.state.comment,
            });
            alert("Rating submitted!");
            this.props.onRated();
        } catch {
            alert("Please login as a user to rate.");
        }
    };

    render() {
        const s = this.props.store;
        return (
            <div className="card">
                <h3>{s.name}</h3>
                <p>{s.address}</p>
                <p>Average: {s.average_rating}</p>
                <p>Your rating: {s.user_rating || "Not rated"}</p>

                <div>
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            className={this.state.rating >= n ? "star active" : "star"}
                            onClick={() => this.setRating(n)}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>
        );
    }
}

export default StoreCard;
