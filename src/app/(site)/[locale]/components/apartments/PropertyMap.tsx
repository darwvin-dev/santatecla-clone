"use client";

import { useState, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

function ChangeView({
  coords,
  zoom = 12,
}: {
  coords: [number, number];
  zoom?: number;
}) {
  const map = useMap();
  map.setView(coords, zoom);
  return null;
}

export default function Map() {
  const [geoData] = useState({ lat: 64.536634, lng: 16.779852 });
  const center = useMemo<[number, number]>(
    () => [geoData.lat, geoData.lng],
    [geoData.lat, geoData.lng]
  );

  return (
    <div
      style={{
        height: 300,
        width: "85%",
        margin: "auto",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={center} />
        <ChangeView coords={center} zoom={12} />
      </MapContainer>
    </div>
  );
}
