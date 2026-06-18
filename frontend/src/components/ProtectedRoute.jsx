import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
    user,
    role,
    allowedRoles = [],
    children
}) {

    // ❌ pas connecté
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // ❌ rôle non autorisé
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    // ✅ accès OK
    return children;
}