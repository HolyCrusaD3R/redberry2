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
    isPrimary && hovered ? "border-customRedAlt" : "border-customRed";
  const backgroundColor = !isPrimary
    ? hovered
      ? "bg-customRed"
      : "bg-white"
    : hovered
    ? "bg-customRedAlt"
    : "bg-customRed";
  const textColor = !isPrimary && !hovered ? "text-customRed" : "text-white";
  const cursorStyle = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <div
      className={`py-[14px] px-4 text-base/[19.2px] font-firaGo font-medium border rounded-[10px] 
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
