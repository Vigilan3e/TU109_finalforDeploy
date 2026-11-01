import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";

const Root = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "employee") {
        return <Navigate to="/employee/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
};

export default Root;