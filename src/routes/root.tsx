import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
<<<<<<< Updated upstream
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Chart from "chart.js/auto"
import { CategoryScale } from "chart.js";
import { Data } from "@/utils/Data.js";
import { useState } from "react"
import LandingChart from "../components/landingChart.jsx";

Chart.register(CategoryScale);

export default function Root() {
  const [chartData, setChartData] = useState({
    labels: Data.map((data: any) => data.year), 
    datasets: [
      {
        label: "Users Gained ",
        data: Data.map((data: any) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "&quot;#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0"
        ],
        borderColor: "black",
        borderWidth: 2
      }
    ]
  });
=======

export default function Root() {
  const items = [
    "Shared Data Standard",
    "IoT Network of Connected Devices",
    "Authenticated Inventory Tracking System",
    "Base Layer for a Smart Economic Stack",
  ];
>>>>>>> Stashed changes

  return (
    <div className="p-6 min-h-screen">
      <Link
        to="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 z-10"
      >
        <img src="/white-small.png" alt="Pomerene" className="rounded-full h-10" />
      </Link>
      <Link
        to="/signup"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8 z-10"
        )}
      >
        Sign Up
      </Link>
      <div className="flex flex-col w-100 mt-20 md:mt-28 justify-start items-center">
        <img src="/white-logo.png" alt="Pomerene" className="rounded md:w-1/2 w-full" />
      </div>

      <div className="container mx-auto mt-10 px-4 xl:py-8">
        <h1 className="text-6xl font-bold text-center mb-6">Securing $13 Trillion in Global Trade</h1>

        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pomerene is a</h2>
          <div className="flex flex-col xl:flex-row w-full xl:justify-between space-y-6 xl:space-y-0 items-center justify-center py-2">
            {items.map((feature, index) => (
              <div key={index} className="min-w-max bg-white shadow rounded-lg p-4">
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sticky top-[100vh] flex w-full justify-center items-center">
        <a href="https://twitter.com/PomereneNetwork">
          Twitter
        </a>
      </div>
    </div>
  );
}
