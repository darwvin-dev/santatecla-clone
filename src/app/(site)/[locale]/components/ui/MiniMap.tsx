"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MiniMap({
  lat = 45.4642,
  lng = 9.19,
  zoom = 15,
  height = 360,
}: { lat?: number; lng?: number; zoom?: number; height?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const map = new maplibregl.Map({
      container: ref.current,
      style: "https://demotiles.maplibre.org/style.json", 
      center: [lng, lat],
      zoom,
      attributionControl: true,
    });
    mapRef.current = map;

    new maplibregl.Marker({ color: "#0f172a" })
      .setLngLat([lng, lat])
      .addTo(map);

    setTimeout(() => map.resize(), 0);

    return () => map.remove();
  }, [lat, lng, zoom]);

  return <div style={{ height, width: "100%", borderRadius: 12, overflow: "hidden" }} ref={ref} />;
}
