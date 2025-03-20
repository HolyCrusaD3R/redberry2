import Task from "../interfaces/Task";

import Comments from "../assets/Comments.svg";
// import low_priority from "../assets/low_priority.svg";
// import medium_priority from "../assets/medium_priority.svg";
// import high_priority from "../assets/high_priority.svg";

// const svgs = {
//   1: low_priority,
//   2: medium_priority,
//   3: high_priority,
// };

const deparmentColors: Record<number, string> = {
  1: "#89B6FF",
  2: "#FFD86D",
  3: "#FF66A8",
  4: "#FD9A6A",
  5: "#89B6FF",
  6: "#FFD86D",
  7: "#FF66A8",
};

const priorityColors: Record<number, string> = {
  1: "#08A508",
  2: "#FFBE0B",
  3: "#FA4D4D",
};

const TaskCard = ({
  task,
  borderColor,
}: {
  task: Task;
  borderColor: string;
}) => {
  return (
    <div
      key={task.id}
      className="mt-[30px]  max-w-[381px] max-h-[240px] border-[1px] border-solid rounded-[15px] p-[20px]"
      style={{ borderColor }}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-[10px]">
          <div
            className="flex flex-row rounded-[5px] p-1 w-[86px] border-[0.5px] items-center gap-1"
            style={{ borderColor: priorityColors[task.status.id] }}
          >
            <img
              src={task.priority.icon}
              alt="priority"
              className="w-[16px] h-[16px]"
            />
            <p className="font-firago font-medium text-[12px]/[1.5]">
              {task.priority.name}
            </p>
          </div>
          <div
            className="w-[86px] py-[5px] px-[9px] rounded-[15px]"
            style={{ backgroundColor: deparmentColors[task.department.id] }}
          >
            <p className="text-[12px] font-firego font-normal text-center">
              {task.department.name.length > 7
                ? `${task.department.name.substring(0, 7)}...`
                : task.department.name}
            </p>
          </div>
        </div>
        <div>
          <p>
            {(() => {
              const date = new Date(task.due_date);
              const day = date.getDate().toString().padStart(2, "0");
              const month = date.getMonth();
              const year = date.getFullYear();

              const georgianMonths = [
                "იან",
                "თებ",
                "მარ",
                "აპრ",
                "მაი",
                "ივნ",
                "ივლ",
                "აგვ",
                "სექ",
                "ოქტ",
                "ნოე",
                "დეკ",
              ];

              const georgianMonth = georgianMonths[month];

              return `${day} ${georgianMonth} ${year}`;
            })()}
          </p>
        </div>
      </div>
      <div className="my-[20px] mx-[10.5px] flex flex-col gap-[12px]">
        <p className="font-firago font-medium text-[15px]">{task.name}</p>
        <p className="font-firego text-[14px] break-words whitespace-normal overflow-hidden text-ellipsis line-clamp-3">
          {task.description}
        </p>
      </div>
      <div className="w-full flex flex-row justify-between">
        <img
          src={task.employee.avatar}
          alt="Employee avatar"
          className="rounded-full w-[31px] h-[31px]"
        />
        <div className="flex flex-row justify-between gap-[2.5px]">
          <img src={Comments} alt="comments" className="w-[22px] h-[22px]" />
          <p>{task.total_comments}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
