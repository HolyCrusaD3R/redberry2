import useTask from "../hooks/useTask";
import Skeleton from "./Skeleton";

function TaskPage() {
  const { data, loading, error } = useTask(null);

  if (error) {
    return (
      <section className="w-[1680px] mx-auto mt-12">
        <p className="text-lg text-[#021526CC]">
          რაღაც არასწორად წავიდა, გთხოვთ გადაამოწმოთ ინტერნეტ კავშირი
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="grid grid-cols-4 gap-5 w-[1600px] mx-auto mb-20 mt-12">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
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
  console.log(data);
  return (
    <section className="w-full">
      <div className="w-[1680px] mx-auto mt-[40px]">
        <h2 className="text-[31px] font-firago font-semibold">
          დავალებების გვერდი
        </h2>
        {Array.isArray(data) &&
          data.map((task: any) => (
            <div key={task.id} className="mt-[40px]">
              <h3 className="text-[20px] font-firago font-medium">
                {task.name}
              </h3>
              <p className="text-[#021526CC] mt-[10px]">{task.description}</p>
            </div>
          ))}
      </div>
    </section>
  );
}

export default TaskPage;
