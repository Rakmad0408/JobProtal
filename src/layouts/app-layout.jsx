import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      <div className="p-8 text-center bg-gray-800 mt-10">
        Made by ORGANIZATION 😎
      </div>
    </div>
  );
};

export default AppLayout;
