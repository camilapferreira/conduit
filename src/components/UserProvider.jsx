import { createContext } from "react";

const UserContext = createContext(false);

const UserProvider = ({ children }) => {
  return (
    <UserContext.Provider value={{ user: "John Doe" }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider };
