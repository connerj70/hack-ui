"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define the TypeScript interfaces for your data
interface LastTransaction {
  digest: string;
  timestampMs: string;
  checkpoint: string;
}

interface EventDetails {
  combinedSignature: string;
  id: {
    id: string;
  };
  itemAddress: string;
  message: string;
  scannerAddress: string;
  url: string;
  lastTransaction: LastTransaction;
}

// Define the props for GraphComponent
interface GraphComponentProps {
  rawData: EventDetails[];
}

// Function to process raw data into chart data
const processChartData = (data: EventDetails[]) => {
  const dateCounts: { [key: string]: number } = {};

  data.forEach((item) => {
    if (item.lastTransaction && item.lastTransaction.timestampMs) {
      const timestamp = parseInt(item.lastTransaction.timestampMs, 10);
      if (!isNaN(timestamp)) {
        const date = new Date(timestamp).toISOString().split("T")[0]; // YYYY-MM-DD

        if (dateCounts[date]) {
          dateCounts[date] += 1;
        } else {
          dateCounts[date] = 1;
        }
      }
    }
  });

  // Convert to array suitable for chart
  const chartData = Object.keys(dateCounts)
    .map((date) => ({
      date,
      events: dateCounts[date],
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return chartData;
};

// Define your chart configuration
const chartConfig: ChartConfig = {
  views: {
    label: "Events",
  },
  events: {
    label: "Events",
    color: "#8884d8", // Replace with a static color or ensure CSS variable is defined
  },
};

const GraphComponent: React.FC<GraphComponentProps> = ({ rawData }) => {
  // Process the raw data to chartData
  const chartData = React.useMemo(() => processChartData(rawData), [rawData]);

  const total = React.useMemo(
    () => ({
      events: rawData.length,
    }),
    [rawData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total events for the selected period
          </CardDescription>
        </div>
        <div className="flex">
          {(["events"] as (keyof typeof total)[]).map((key) => {
            return (
              <button
                key={key}
                data-active={true} // Single button, always active
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => {}} // No action needed for single category
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[key].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="events"
                    labelFormatter={(value: string) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey="events" fill={chartConfig.events.color} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default GraphComponent;
