import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAuth } from "@/contexts/useAuth";

const MapComponent: React.FC = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [-111.237, 40.626], // initial center position [lng, lat]
      zoom: 8, // initial zoom
    });

    const fetchDataAndAddMarkers = async () => {
      try {
        const jwt = await currentUser?.getIdToken();
        const resp = await fetch(
          `${import.meta.env.VITE_API_URL}/event/items`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Make sure you are sending the necessary authorization token
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        const data = await resp.json();
        console.log("Data:", data);

        // Parse data and add markers
        data.forEach((item: any) => {
          const input = item.memo.substring(
            item.memo.indexOf('"') + 1,
            item.memo.lastIndexOf('"')
          );

          // Now split the string by commas
          const parts = input.split(",");

          console.log("Parts:", parts);

          // Output the result to see what we have
          console.log(parts);
          if (parts.length !== 4) {
            return;
          }

          const lat = parts[2].split(":")[1];
          const lon = parts[3].split(":")[1];
          const latitude = parseFloat(lat);
          const longitude = parseFloat(lon);

          const content = `
<div class=" bg-white  rounded-lg max-w-xs"> 
  <h4 class="text-lg font-semibold">Transaction</h4>
  <p class="text-sm text-gray-600 mt-1">Time: ${new Date(
    item.blockTime * 1000
  ).toLocaleString()}</p>
  <p class="text-sm text-gray-600 mt-1 font-bold break-words">From: ${
    parts[0]
  }</p> <!-- Added break-words and font-bold -->
  <p class="text-sm text-gray-600 mt-1 font-bold break-words">To: ${
    parts[1]
  }</p> <!-- Added break-words and font-bold -->
  <p class="text-sm text-gray-600 mt-1">Lat: ${latitude.toFixed(
    6
  )}, Lng: ${longitude.toFixed(6)}</p>
</div>`;

          // Create a marker and add it to the map
          new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(content)
            )
            .addTo(map);
        });
      } catch (error) {
        console.error("Failed to fetch event items:", error);
      }
    };

    fetchDataAndAddMarkers();

    return () => map.remove();
  }, []);

  return <div id="map" style={{ width: "40vw", height: "40vh" }} />;
};

export default MapComponent;
