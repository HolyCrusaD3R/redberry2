import { createContext, useState, useContext, ReactNode } from "react";

interface FilterContextType {
  departments: Department[];
  priorities: Priority[];
  employees: Employee[];
  changeDepartments: (departments: Department[]) => void;
  changePriorities: (priorities: Priority[]) => void;
  changeEmployees: (employees: Employee[]) => void;
  resetFilters: () => void;
}

const defaultFilterContext: FilterContextType = {
  departments: [],
  priorities: [],
  employees: [],
  changeDepartments: () => {},
  changePriorities: () => {},
  changeEmployees: () => {},
  resetFilters: () => {},
};

const FilterContext = createContext<FilterContextType>(defaultFilterContext);

import Department from "../interfaces/Department";
import Priority from "../interfaces/Priority";
import Employee from "../interfaces/Employee";

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [departments, setDepartments] = useState(() => {
    const savedDepartments = localStorage.getItem("departments");
    return savedDepartments ? JSON.parse(savedDepartments) : [];
  });

  const [priorities, setPriorities] = useState(() => {
    const savedPriorities = localStorage.getItem("priorities");
    return savedPriorities ? JSON.parse(savedPriorities) : [];
  });

  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem("employees");
    return savedEmployees ? JSON.parse(savedEmployees) : [];
  });

  function changeDepartments(departments: Department[]) {
    setDepartments(departments);
    localStorage.setItem("departments", JSON.stringify(departments));
  }

  function changePriorities(priorities: Priority[]) {
    setPriorities(priorities);
    localStorage.setItem("priorities", JSON.stringify(priorities));
  }

  function changeEmployees(employees: Employee[]) {
    setEmployees(employees);
    localStorage.setItem("employees", JSON.stringify(employees));
  }

  function resetFilters() {
    setDepartments([]);
    setPriorities([]);
    setEmployees([]);
  }

  const value: FilterContextType = {
    departments,
    priorities,
    employees,
    changeDepartments,
    changePriorities,
    changeEmployees,
    resetFilters,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  return useContext(FilterContext);
};
