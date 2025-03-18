import { useState, useEffect } from "react";
import apiKey from "../keys/apiKey";
import Department from "../interfaces/Department";

const useDepartment = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const token = apiKey;
  const url = `https://momentum.redberryinternship.ge/api/departments`;

  useEffect(() => {
    const fetchDepartments = async () => {
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
        setDepartments(json);
      } catch (err: any) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, loading, error };
};

export default useDepartment;
