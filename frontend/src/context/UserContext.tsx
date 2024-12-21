import React, { createContext, ReactNode, useContext, useState } from "react";

interface UserContextProps {
  token: string,
  setToken: (token: string) => void,
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string>('');

  return (
    <UserContext.Provider value={{ token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useLoggedInUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useLoggedInUser must be used within a UserProvider');
  }
  return context;
}