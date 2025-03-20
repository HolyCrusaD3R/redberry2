import { Link } from "react-router-dom";
import Hourglass from "../assets/Hourglass.svg";
import ModalAgent from "./ModalAgent";
import { useState, useEffect } from "react";

function Header() {
  const [modalShowed, setModalShowed] = useState(false);
  const [hoveredSecondary, setHoveredSecondary] = useState(false);

  useEffect(() => {
    document.body.style.overflow = modalShowed ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalShowed]);

  const handleShowModalToggle = () => {
    setModalShowed((prev) => !prev);
  };

  const handleHoverSecondary = (hovered: boolean) => {
    setHoveredSecondary(hovered);
  };

  return (
    <div className="w-full h-[100px]">
      <div className="w-[1680px] mx-auto my-[31px] flex justify-between items-center">
        <Link to={"/"}>
          <div className="flex flex-row items-center">
            <h1 className="text-primary text-[31px] font-fredoka font-normal">
              Momentum
            </h1>
            <img
              src={Hourglass}
              alt="Hourglass Icon"
              className="w-[38px] h-[38px]"
            />
          </div>
        </Link>
        <div
          className="w-[225px] h-[39px] rounded-[5px] bg-white border border-primary hover:border-secondary flex flex-row justify-center gap-[6.58px] items-center cursor-pointer"
          onMouseEnter={() => handleHoverSecondary(true)}
          onMouseLeave={() => handleHoverSecondary(false)}
          onClick={handleShowModalToggle}
        >
          <div
            className={`font-firaGo text-base/[16px] whitespace-nowrap px-[20px] py-[10px] ${
              hoveredSecondary ? "" : ""
            }`}
          >
            <p>თანამშრომლის შექმნა</p>
          </div>
        </div>
        {modalShowed && (
          <ModalAgent
            onClose={() => setModalShowed(false)}
            onSubmit={() => {
              setModalShowed(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Header;
