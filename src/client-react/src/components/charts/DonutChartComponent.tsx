import React from "react";
import Chart from "react-apexcharts";

interface Props {
  title: string;
  data: number[];
  labels: string[];
  colorScheme?: string[];
}

const DonutChartComponent: React.FC<Props> = ({
  title,
  data,
  labels,
  colorScheme = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#6366f1", "#ec4899"],
}) => {
  const options: any = {
    chart: {
      id: "donut-chart",
    },
    colors: colorScheme,
    dataLabels: { enabled: true },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },
    legend: {
      position: "bottom",
      labels: { colors: "#6b7280" },
    },
    tooltip: { theme: "light" },
    labels: labels || [],
  };

  const series = data || [];

  return (
    <div className="p-4 rounded-2xl shadow-sm w-full bg-white border border-gray-100">
      <h2 className="text-gray-800 text-sm font-semibold uppercase tracking-wider mb-4">{title}</h2>
      <div className="min-h-[250px] flex justify-center">
        <Chart options={options} series={series} type="donut" height={250} />
      </div>
    </div>
  );
};

export default DonutChartComponent;
