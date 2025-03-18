import useTask from "../hooks/useTask";
import useStatus from "../hooks/useStatus";
import useDepartment from "../hooks/useDepartment";
import Skeleton from "./Skeleton";
import TaskColumn from "./TaskColumn";
import TaskCard from "./TaskCard";

function TaskPage() {
  const backgroundColors: Record<number, string> = {
    1: "#F7BC30",
    2: "#FB5607",
    3: "#FF006E",
    4: "#3A86FF",
  };
  const { data, loading, error } = useTask(null);
  const { statuses, loading: statusLoading, error: statusError } = useStatus();
  const {
    departments,
    loading: departmentsLoading,
    error: departmentsError,
  } = useDepartment();
  if (error || statusError) {
    return (
      <section className="w-[1680px] mx-auto mt-12">
        <p className="text-lg text-[#021526CC]">
          რაღაც არასწორად წავიდა, გთხოვთ გადაამოწმოთ ინტერნეტ კავშირი
        </p>
      </section>
    );
  }

  if (loading || statusLoading || departmentsLoading) {
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
    return (
      <section className="w-[1600px] mx-auto">
        <p className="text-lg text-[#021526CC]">სტატუსები არ იძებნება</p>
      </section>
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <section className="w-[1600px] mx-auto">
        <p className="text-lg text-[#021526CC]">
          აღნიშნული მონაცემებით დავალება არ იძებნება
        </p>
      </section>
    );
  }
  // console.log(data);
  // console.log(statuses);
  // console.log(departments);
  return (
    <section className="w-full">
      <div className="w-[1680px] mx-auto mt-[40px]">
        <div className="">
          <h2 className="text-[31px] font-firago font-semibold">
            დავალებების გვერდი
          </h2>
        </div>
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
                {filteredData.map((task) => (
                  <TaskCard
                    task={task}
                    borderColor={backgroundColors[status.id]}
                  />
                ))}
              </TaskColumn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TaskPage;
