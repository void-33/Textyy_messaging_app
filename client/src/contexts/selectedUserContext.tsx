import { createContext, useContext, useState, ReactNode } from "react";

interface SelectedUserContextType {
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
};

const SelectedUserContext = createContext<SelectedUserContextType | undefined>(undefined);

export const SelectedUserProvider = ({ children }: { children: ReactNode }) => {
  const [selectedUserId, setSelectedUserId] = useState("");

  return (
    <SelectedUserContext.Provider value={{ selectedUserId, setSelectedUserId }}>
      {children}
    </SelectedUserContext.Provider>
  );
};

export const useSelectedUser = () => {
  const context = useContext(SelectedUserContext);
  if (!context) throw new Error("useSelectedUser must be used within a SelectedUserProvider");
  return context;
};
