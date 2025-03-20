import { createContext, useContext, ReactNode } from "react";

interface FilterContextType {
  filterTasks: () => void;
}

const defaultFilterContext: FilterContextType = {
  filterTasks: () => {},
};

const FilterContext = createContext<FilterContextType>(defaultFilterContext);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  function filterTasks() {}

  return (
    <FilterContext.Provider value={{ filterTasks }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  return useContext(FilterContext);
};
