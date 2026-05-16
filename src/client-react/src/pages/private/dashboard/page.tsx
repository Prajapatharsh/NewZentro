import React from "react";
import StatsCard from "@/components/organisms/StatsCard";
import { BarChart2, DollarSign, LineChart, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client/react/index.js";
import { GET_ANALYTICS_OVERVIEW } from "@/gql/Dashboard";
import CustomLoader from "@/components/feedback/CustomLoader";
import useFormatPrice from "@/hooks/ui/useFormatPrice";

const Dashboard = () => {
  const formatPrice = useFormatPrice();
  const { data, loading, error } = useQuery(GET_ANALYTICS_OVERVIEW, {
    variables: { params: { timePeriod: "allTime" } },
  });

  if (loading) return <CustomLoader />;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-semibold">Dashboard Overview (Stats Mode)</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(data?.revenueAnalytics?.totalRevenue || 0)}
          percentage={data?.revenueAnalytics?.changes?.revenue}
          caption="since last period"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Sales"
          value={data?.orderAnalytics?.totalSales || 0}
          percentage={data?.orderAnalytics?.changes?.sales}
          caption="since last period"
          icon={<BarChart2 className="w-5 h-5" />}
        />
        <StatsCard
          title="Interactions"
          value={data?.interactionAnalytics?.totalInteractions || 0}
          percentage={0}
          caption="all interactions"
          icon={<LineChart className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Users"
          value={data?.userAnalytics?.totalUsers || 0}
          percentage={data?.userAnalytics?.changes?.users}
          caption="since last period"
          icon={<Users className="w-5 h-5" />}
        />
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Backend error: {error.message}
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
