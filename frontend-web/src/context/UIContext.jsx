// frontend-web/src/context/UIContext.jsx
import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <UIContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  return useContext(UIContext);
};
