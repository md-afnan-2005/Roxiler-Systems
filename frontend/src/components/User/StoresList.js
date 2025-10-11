import React from "react";
import API from "../../api";
import StoreCard from "./StoreCard";
import "../../styles/Cards.css";

class StoresList extends React.Component {
    state = { stores: [], q: "" };

    componentDidMount() {
        this.loadStores();
    }

    loadStores = async () => {
        const res = await API.get("/stores", { params: { q: this.state.q } });
        this.setState({ stores: res.data });
    };

    render() {
        return (
            <div>
                <h2>Stores</h2>
                <input
                    placeholder="Search..."
                    value={this.state.q}
                    onChange={(e) => this.setState({ q: e.target.value })}
                />
                <button onClick={this.loadStores}>Search</button>

                <div className="cards">
                    {this.state.stores.map((s) => (
                        <StoreCard key={s.id} store={s} onRated={this.loadStores} />
                    ))}
                </div>
            </div>
        );
    }
}

export default StoresList;
