import MapComponent from "@/components/MapComponent";
import { ItemType } from "@/types/itemTypes";
import { useEffect, useState } from "react";

export default function Explore() {
  const [items, setItems] = useState<ItemType[]>([]);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/item/explore`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data.items);
      setItems(data.items);
    }

    fetchData();
  }, []);
  return <MapComponent data={items} width={"100vw"} height={"100vh"} />;
}
