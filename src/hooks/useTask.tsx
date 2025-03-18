import { useState, useEffect } from "react";
import apiKey from "../keys/apiKey";
import Task from "../interfaces/Task";

type TaskListResponse = Task[];
type SingleTaskResponse = Task;
type ApiResponse = TaskListResponse | SingleTaskResponse;

export default function useTask(id: number | null) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const token = apiKey;

  const url = id
    ? `https://momentum.redberryinternship.ge/api/tasks/${id}`
    : `https://momentum.redberryinternship.ge/api/tasks`;

  useEffect(() => {
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
          throw new Error("Something went wrong");
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  return { data, loading, error };
}
