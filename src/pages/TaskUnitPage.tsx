import Header from "../components/Header";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useTask from "../hooks/useTask";
import useStatus from "../hooks/useStatus";
import Task from "../interfaces/Task";

import calendar from "../assets/calendar.svg";
import user from "../assets/user.svg";
import pieChart from "../assets/pie-chart.svg";
import Dropdown_passive from "../assets/Dropdown_passive.svg"; // Make sure these assets exist
import Dropdown_active from "../assets/Dropdown_active.svg"; // or import the correct ones
import CommentSection from "@/components/CommentSection";

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

export default function TaskUnitPage() {
  const { id } = useParams();
  const numericId = id ? parseInt(id) : null;
  const { data, loading, error, updateTaskStatus } = useTask(numericId);
  const { statuses, loading: statusesLoading } = useStatus();
  const [activeDropdown, setActiveDropdown] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const task = data as Task;

  // Close dropdown when clicking outside
  useEffect(() => {
    localStorage.removeItem("selected");

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle status change
  const handleStatusChange = async (statusId: number) => {
    if (!task || !numericId) return;

    try {
      await updateTaskStatus(numericId, statusId);
      // No need to update local state as the updateTaskStatus function
      // should handle this through the useTask hook
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading || statusesLoading)
    return <div className="p-8 text-center">იტვირთება...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        დაფიქსირდა შეცდომა: {error.message}
      </div>
    );
  if (!task)
    return <div className="p-8 text-center">დავალება ვერ მოიძებნა</div>;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    const georgianWeekdays = ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"];

    const dayName = georgianWeekdays[date.getDay()];

    const formattedDate = date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "numeric",
        year: "numeric",
      })
      .replace(/\//g, "/");

    return `${dayName} - ${formattedDate}`;
  };

  return (
    <div className="">
      <Header />
      <div className="w-[1680px] mx-auto mt-[40px] flex flex-row justify-between">
        <div>
          <div className="w-[715px] flex flex-col gap-3">
            <div className="flex flex-row gap-[18px]">
              <div
                className="flex flex-row rounded-[5px] p-1 border-[0.5px] items-center gap-1"
                style={{ borderColor: priorityColors[task.priority.id] }}
              >
                <img
                  src={task.priority.icon}
                  alt="priority"
                  className="w-[18px] h-[20px]"
                />
                <p className="font-firago font-medium text-[16px]/[1.5]">
                  {task.priority.name}
                </p>
              </div>
              <div
                className=" py-[5px] px-[9px] rounded-[15px]"
                style={{ backgroundColor: deparmentColors[task.department.id] }}
              >
                <p className="text-[16px] font-firago font-normal text-center">
                  {task.department.name.length > 7
                    ? `${task.department.name.substring(0, 7)}...`
                    : task.department.name}
                </p>
              </div>
            </div>
            <div>
              <h1 className="font-inter font-semibold text-[34px]">
                {task.name}
              </h1>
            </div>
            <div>
              <p className="text-[18px]/[1.5] mt-[14px] font-firago">
                {task?.description || ""}
              </p>
            </div>
          </div>
          <div className="w-[493px] flex flex-col gap-[18px] mt-[63px]">
            <div>
              <h2 className="font-firago font-medium text-[24px]">
                დავალების დეტალები
              </h2>
            </div>
            <div className="flex flex-col">
              <div className="py-[10px] flex flex-row justify-between">
                <div className="flex flex-row items-center gap-[6px]">
                  <img src={pieChart} width={24} height={24} />
                  <p className="font-firago text-[16px]/[1.5]">სტატუსი</p>
                </div>

                {/* Status Dropdown */}
                <div
                  className="relative w-[184px] font-normal"
                  ref={dropdownRef}
                >
                  <div
                    className={`w-full h-[42px] flex flex-row justify-between items-center ${
                      activeDropdown === "სტატუსი"
                        ? "rounded-tl-md rounded-tr-md"
                        : "rounded-md"
                    } border border-customGrayAlt cursor-pointer px-[10px] py-[12.5px] relative`}
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === "სტატუსი" ? "" : "სტატუსი"
                      )
                    }
                  >
                    <div>
                      <p className="font-firago text-[14px]/[1.5] font-normal">
                        {task.status.name}
                      </p>
                    </div>
                    <div>
                      {activeDropdown === "სტატუსი" ? (
                        <img src={Dropdown_active} height="14px" width="14px" />
                      ) : (
                        <img
                          src={Dropdown_passive}
                          height="14px"
                          width="14px"
                        />
                      )}
                    </div>

                    {activeDropdown === "სტატუსი" && (
                      <div className="left-[-1px] bottom-0 translate-y-full rounded-bl-md rounded-br-md flex flex-col absolute z-50 w-full border border-customGrayAlt overflow-hidden">
                        <div className="max-h-[200px] overflow-y-auto">
                          {statuses &&
                            statuses.map((status) => (
                              <div
                                key={status.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Update status in backend through API
                                  handleStatusChange(status.id);
                                  setActiveDropdown("");
                                }}
                                className="w-full bg-white px-[10px] py-[12.5px] hover:bg-gray-50"
                              >
                                <p>{status.name}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="py-[10px] flex flex-row justify-between">
                <div className="flex flex-row items-center gap-[6px]">
                  <img src={user} width={24} height={24} />
                  <p className="font-firago text-[16px]/[1.5]">თანამშრომელი</p>
                </div>
                <div className="font-firago text-[14px]/[1.5] font-normal flex flex-row items-center gap-3">
                  <div>
                    <img
                      src={task.employee.avatar}
                      alt="Employee avatar"
                      className="rounded-full w-[31px] h-[31px] object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-right">
                    <p className="text-[11px] font-light font-firago text-[#474747]">
                      {task.employee.department.name}
                    </p>
                    <p>
                      {task.employee.name} {task.employee.surname}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-[10px] flex flex-row justify-between">
                <div className="flex flex-row items-center gap-[6px]">
                  <img src={calendar} width={24} height={24} />
                  <p className="font-firago text-[16px]/[1.5]">
                    დავალების ვადა
                  </p>
                </div>
                <div className="font-firago text-[14px]/[1.5] font-normal">
                  <p>{formatDate(task.due_date)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-[0.3px] border-[#DDD2FF] bg-[#F8F3FEA6]/[65%] w-[714px] rounded-[10px] px-[45px] pt-[40px] pb-[52px]">
          {id && <CommentSection taskId={+id} />}
        </div>
      </div>
    </div>
  );
}
