import { createContext } from "react";

const AuthContext = createContext(false);

const getToken = () => {
  return localStorage.getItem("token");
};
const setToken = (token) => {
  localStorage.setItem("token", token);
};
const removeToken = () => {
  localStorage.removeItem("token");
};
const isAuthenticated = () => {
  return getToken() !== null;
};

const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ auth: isAuthenticated() }}>
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthProvider,
  AuthContext,
  getToken,
  setToken,
  removeToken,
  isAuthenticated,
};
