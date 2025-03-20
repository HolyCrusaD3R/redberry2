import Header from "../components/Header";
import TaskPage from "../components/TaskPage";
import { FilterProvider } from "../contexts/FilterContext";

function HomePage() {
  return (
    <>
      <Header />
      <FilterProvider>
        <TaskPage />
      </FilterProvider>
    </>
  );
}

export default HomePage;
