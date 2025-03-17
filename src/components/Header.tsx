import { Link } from "react-router-dom";
import Hourglass from "../assets/Hourglass.svg";

function Header() {
  return (
    <div className="w-full h-[100px]">
      <div className="w-[1680px] mx-auto my-[31px]">
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
      </div>
    </div>
  );
}

export default Header;
