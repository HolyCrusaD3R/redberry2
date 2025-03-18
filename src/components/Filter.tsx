import { ReactNode } from "react";

interface FilterProps {
  content: string;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  [key: string]: any; // For rest props
}

function Filter({ content, children, isOpen, onToggle, ...rest }: FilterProps) {
  return (
    <>
      <div className="font-firaGo font-medium text-base/[19.2px] relative text-customBlue">
        <div
          className="h-full rounded-md flex flex-row gap-1 justify-center items-center py-2 px-[14px] dropdown cursor-pointer hover:bg-[#F3F3F3]"
          onClick={onToggle}
          {...rest}
        >
          <p>{content}</p>

          {!isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-[14px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-[14px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 15.75 7.5-7.5 7.5 7.5"
              />
            </svg>
          )}
        </div>

        <div className="dropdown">{isOpen ? children : null}</div>
      </div>
    </>
  );
}

export default Filter;
