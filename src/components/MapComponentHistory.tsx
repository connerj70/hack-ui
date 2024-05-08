import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Feature, LineString } from "geojson";

interface GeoJSONFeature {
  type: "Feature";
  properties: any;
  geometry: LineString;
}

interface MapData {
  blockTime: number;
  confirmationStatus: string;
  err: null | string;
  memo: string;
  signature: string;
  slot: number;
}

interface MapComponentProps {
  data: MapData[];
  width?: string;  // default to "100vw" if not provided
  height?: string; // default to "40vh" if not provided
}

const MapComponentHistory: React.FC<MapComponentProps> = ({data, width = "100vw", height = "40vh" }) => {
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-111.7943618, 40.6959141],
      zoom: 2,
      attributionControl: false,
    });

    map.on("load", () => {
      // Collect coordinates from data for the line
      const coordinates = data
        .map((item) => {
          const matchResults = item.memo.match(/[\w.:-]+/g);
          if (matchResults) {
            const [, , , lat, lng] = matchResults; // Skip the first two matches
            return [parseFloat(lng), parseFloat(lat)];
          }
          return [0, 0]; // Default fall back to [0, 0] if no match
        })
        .filter((coord) => coord[0] !== 0 && coord[1] !== 0); // Filter out default coordinates

      // Define a GeoJSON object for the line
      const lineData: GeoJSONFeature = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: coordinates,
        },
      };

      // Add lineData as a source to the map
      map.addSource("lineSource", {
        type: "geojson",
        data: lineData as Feature<LineString>,
      });

      // Add a layer to display the line
      map.addLayer({
        id: "lineLayer",
        type: "line",
        source: "lineSource",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff0000", // Red line
          "line-width": 5,
        },
      });

      // Add markers and popups to the map for each data item
      data.forEach((item) => {
        const matchResults = item.memo.match(/[\w.:-]+/g);
        if (matchResults) {
          const [, , , lat, lng] = matchResults;
          const latitude = parseFloat(lat);
          const longitude = parseFloat(lng);
          const link = `https://explorer.solana.com/tx/${item.signature}?cluster=devnet`;

          const content = `
            <div>
              <p><strong>Timestamp:</strong> ${new Date(
                item.blockTime * 1000
              ).toLocaleString()}</p>
              <p><strong>Latitude:</strong> ${latitude}</p>
              <p><strong>Longitude:</strong> ${longitude}</p>
              <a href="${link}" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:underline center">Solana Transaction</a>
          
            </div>`;

          new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(content))
            .addTo(map);
        }
      });
    });

    return () => map.remove(); // Clean up the map instance on unmount
  }, [data]);

  return <div id="map" style={{ width: width, height: height }} className="w-full" />;
};

export default MapComponentHistory;
