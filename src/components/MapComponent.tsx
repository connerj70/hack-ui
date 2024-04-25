import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapComponent: React.FC = () => {
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [-111.237, 40.626], // starting position [lng, lat]
      zoom: 10, // starting zoom
    });

    // Add a marker
    new mapboxgl.Marker().setLngLat([-111.237, 40.626]).addTo(map);

    return () => map.remove();
  }, []);

  return <div id="map" style={{ width: "50vw", height: "50vh" }} />;
};

export default MapComponent;
