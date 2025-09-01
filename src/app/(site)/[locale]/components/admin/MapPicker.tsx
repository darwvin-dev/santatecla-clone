"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";

// رفع مشکل آیکن پیش‌فرض Marker در Next
const markerIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type Props = {
  initialLat?: number;     
  initialLng?: number;
  onPick: (lat: number, lng: number) => void;
};

function ClickToPick({
  onPick,
  setPos,
}: {
  onPick: (lat: number, lng: number) => void;
  setPos: (p: LatLngLiteral) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPos({ lat, lng });
      onPick(lat, lng);
    },
  });
  return null;
}

export default function MapPicker({
  initialLat,
  initialLng,
  onPick,
}: Props) {
  const defaultCenter = useMemo<LatLngLiteral>(
    () => ({
      lat: initialLat ?? 45.4642,
      lng: initialLng ?? 9.19,
    }),
    [initialLat, initialLng]
  );

  const [pos, setPos] = useState<LatLngLiteral | null>(null);

  useEffect(() => {
    // اگر مختصات اولیه داشتیم نشانگر اول کار بگذار
    if (initialLat && initialLng) setPos({ lat: initialLat, lng: initialLng });
  }, [initialLat, initialLng]);

  return (
    <div className="h-[360px] w-full overflow-hidden rounded-xl border border-slate-200">
      {/* حتما height بده؛ بدون ارتفاع رندر نمیشه */}
      <MapContainer
        center={pos ?? defaultCenter}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          // کاشی‌های OSM (بدون کلید API)
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        <ClickToPick onPick={onPick} setPos={setPos} />
        {pos && <Marker position={pos} icon={markerIcon} />}
      </MapContainer>
    </div>
  );
}
