import React from "react";
import StatsCard from "@/components/organisms/StatsCard";
import { DollarSign, ShoppingCart, BarChart2, Users, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client/react/index.js";
import { GET_ALL_ANALYTICS } from "@/gql/Dashboard";
import CustomLoader from "@/components/feedback/CustomLoader";
import ListCard from "@/components/organisms/ListCard";
import useFormatPrice from "@/hooks/ui/useFormatPrice";

const AnalyticsDashboard = () => {
  const formatPrice = useFormatPrice();
  const { data, loading, error } = useQuery(GET_ALL_ANALYTICS, {
    variables: { params: { timePeriod: "allTime" } },
  });

  if (loading) return <CustomLoader />;

  const topItems = data?.productPerformance?.slice(0, 10).map((p: any) => ({
    id: p.id,
    name: p.name,
    quantity: p.quantity,
    revenue: formatPrice(p.revenue),
  })) || [];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(data?.revenueAnalytics?.totalRevenue || 0)}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Orders"
          value={data?.orderAnalytics?.totalOrders || 0}
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Users"
          value={data?.userAnalytics?.totalUsers || 0}
          icon={<Users className="w-5 h-5" />}
        />
        <StatsCard
          title="Average Order"
          value={formatPrice(data?.orderAnalytics?.averageOrderValue || 0)}
          icon={<CreditCard className="w-5 h-5" />}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <ListCard
          title="Top Performing Products"
          items={topItems}
          itemType="product"
          viewAllLink="/dashboard/products"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Backend error: {error.message}
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
