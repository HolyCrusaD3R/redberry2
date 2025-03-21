import { Link } from "react-router-dom";
import Hourglass from "../assets/Hourglass.svg";
import ModalAgent from "./ModalAgent";
import { useState, useEffect } from "react";
import add from "../assets/add.svg";

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
            <h1 className="text-primary text-[31px] font-fredoka font-bold">
              Momentum
            </h1>
            <img
              src={Hourglass}
              alt="Hourglass Icon"
              className="w-[38px] h-[38px]"
            />
          </div>
        </Link>
        <div className="flex flex-row items-center gap-[40px]">
          <div
            className="w-[225px] h-[39px] rounded-[5px] bg-white border border-primary hover:border-secondary flex flex-row justify-center gap-[6.58px] items-center cursor-pointer"
            onMouseEnter={() => handleHoverSecondary(true)}
            onMouseLeave={() => handleHoverSecondary(false)}
            onClick={handleShowModalToggle}
          >
            <div
              className={`font-firago text-base/[16px] whitespace-nowrap px-[20px] py-[10px] ${
                hoveredSecondary ? "" : ""
              }`}
            >
              <p>თანამშრომლის შექმნა</p>
            </div>
          </div>
          <Link to={"/new-task"}>
            <div className="h-[39px] rounded-[5px] bg-primary hover:bg-secondary text-white border border-primary hover:border-secondary flex flex-row justify-center gap-[6.58px] items-center cursor-pointer">
              <div
                className={`font-firago  flex flex-row items-center text-base/[16px] whitespace-nowrap px-[20px] py-[10px]`}
              >
                <img src={add} width={20} height={20} />
                <p>შექმენი ახალი დავალება</p>
              </div>
            </div>
          </Link>
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
