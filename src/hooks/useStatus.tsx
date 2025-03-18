import { useState, useEffect } from "react";
import apiKey from "../keys/apiKey";

interface Status {
  id: number;
  name: string;
}

const useStatus = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const token = apiKey;
  const url = `https://momentum.redberryinternship.ge/api/statuses`;

  useEffect(() => {
    const fetchStatuses = async () => {
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
        setStatuses(json);
      } catch (err: any) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  return { statuses, loading, error };
};

export default useStatus;
