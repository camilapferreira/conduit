import { Outlet, Navigate } from "react-router-dom";
import { HeaderAuthenticated } from "./HeaderAuthenticated";
import { HeaderUnauthenticated } from "./HeaderUnauthenticated";

// Single source for token (replace with useContext(AuthContext) when you add it)
const getToken = () => {
  // e.g. return localStorage.getItem("token");
  return false;
};

/** Renders the correct header by token, then the current route (Outlet) */
export const AuthLayout = () => {
  const token = getToken();
  return (
    <>
      {token ? <HeaderAuthenticated /> : <HeaderUnauthenticated />}
      <Outlet />
    </>
  );
};

/** Use only as wrapper for protected routes: redirect to /login when no token */
export const ProtectedRoute = () => {
  const token = getToken();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
