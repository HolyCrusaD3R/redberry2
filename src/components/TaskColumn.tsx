import clsx from "clsx";

function TaskColumn({
  title,
  backgroundColor,
  children,
}: {
  title: string;
  backgroundColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={clsx(
          "w-[381px] text-center rounded py-[15px]",
          `bg-${backgroundColor}`
        )}
      >
        <h3 className="text-[20px] font-firago font-medium">{title}</h3>
      </div>
      <div className="mt-[30px]">{children}</div>
    </div>
  );
}

export default TaskColumn;
