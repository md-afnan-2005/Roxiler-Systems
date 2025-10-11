import React from "react";
import { Navigate } from "react-router-dom";

class ProtectedRoute extends React.Component {
    render() {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const { role: requiredRole } = this.props;

        if (!token) return <Navigate to="/login" replace />;
        if (requiredRole && requiredRole !== role)
            return <Navigate to="/login" replace />;

        return this.props.children;
    }
}

export default ProtectedRoute;
