import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Marker, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAuth } from "@/contexts/useAuth";
import { useParams } from "react-router-dom";

interface ItemLocation {
  name: string;
  message: string;
}

interface MapComponentProps {
  width?: string;
  height?: string;
}

const MapComponentScanner: React.FC<MapComponentProps> = ({
  width = "100vw",
  height = "40vh",
}) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const lineRef = useRef<mapboxgl.GeoJSONSource | null>(null);
  const [items, setItems] = useState<ItemLocation[]>([]);
  const { currentUser } = useAuth();
  const params = useParams();

  useEffect(() => {
    if (!mapRef.current) {
      const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      if (!mapboxToken) {
        console.error("Mapbox access token is not set.");
        return;
      }

      mapboxgl.accessToken = mapboxToken;
      mapRef.current = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-111.237, 40.626],
        zoom: 2,
        attributionControl: false,
      });

      // Add the line source and layer when the map loads
      mapRef.current.on("load", () => {
        mapRef.current?.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [],
            },
          },
        });

        mapRef.current?.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#888",
            "line-width": 3,
            "line-dasharray": [2, 1], // Optional: creates a dashed line
          },
        });

        lineRef.current = mapRef.current?.getSource(
          "route"
        ) as mapboxgl.GeoJSONSource;
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
    const fetchData = async () => {
      try {
        const jwt = await currentUser?.getIdToken();

        const resp = await fetch(
          `${import.meta.env.VITE_API_URL}/item/map/${params.pubKey}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        if (!resp.ok) {
          throw new Error(`Failed to fetch items: ${resp.statusText}`);
        }

        const body = await resp.json();
        setItems(body);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchData();
  }, [currentUser]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Collect valid coordinates for the line
    const coordinates: [number, number][] = [];

    items.forEach((item) => {
      if (!item?.message) {
        console.warn(`Missing message for item "${item?.name}"`);
        return;
      }

      const coords = item.message.split(",");
      if (coords.length !== 2) {
        console.warn(
          `Invalid coordinate format for item "${item.name}": ${item.message}`
        );
        return;
      }

      const latitude = parseFloat(coords[0]);
      const longitude = parseFloat(coords[1]);

      if (isNaN(latitude) || isNaN(longitude)) {
        console.warn(
          `Invalid coordinates for item "${item.name}": ${item.message}`
        );
        return;
      }

      // Add coordinates for the line
      coordinates.push([longitude, latitude]);

      // Create a popup with the item's name
      const popup = new Popup({ offset: 25 }).setText(
        item.name || "Unnamed Location"
      );

      // Create a marker and add it to the map
      const marker = new Marker({ color: "#FF0000" })
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);

      // Store the marker for future cleanup
      markersRef.current.push(marker);
    });

    // Update the line on the map if we have coordinates and the line source is ready
    if (coordinates.length >= 2 && lineRef.current) {
      lineRef.current.setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: coordinates,
        },
      });
    }
  }, [items]);

  return (
    <div id="map" style={{ width: width, height: height }} className="w-full" />
  );
};

export default MapComponentScanner;
