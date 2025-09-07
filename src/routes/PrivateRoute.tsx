// src/routes/PrivateRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Role } from "@/types/Role";


interface PrivateRouteProps {
allowedRoles?: Role[]; // si no se pasa, cualquier usuario autenticado
}


const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
const { user, isLoading } = useAuth();
const location = useLocation();


if (isLoading) return null; // o un Loader


if (!user) {
return <Navigate to="/login" state={{ from: location }} replace />;
}


if (allowedRoles && !allowedRoles.includes(user.role)) {
return <Navigate to="/" replace />; // o página 403
}


return <Outlet />;
};


export default PrivateRoute;