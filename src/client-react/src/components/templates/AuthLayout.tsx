import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";

export default function AuthLayout() {
  return (
    <MainLayout>
      <div className="px-6 py-2 rounded-lg shadow-md">
        <Outlet />
      </div>
    </MainLayout>
  );
}
