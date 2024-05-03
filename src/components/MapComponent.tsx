import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import { useAuth } from "@/contexts/useAuth";

interface MapComponentProps {
  latitude: number;
  longitude: number;
  itemPublicKey: string;
  scannerPublicKey: string;
  timestamp: number;
  sig: string;
}
const MapComponent: React.FC<{ data: MapComponentProps[] }> = ({ data }) => {
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

    console.log("data", data)

    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center:
        data.length > 0
          ? [data[0].longitude, data[0].latitude]
          : [-111.237, 40.626], // initial center position [lng, lat]
      zoom: 12, // initial zoom
      attributionControl: false,
    });

    try {
      // Parse data and add markers
      data.forEach((item: MapComponentProps) => {
        const content = `
<div > 
<p class="text-sm text-gray-600 font-bold mt-1">${new Date(
          item.timestamp * 1000
        ).toLocaleString()}</p>
 
  <p class="text-xsm text-gray-600 mt-1">${item.latitude}, ${item.longitude}</p>
  
  <p class="text-xsm text-gray-600 mt-1  break-words">item: ${
    item.itemPublicKey
  }</p> 
  <p class="text-xsm text-gray-600 mt-1  break-words">scanner: ${
    item.scannerPublicKey
  }</p> 
 
</div>`;

        // Create a marker and add it to the map
        new mapboxgl.Marker()
          .setLngLat([item.longitude, item.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(content)
          )
          .addTo(map);
      });
    } catch (error) {
      console.error("Failed to fetch event items:", error);
    }

    return () => map.remove();
  }, []);

  return (
    <div
      id="map"
      style={{ width: "100vw", height: "40vh" }}
      className="w-full"
    />
  );
};

export default MapComponent;
