"use client";

import { useState, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

interface MapProps {
  coords: [number, number];
  zoom?: number;
}

function ChangeView({ coords, zoom = 12 }: MapProps) {
  const map = useMap();
  map.setView(coords, zoom);
  return null;
}

export default function PropertyMapClient({ coords, zoom = 12 }: MapProps) {
  const center = useMemo<[number, number]>(() => coords, [coords]);

  return (
    <div
      style={{
        height: 360,
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={center} />
        <ChangeView coords={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
}
