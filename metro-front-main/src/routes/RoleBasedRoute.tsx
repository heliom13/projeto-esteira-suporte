// src/routes/RoleBasedRoute.tsx
import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

type RoleBasedRouteProps = {
    requiredRoles: string[];
};

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({requiredRoles}) => {
    const {isAuthenticated, hasAnyRole} = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login"/>;
    }

    if (!hasAnyRole(requiredRoles)) {
        return <Navigate to="/403"/>;
    }

    return <Outlet/>;
};

export default RoleBasedRoute;
