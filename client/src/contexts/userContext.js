import { useState, createContext, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true" ? true : false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!currentUser && token) getUserInfo();
  }, [currentUser, token]);

  const getUserInfo = async () => {
    let response = await fetch("/getUserInfo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setCurrentUser(data);
  };


  const signIn = (user) => {
    localStorage.setItem("isAuthenticated", true)
    localStorage.setItem("token", user.access_token)
    setAuthenticated(true);
    setToken(user.access_token);
  };

  const signOut = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("token")
    setToken(null);
    setCurrentUser(null);
    setAuthenticated(false);
  };

  return (
    <UserContext.Provider
      value={{
        token,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setAuthenticated,
        signIn,
        signOut
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
