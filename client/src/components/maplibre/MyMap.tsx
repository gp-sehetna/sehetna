"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [31.2357, 30.0444],
      zoom: 5,
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "100vh" }}
    />
  );
}
