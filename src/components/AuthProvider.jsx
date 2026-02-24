import { createContext } from "react";

const AuthContext = createContext(false);

const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ auth: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
