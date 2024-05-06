import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ItemType } from "@/types/itemTypes";

const MapComponent: React.FC<{ data: ItemType[] }> = ({ data }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Initialize the map only once
  useEffect(() => {
    if (!mapRef.current) { // Ensure the map isn't already initialized
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

      mapRef.current = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-111.237, 40.626],
        zoom: 2,
        attributionControl: false,
      });
    }

    // Clean up the map when the component is unmounted
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null; // Reset the ref post-removal
      }
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return; // Exit if map is not initialized

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    data.forEach(item => {
      if (!item.lastTransaction || !item.lastTransaction.memo) return;

      const coords = item.lastTransaction.memo.match(/(\d+\.\d+),\s*(-?\d+\.\d+)/);
      if (!coords) return;

      const latitude = parseFloat(coords[1]);
      const longitude = parseFloat(coords[2]);
      const link = `https://explorer.solana.com/tx/${item.lastTransaction.signature}?cluster=devnet`;
      const content = `
        <div>
          <p class="text-sm font-bold mt-1">${item.description}</p>
          <a href="${link}" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:underline center">Last Transaction</a>
          <p class="text-sm text-gray-600 font-bold mt-1">${new Date(item.lastTransaction.blockTime * 1000).toLocaleString()}</p>
        </div>`;

      const marker = new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(content))
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [data]); // Depend on 'data' to re-run this effect when 'data' changes

  return <div id="map" style={{ width: "100vw", height: "40vh" }} className="w-full" />;
};

export default MapComponent;
