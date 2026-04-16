import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-content-wrapper">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
