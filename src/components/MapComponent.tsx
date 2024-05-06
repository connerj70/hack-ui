import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ItemType } from "@/types/itemTypes";

const MapComponent: React.FC<{ data: ItemType[] }> = ({ data }) => {
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

    console.log("data", data);

    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [-111.237, 40.626], // initial center position [lng, lat]
      zoom: 2, // initial zoom
      attributionControl: false,
    });

    try {
      // Parse data and add markers
      data.forEach((item) => {
        const coords = item.lastTransaction.memo.match(
          /(\d+\.\d+),\s*(-?\d+\.\d+)/
        );
        if (!coords) return;

        const latitude = parseFloat(coords[1]);
        const longitude = parseFloat(coords[2]);
        const link = `https://explorer.solana.com/tx/${item.lastTransaction.signature}?cluster=devnet`;
        const content = `
          <div>
         
          <p class="text-sm  font-bold mt-1">${item.description}</p>
          <a href="${link}" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:underline center">Last Transaction</a>
          <p class="text-sm text-gray-600 font-bold mt-1">${new Date(
            item.lastTransaction.blockTime * 1000
          ).toLocaleString()}</p>
          </div>`;

        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(content))
          .addTo(map);
      });
    } catch (error) {
      console.error("Failed to fetch event items:", error);
    }

    return () => map.remove();
  }, [data]);

  return (
    <div
      id="map"
      style={{ width: "100vw", height: "40vh" }}
      className="w-full"
    />
  );
};

export default MapComponent;
