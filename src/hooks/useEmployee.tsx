import { useState, useEffect } from "react";
import apiKey from "../keys/apiKey";
import Employee from "../interfaces/Employee";
import NewEmployee from "../interfaces/NewEmployee";

const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = apiKey;
  const url = `https://momentum.redberryinternship.ge/api/employees`;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
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
      setEmployees(json);
    } catch (err: any) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employeeData: NewEmployee) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("name", employeeData.name);
      formData.append("surname", employeeData.surname);
      formData.append("avatar", employeeData.avatar);
      formData.append("department_id", employeeData.department_id.toString());

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to create employee");
      }

      const newEmployee = await res.json();

      setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);

      return newEmployee;
    } catch (err: any) {
      console.log(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    employees,
    loading,
    error,
    createEmployee,
    refreshEmployees: fetchEmployees,
  };
};

export default useEmployees;
