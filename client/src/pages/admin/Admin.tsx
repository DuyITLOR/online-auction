import React from "react";
import Dashboard from "./Dashboard";
import { AdminProvider } from "@/libs/contexts/admin/admin.context";

const Admin: React.FC = () => {
  return (
    <AdminProvider>
      <Dashboard />
    </AdminProvider>
  );
};
export default Admin;
