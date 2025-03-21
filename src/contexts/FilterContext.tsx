import useTask, { ApiResponse } from "@/hooks/useTask";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

export interface SelectedType {
  departments: string[];
  priorities: string[];
  employees: string[];
}

export type FilterTypes = "departments" | "priorities" | "employees";

interface FilterContextType {
  filterTasks: () => void;
  changeSelected: (id: string, type: FilterTypes) => void;
  selected: SelectedType;
  data: ApiResponse | null;
  loading: boolean;
  error: Error | null;
}

const defaultFilterContext: FilterContextType = {
  filterTasks: () => {},
  changeSelected: () => {},
  selected: { departments: [], priorities: [], employees: [] },
  data: [],
  loading: false,
  error: null,
};

const FilterContext = createContext<FilterContextType>(defaultFilterContext);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const { data, loading, error, handleDataFilter } = useTask(null);

  const [selected, setSelected] = useState<SelectedType>(() => {
    const savedFilters = localStorage.getItem("selected");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          departments: [],
          priorities: [],
          employees: [],
        };
  });

  useEffect(() => {
    handleDataFilter(selected);
  }, []);

  function changeSelected(id: string, type: FilterTypes) {
    setSelected((prev) => {
      let selected;
      // This is case, when user unchecks button
      if (prev[type].includes(id)) {
        selected = {
          ...prev,
          [type]: prev[type].filter((item) => item !== id),
        };
      } else {
        // this is case when user clicks new button

        // This is so only selecting one employee at a time is possible
        if (type === "employees") {
          selected = { ...prev, [type]: [id] };
        } else {
          // This adds new button to array, when user checks new button, which wasn't checked before
          selected = { ...prev, [type]: [...prev[type], id] };
        }
      }

      return selected;
    });
  }

  function filterTasks() {
    localStorage.setItem("selected", JSON.stringify(selected));
    handleDataFilter(selected);
  }

  return (
    <FilterContext.Provider
      value={{ filterTasks, changeSelected, selected, data, loading, error }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  return useContext(FilterContext);
};
