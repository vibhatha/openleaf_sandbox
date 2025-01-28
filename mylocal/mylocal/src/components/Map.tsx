import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from './Map.module.css';

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      // Initialize the map centered on Sri Lanka with a closer zoom level
      const map = L.map(mapRef.current).setView([7.8731, 80.7718], 7.5);

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap contributors",
        className: "map-tiles"
      }).addTo(map);

      // Clean up the map on component unmount
      return () => {
        map.remove();
      };
    }
  }, []);

  return <div ref={mapRef} style={{ height: "100vh", width: "100%", position: "relative" }}></div>;
};

export default Map;
