// import clsx from "clsx";
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
        className="w-[381px] text-center rounded-[10px] py-[15px]"
        style={{ backgroundColor: backgroundColor }}
        // className={clsx(
        //   "w-[381px] text-center rounded py-[15px] ",
        //   `bg-${backgroundColor}`
        // )}
      >
        <h3 className="text-[20px] font-firago font-medium text-white">
          {title}
        </h3>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}

export default TaskColumn;
