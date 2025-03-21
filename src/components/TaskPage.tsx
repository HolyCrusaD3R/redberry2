import useStatus from "../hooks/useStatus";
import useDepartment from "../hooks/useDepartment";
import Skeleton from "./Skeleton";
import TaskColumn from "./TaskColumn";
import TaskCard from "./TaskCard";
import Filter from "./filter/Filter";
import useEmployees from "@/hooks/useEmployee";
import usePriority from "@/hooks/usePriority";
import { Link } from "react-router-dom";
import { useFilterContext } from "@/contexts/FilterContext";

export default function TaskPage() {
  const backgroundColors: Record<number, string> = {
    1: "#F7BC30",
    2: "#FB5607",
    3: "#FF006E",
    4: "#3A86FF",
  };
  const { data, loading, error } = useFilterContext();
  const { statuses, loading: statusLoading, error: statusError } = useStatus();
  const {
    departments: departments,
    error: departmentsError,
    loading: departmentsLoading,
  } = useDepartment();

  const {
    employees: employees,
    error: employeesError,
    loading: employeesLoading,
  } = useEmployees();

  const {
    priorities: priorities,
    error: priorityError,
    loading: prioritiesLoading,
  } = usePriority();

  if (error || statusError) {
    return (
      <section className="w-[1680px] mx-auto mt-12">
        <p className="text-lg text-[#021526CC]">
          რაღაც არასწორად წავიდა, გთხოვთ გადაამოწმოთ ინტერნეტ კავშირი
        </p>
      </section>
    );
  }

  if (
    loading ||
    statusLoading ||
    departmentsLoading ||
    employeesLoading ||
    prioritiesLoading
  ) {
    return (
      <section className="grid grid-cols-4 gap-5 w-[1600px] mx-auto mb-20 mt-12">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </section>
    );
  }
  if (!statuses) {
    return <NotFound text="სტატუსები არ იძებნება" />;
  }
  if (!departments || departmentsError) {
    return <NotFound text="დეპარტამენტები არ იძებნება" />;
  }
  if (!employees || employeesError) {
    return <NotFound text="თანამშრომლები არ იძებნება" />;
  }
  if (!priorities || priorityError) {
    return <NotFound text="პრიორიტეტები არ იძებნება" />;
  }

  return (
    <section className="w-full">
      <div className="w-[1680px] mx-auto mt-[40px] mb-[100px]">
        <div className="">
          <h2 className="text-[31px] font-firago font-semibold">
            დავალებების გვერდი
          </h2>
        </div>

        <Filter
          departments={departments}
          employees={employees}
          priorities={priorities}
        />

        <div className="flex flex-row justify-between mt-[79px]">
          {statuses.map((status) => {
            const filteredData = Array.isArray(data)
              ? data.filter((task) => task.status.id === status.id)
              : [];
            return (
              <TaskColumn
                key={status.id}
                title={status.name}
                backgroundColor={backgroundColors[status.id]}
              >
                {Array.isArray(data) &&
                  data.length !== 0 &&
                  filteredData.map((task) => (
                    <Link to={`/task/${task.id}`} key={task.id}>
                      <TaskCard
                        task={task}
                        borderColor={backgroundColors[status.id]}
                      />
                    </Link>
                  ))}
              </TaskColumn>
            );
          })}
        </div>
        {Array.isArray(data) && data.length === 0 && (
          <p className="text-[#021526CC] mt-4 ml-4 text-xl">
            დავალებები არ იძებნება
          </p>
        )}
      </div>
    </section>
  );
}

function NotFound({ text }: { text: string }) {
  return (
    <section className="w-[1600px] mx-auto">
      <p className="text-lg text-[#021526CC]">{text}</p>
    </section>
  );
}
