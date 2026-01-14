"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [31.2357, 30.0444],
      zoom: 5,
    });

    mapRef.current = map;

    map.on("load", () => {
      if (!map.getSource("countries")) {
        map.addSource("countries", {
          type: "geojson",
          data: "/data/countries.json",
        });
      }

      if (!map.getLayer("countries-fill")) {
        map.addLayer({
          id: "countries-fill",
          type: "fill",
          source: "countries",
          paint: {
            "fill-color": "#94a3b8",
            "fill-opacity": 0.6,
          },
        });
      }

      if (!map.getLayer("countries-border")) {
        map.addLayer({
          id: "countries-border",
          type: "line",
          source: "countries",
          paint: {
            "line-color": "#334155",
            "line-width": 1,
          },
        });
      }
    });

    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["countries-fill"],
      });

      if (!features.length) {
        console.log("Clicked outside any country");
        return;
      }
      console.log(features);
      const country = features[0];

      console.log("Country feature:", country);
      console.log("Country name:", country.properties?.NAME);
      console.log("ISO :", country.properties?.ADM0_A3);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
}
