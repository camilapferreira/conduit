import { Outlet, Navigate } from "react-router-dom";
import { HeaderAuthenticated } from "./HeaderAuthenticated";
import { HeaderUnauthenticated } from "./HeaderUnauthenticated";
import { AuthContext } from "./AuthProvider";
import { useContext } from "react";

/** Renders the correct header by token, then the current route (Outlet) */
export const AuthLayout = () => {
  const { auth } = useContext(AuthContext);
  return (
    <>
      {auth ? <HeaderAuthenticated /> : <HeaderUnauthenticated />}
      <Outlet />
    </>
  );
};

/** Use only as wrapper for protected routes: redirect to /login when no token */
export const ProtectedRoute = () => {
  const token = getToken();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
