import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import { ScannerType } from "@/types/scannerTypes";
// import { ItemType } from "@/types/itemTypes";

interface MapComponentProps {
  // data: ItemType[] | ScannerType[];
  width?: string; // default to "100vw" if not provided
  height?: string; // default to "40vh" if not provided
}

const MapComponent: React.FC<MapComponentProps> = ({
  // data,
  width = "100vw",
  height = "40vh",
}) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";
      mapRef.current = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-111.237, 40.626],
        zoom: 0,
        attributionControl: false,
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // data.forEach((item) => {
    // if (!item.lastTransaction || !item.lastTransaction.memo) return;

    // const coords = item.lastTransaction.memo.match(
    //   /(\d+\.\d+),\s*(-?\d+\.\d+)/
    // );
    // if (!coords) return;

    // const latitude = parseFloat(coords[1]);
    // const longitude = parseFloat(coords[2]);
    // const link = `https://explorer.solana.com/tx/${item.lastTransaction.signature}?cluster=devnet`;
    // const info = `/items/${item.public}`;
    // const content = `
    //   <div>
    //   <p class="text-sm text-gray-600 font-bold mt-1">${new Date(
    //     item.lastTransaction.blockTime * 1000
    //   ).toLocaleString()}</p>

    //     <a href="${link}" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:underline center">Last solana Transaction</a>
    //     <p class="text-sm font-bold mt-1">${item.description}</p>
    //     <a href="${info}" target="_blank" rel="noopener noreferrer" class="text-green-700 hover:underline center">info</a>

    //   </div>`;

    // const marker = new mapboxgl.Marker()
    //   .setLngLat([longitude, latitude])
    //   .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(content))
    //   .addTo(map);

    // markersRef.current.push(marker);
  });
  // }, [data]);

  return (
    <div id="map" style={{ width: width, height: height }} className="w-full" />
  );
};

export default MapComponent;
