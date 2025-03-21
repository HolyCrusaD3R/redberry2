import { useState, useEffect, useMemo } from "react";
import apiKey from "../keys/apiKey";
import Task from "../interfaces/Task";
import { SelectedType } from "@/contexts/FilterContext";

type TaskListResponse = Task[];
type SingleTaskResponse = Task;
export type ApiResponse = TaskListResponse | SingleTaskResponse;

interface UseTaskResult {
  data: ApiResponse | null;
  loading: boolean;
  error: Error | null;
  handleDataFilter: (selected: SelectedType) => void;
  resetFilters: () => void;
  updateTaskStatus: (taskId: number, statusId: number) => Promise<Task | null>;
}

export default function useTask(id: number | null): UseTaskResult {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [filterCriteria, setFilterCriteria] = useState<SelectedType>({
    departments: [],
    employees: [],
    priorities: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const token = apiKey;
  const url = id
    ? `https://momentum.redberryinternship.ge/api/tasks/${id}`
    : `https://momentum.redberryinternship.ge/api/tasks`;

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(
            `API error: ${res.status} ${res.statusText}${
              errorMessage ? ` - ${errorMessage}` : ""
            }`
          );
        }

        const json = await res.json();

        if (isMounted) {
          setData(json);
        }
      } catch (err: any) {
        console.error(err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(err.message));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, url, token]);

  const updateTaskStatus = async (
    taskId: number,
    statusId: number
  ): Promise<Task | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://momentum.redberryinternship.ge/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status_id: statusId,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update task status");
      }

      const updatedTask = await res.json();

      if (id === taskId && data) {
        if (Array.isArray(data)) {
          setData(
            data.map((task) => (task.id === taskId ? updatedTask : task))
          );
        } else {
          setData(updatedTask);
        }
      }

      return updatedTask;
    } catch (err: any) {
      console.error(err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return data;

    return data.filter((task) => {
      const departmentMatch =
        filterCriteria.departments.length === 0 ||
        filterCriteria.departments.includes(String(task.department.id));

      const employeeMatch =
        filterCriteria.employees.length === 0 ||
        filterCriteria.employees.includes(String(task.employee.id));

      const priorityMatch =
        filterCriteria.priorities.length === 0 ||
        filterCriteria.priorities.includes(String(task.priority.id));

      return departmentMatch && employeeMatch && priorityMatch;
    });
  }, [data, filterCriteria]);

  const handleDataFilter = (selected: SelectedType) => {
    setFilterCriteria(selected);
  };

  const resetFilters = () => {
    setFilterCriteria({
      departments: [],
      employees: [],
      priorities: [],
    });
  };

  return {
    data: filteredData,
    loading,
    error,
    handleDataFilter,
    resetFilters,
    updateTaskStatus,
  };
}
