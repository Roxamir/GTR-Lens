import { Outlet } from "react-router-dom";
import NavBar from "../components/layout/NavBar";

const Root = () => {
  return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col items-center">
      <NavBar />
      <main className="pt-16 w-full flex-grow flex justify-center">
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
