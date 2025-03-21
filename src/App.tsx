import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewTaskPage from "./pages/NewTaskPage";
import TaskUnitPage from "./pages/TaskUnitPage";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/task/:id", element: <TaskUnitPage /> },
  { path: "/new-task", element: <NewTaskPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
