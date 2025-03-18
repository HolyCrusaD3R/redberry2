import { useState, useEffect } from "react";
import apiKey from "../keys/apiKey";
import Priority from "../interfaces/Status";

const usePriority = () => {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const token = apiKey;
  const url = `https://momentum.redberryinternship.ge/api/priorities`;

  useEffect(() => {
    const fetchPriorities = async () => {
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
        setPriorities(json);
      } catch (err: any) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPriorities();
  }, []);

  return { priorities, loading, error };
};

export default usePriority;
