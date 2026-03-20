import React, { createContext, useState, useContext } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [year, setYear] = useState(2024);
  const [major, setMajor] = useState(null);

  return (
    <FilterContext.Provider value={{ year, setYear, major, setMajor }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
