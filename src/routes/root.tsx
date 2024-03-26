import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
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

  return (
    <div className="p-6">
      <Link
        to="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
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
      <div className="flex flex-col w-100 justify-start items-center">
        <img src="/pomerene-hero2.png" alt="Pomerene" className="w-full xl:w-1/2 filter grayscale hover:scale-110 transition-transform duration-500 ease-in-out" />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 hover:text-yellow-300 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white p-4 mt-2 mb-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
          Pomerene 
        </h1>
        <h2 className="text-xl mt-4 font-thin"><span className="text-2xl font-bold">Triple</span> Entry International Trade. Securing a $12 Trillion Industry</h2>
      </div>
      <div className="relative flex md:mt-16 space-y-10 flex-col justify-center items-center">
        <img src="/pomerene-bg2.png" alt="Background" className="absolute z-[-1] w-full h-full object-cover top-0 left-0" />
        <Card className="md:mr-20 hover:scale-110 max-w-4xl transition-transform duration-50 ease-in-out">
          <CardHeader>
            <CardTitle>The Future of Trade Financing</CardTitle>
            <CardDescription>Automating Contracts and Financing the Future</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Looking ahead, our platform will facilitate automated contracts from order to delivery, addressing critical challenges in invoicing and payments. By integrating insurance and trade finance contracts into our ecosystem, we pave the way for decentralized funding and market mechanisms through DeFi. This evolution promises to significantly improve working capital management, potentially giving rise to a sustainable DeFi FX and futures market driven by real-world trade needs, a first in the DeFi space.</p>
          </CardContent>
        </Card>
        <Card className="hover:scale-110 max-w-4xl transition-transform duration-50 ease-in-out">
          <CardHeader>
            <CardTitle>Smart Trade Networks</CardTitle>
            <CardDescription>Revolutionizing International Trade with Smart Technology</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Our platform leverages passive UHF RFID tags, dock-mounted RFID readers with GPS, and container tracking to automate and secure international trade. By equipping hardware devices with unique keypairs for transaction authentication, we ensure data integrity and trust across the supply chain. The open protocol aims to transform the fragmented, analog market of international trade into a streamlined, transparent ecosystem, enhancing efficiency and reliability for all stakeholders.</p>
          </CardContent>
        </Card>
        <Card className="md:mr-20 hover:scale-110 max-w-4xl transition-transform duration-50 ease-in-out">
          <CardHeader>
            <CardTitle>Transparent Inventory Management</CardTitle>
            <CardDescription>Unlocking Efficiency in Inventory and Capital</CardDescription>
          </CardHeader>
          <CardContent>
            <p>We bring unprecedented transparency and assurance to inventory management, traditionally the most significant component of working capital in trade. Our solution allows for real-time visibility and control over inventory, drastically reducing uncertainties and inefficiencies. Participants in the network can opt to share data securely and earn rewards, fostering a collaborative environment that benefits all. Our innovative approach not only improves day-to-day operations but also opens avenues for subscription-based data services targeting major enterprises and hedge funds.</p>
          </CardContent>
        </Card>
      </div>
      <div>
        <h1 className="text-4xl font-bold text-center mt-16">Meet the Team</h1>
        <div className="relative flex md:mt-16 space-y-10 flex-col md:flex-row md:space-x-6 p-6 rounded justify-center items-center">
          <img src="/pomerene-bg3.png" alt="Background" className="absolute z-[-1] w-full h-full object-cover top-0 left-0" />
          <Card className="max-w-sm">
            <img src="https://placehold.co/600x400" alt="Conner Jensen" className="w-full h-56 object-cover" />
            <div className="p-5">
              <CardHeader className="text-lg font-semibold">Conner Jensen</CardHeader>
              <CardContent>
                <p>Software Dev</p>
              </CardContent>
            </div>
          </Card>
          <Card className="max-w-sm">
            <img src="https://placehold.co/600x400" alt="Conner Jensen" className="w-full h-56 object-cover" />
            <div className="p-5">
              <CardHeader className="text-lg font-semibold">Tim Hobbs</CardHeader>
              <CardContent>
                <p>Business Development/Software Architecture</p>
              </CardContent>
            </div>
          </Card>
          <Card className="max-w-sm">
            <img src="https://placehold.co/600x400" alt="Conner Jensen" className="w-full h-56 object-cover" />
            <div className="p-5">
              <CardHeader className="text-lg font-semibold">Russell Brouillard</CardHeader>
              <CardContent>
                <p>Software Dev</p>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
