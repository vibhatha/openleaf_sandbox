import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from './Map.module.css';

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("provinces");

  useEffect(() => {
    if (!mapRef.current) return; // Ensure the map container exists

    // Initialize the map centered on Sri Lanka
    const map = L.map(mapRef.current).setView([7.8731, 80.7718], 7.5);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Utility function to load and display GeoJSON data
    const loadGeoJson = async (filePath: string, color: string) => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Network response was not ok for ${filePath}`);
        }
        const data: [number, number][][] = await response.json();

        // Convert each sub-array into a GeoJSON Feature
        const features: GeoJSON.Feature<GeoJSON.Polygon>[] = data.map((coordinates) => ({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinates], // Wrap in an array to match GeoJSON format
          },
          properties: {},
        }));

        // Create a FeatureCollection
        const geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
          type: "FeatureCollection",
          features: features,
        };

        // Add each feature to the map
        L.geoJSON(geoJsonData, {
          style: {
            color: color,
            weight: 2,
            fillOpacity: 0.1,
          },
          onEachFeature: (feature, layer) => {
            layer.on("click", () => {
              (layer as L.Path).setStyle({
                color: "blue",
                weight: 3,
                fillOpacity: 0.6,
              });
            });
          },
        }).addTo(map);
      } catch (error) {
        console.error(`Error loading GeoJSON data from ${filePath}:`, error);
      }
    };

    // Define categories and their corresponding file paths and colors
    const categories: Record<string, { path: string; color: string }[]> = {
      provinces: [
        { path: "/provinces/LK-1.json", color: "red" },
        { path: "/provinces/LK-2.json", color: "green" },
        { path: "/provinces/LK-3.json", color: "blue" },
        { path: "/provinces/LK-4.json", color: "orange" },
        { path: "/provinces/LK-5.json", color: "purple" },
        { path: "/provinces/LK-6.json", color: "yellow" },
        { path: "/provinces/LK-7.json", color: "cyan" },
        { path: "/provinces/LK-8.json", color: "magenta" },
        { path: "/provinces/LK-9.json", color: "brown" },
      ],
      districts: [
        { path: "/districts/district-1.json", color: "blue" },
        { path: "/districts/district-2.json", color: "orange" },
      ],
      ed: [
        { path: "/ed/ed-1.json", color: "purple" },
        { path: "/ed/ed-2.json", color: "yellow" },
      ],
      gnd: [
        { path: "/gnd/gnd-1.json", color: "cyan" },
        { path: "/gnd/gnd-2.json", color: "magenta" },
      ],
      lg: [
        { path: "/lg/lg-1.json", color: "brown" },
        { path: "/lg/lg-2.json", color: "black" },
      ],
    };

    // Load the selected category's files
    const selectedFiles = categories[selectedCategory];
    if (selectedFiles) {
      selectedFiles.forEach(file => loadGeoJson(file.path, file.color));
    }

    // Clean up the map on component unmount
    return () => {
      map.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          map.removeLayer(layer);
        }
      });
      map.remove();
    };
  }, [selectedCategory]);

  return (
    <div>
      <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
        <option value="provinces">Provinces</option>
        <option value="districts">Districts</option>
        <option value="ed">ED</option>
        <option value="gnd">GND</option>
        <option value="lg">LG</option>
      </select>
      <div ref={mapRef} style={{ height: "100vh", width: "100%", position: "relative" }}></div>
    </div>
  );
};

export default Map;
