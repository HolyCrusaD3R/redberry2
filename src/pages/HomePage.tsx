import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      Hello <Link to={"/about"}>About</Link>
    </>
  );
}

export default HomePage;
