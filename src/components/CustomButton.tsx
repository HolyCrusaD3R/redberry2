import { useState } from "react";

interface CustomButtonProps {
  children: React.ReactNode;
  isPrimary: boolean; // Changed from string to boolean
  width?: string | number;
  height?: string | number;
  onSubmit?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClose?: () => void;
  disabled?: boolean; // Added disabled prop
}

function CustomButton({
  children,
  isPrimary,
  width,
  height,
  onSubmit,
  onClose,
  disabled = false, // Default disabled to false
}: CustomButtonProps) {
  const [hovered, setHover] = useState<boolean>(false);

  const handleHover = (hover: boolean): void => {
    setHover(hover);
  };

  // Define styles based on props
  const borderColor =
    isPrimary && hovered ? "border-primary" : "border-secondary";
  const backgroundColor = !isPrimary
    ? hovered
      ? "border-secondary"
      : "border-primary"
    : hovered
    ? "bg-primary text-white"
    : "bg-secondary text-white";
  const textColor = !isPrimary && !hovered ? "" : "";
  const cursorStyle = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <div
      className={`py-[11.5px] px-4 text-base font-firago font-normal border rounded-[5px] flex flex-row items-center 
        ${borderColor} ${backgroundColor} ${textColor} ${cursorStyle} text-nowrap`}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      style={{ width, height }}
      onClick={!disabled ? (isPrimary ? onSubmit : onClose) : undefined}
    >
      <p>{children}</p>
    </div>
  );
}

export default CustomButton;
