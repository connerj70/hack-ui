import MapComponent from "@/components/MapComponent";
import { useEffect } from "react";

export default function Explore() {
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/list"
      );
      const data = await response.json();
      console.log(data);
    }

    fetchData();
  });
  return (
    <MapComponent data={[]} width={"100vw"} height={"100vh"} />
  );
}
