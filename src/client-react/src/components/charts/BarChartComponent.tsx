import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import Chart from "react-apexcharts";

interface Props {
  title: string;
  data: number[];
  categories: string[];
  color?: string;
  percentageChange?: number;
}

const BarChartComponent: React.FC<Props> = ({
  title,
  data,
  categories,
  color = "#6366f1",
  percentageChange,
}) => {
  const options: any = {
    chart: {
      id: "bar-chart",
      toolbar: { show: false },
    },
    colors: [color],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categories || [],
      labels: { style: { colors: "#9ca3af", fontSize: '10px' } },
    },
    yaxis: {
      labels: { style: { colors: "#9ca3af", fontSize: '10px' } },
    },
    grid: {
      show: true,
      borderColor: "#f3f4f6",
    },
  };

  const series = [
    {
      name: title,
      data: data || [],
    },
  ];

  return (
    <div className="p-4 rounded-2xl shadow-sm w-full bg-white border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-800 text-sm font-semibold uppercase tracking-wider">{title}</h2>
        {percentageChange !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
              percentageChange >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}
          >
            {percentageChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(percentageChange)}%
          </div>
        )}
      </div>
      <div className="min-h-[300px]">
        <Chart options={options} series={series} type="bar" height={300} />
      </div>
    </div>
  );
};

export default BarChartComponent;
