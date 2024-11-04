import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Marker, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAuth } from "@/contexts/useAuth";

interface ItemLocation {
  name: string;
  message: string;
}

interface MapComponentProps {
  width?: string;
  height?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  width = "100vw",
  height = "40vh",
}) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [items, setItems] = useState<ItemLocation[]>([]);
  const { currentUser } = useAuth();

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

        const resp = await fetch(`${import.meta.env.VITE_API_URL}/item/map`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });

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

    const bounds = new mapboxgl.LngLatBounds();
    let hasValidMarkers = false;

    items.forEach((item) => {
      // Add validation checks
      if (!item?.message) {
        console.warn(`Missing message for item "${item?.name}"`);
        return;
      }

      // Parse the message to extract latitude and longitude
      const coordinates = item.message.split(",");
      if (coordinates.length !== 2) {
        console.warn(
          `Invalid coordinate format for item "${item.name}": ${item.message}`
        );
        return;
      }

      const latitude = parseFloat(coordinates[0]);
      const longitude = parseFloat(coordinates[1]);

      if (isNaN(latitude) || isNaN(longitude)) {
        console.warn(
          `Invalid coordinates for item "${item.name}": ${item.message}`
        );
        return;
      }

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
      bounds.extend([longitude, latitude]);
      hasValidMarkers = true;
    });

    // Only adjust bounds if we have valid markers
    if (hasValidMarkers) {
      mapRef.current.fitBounds(bounds, { padding: 50 });
    }
  }, [items]);

  return (
    <div id="map" style={{ width: width, height: height }} className="w-full" />
  );
};

export default MapComponent;
