import React from "react";
import Table from "@/components/layout/Table";
import { useGetAllUsersQuery } from "@/store/apis/UserApi";
import { motion } from "framer-motion";
import { Users, Loader2, AlertCircle } from "lucide-react";
import ToggleableText from "@/components/atoms/ToggleableText";

const UsersDashboard = () => {
  const { data, isLoading, error } = useGetAllUsersQuery(undefined);
  const users = data?.users || [];

  const columns = [
    {
      key: "id",
      label: "User ID",
      render: (row: any) => (
        <span className="text-sm text-gray-600 font-mono">
          <ToggleableText content={row?.id || "N/A"} truncateLength={5} />
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row: any) => <span className="text-sm font-medium text-gray-800">{row.name}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (row: any) => <span className="text-sm text-blue-600">{row.email}</span>,
    },
    {
      key: "role",
      label: "Role",
      render: (row: any) => (
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
          {row.role}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <Users className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12 text-red-600">
          <AlertCircle className="h-8 w-8 mr-2" />
          <span>Error loading users. (Check backend connection)</span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <Table data={users} columns={columns} isLoading={isLoading} />
        </motion.div>
      )}
    </div>
  );
};

export default UsersDashboard;
