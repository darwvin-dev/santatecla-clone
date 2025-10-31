"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  ScaleControl,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";

/* ====== Types ====== */
export type AmenityKey =
  | "macchina_caffe"
  | "aria_condizionata"
  | "bollitore"
  | "tostapane"
  | "lavastoviglie"
  | "self_check_in"
  | "tv"
  | "lavatrice"
  | "set_di_cortesia"
  | "microonde"
  | "biancheria"
  | "culla_su_richiesta"
  | "wifi"
  | "parcheggio_esterno"
  | "animali_ammessi"
  | "asciugacapelli"
  | "balcone";

export type Apartment = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  details?: string;
  address: string;
  addressDetail?: string;
  title_en?: string;
  description_en?: string;
  details_en?: string;
  address_en?: string;
  addressDetail_en?: string;
  floor_en?: string;
  image: string;
  gallery: string[];
  plan?: string;
  guests: number;
  beds?: number;
  sizeSqm: string;
  floor?: string;
  bathrooms: number;
  cir?: string;
  cin?: string;
  amenities: AmenityKey[];
  rules?: { checkInFrom?: string; checkInTo?: string; checkOutBy?: string };
  cancellation?: {
    policy: "free_until_5_days" | "flexible" | "strict";
    note?: string;
    note_en?: string;
  };
  lat?: number;
  lng?: number;
  location?: { type: "Point"; coordinates: [number, number] }; // [lng, lat]
  size?: string;
  createdAt?: string;
  updatedAt?: string;
  orderShow: number;
};

/* ====== Helpers ====== */
function getCoordsFromApartment(a: Apartment): [number, number] | null {
  const lat: number | null = a.lat ?? a.location?.coordinates?.[1] ?? null;
  const lng: number | null = a.lng ?? a.location?.coordinates?.[0] ?? null;
  return typeof lat === "number" && typeof lng === "number" ? [lat, lng] : null;
}

function FitToMarkers({
  coordsList,
  fallbackCenter,
  fallbackZoom,
}: {
  coordsList: [number, number][];
  fallbackCenter: [number, number];
  fallbackZoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (coordsList.length > 1) {
      const bounds = L.latLngBounds(coordsList.map(([la, ln]) => L.latLng(la, ln)));
      map.fitBounds(bounds, { padding: [48, 48] });
    } else if (coordsList.length === 1) {
      map.setView(coordsList[0], Math.max(map.getZoom(), 14), { animate: true });
    } else {
      map.setView(fallbackCenter, fallbackZoom, { animate: false });
    }
  }, [coordsList, fallbackCenter, fallbackZoom, map]);
  return null;
}

/* ====== Google-like marker (SVG) ====== */
const googleLikeIcon = L.divIcon({
  className: "",
  html: `
  <svg width="28" height="42" viewBox="0 0 28 42" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="s" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/></filter></defs>
    <g filter="url(#s)">
      <path d="M14 0C6.5 0 0.5 5.9 0.5 13.2C0.5 22.1 10.4 34.7 13.2 38.2C13.6 38.7 14.4 38.7 14.8 38.2C17.6 34.7 27.5 22.1 27.5 13.2C27.5 5.9 21.5 0 14 0Z" fill="#EA4335"/>
      <circle cx="14" cy="13" r="5.2" fill="#fff"/>
    </g>
  </svg>`,
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -38],
});

/* ====== Wheel zoom controller ====== */
type WheelMode = "off" | "on" | "hover" | "ctrl";

function WheelZoomController({
  mode,
  setCtrlActive,
}: {
  mode: WheelMode;
  setCtrlActive?: (v: boolean) => void;
}) {
  const map = useMap();

  useEffect(() => {
    // پایه: همیشه با wheel خاموش شروع کن
    map.scrollWheelZoom.disable();

    const container = map.getContainer();

    if (mode === "on") {
      map.scrollWheelZoom.enable();
      return;
    }

    if (mode === "hover") {
      const onEnter = () => map.scrollWheelZoom.enable();
      const onLeave = () => map.scrollWheelZoom.disable();
      container.addEventListener("mouseenter", onEnter);
      container.addEventListener("mouseleave", onLeave);
      return () => {
        container.removeEventListener("mouseenter", onEnter);
        container.removeEventListener("mouseleave", onLeave);
        map.scrollWheelZoom.disable();
      };
    }

    if (mode === "ctrl") {
      const onWheel = (e: WheelEvent) => {
        const allow = e.ctrlKey || e.metaKey;
        setCtrlActive?.(allow);
        if (allow) {
          if (!map.scrollWheelZoom.enabled()) map.scrollWheelZoom.enable();
        } else {
          if (map.scrollWheelZoom.enabled()) map.scrollWheelZoom.disable();
        }
      };
      const onLeave = () => {
        setCtrlActive?.(false);
        map.scrollWheelZoom.disable();
      };
      container.addEventListener("wheel", onWheel, { passive: true });
      container.addEventListener("mouseleave", onLeave);
      return () => {
        container.removeEventListener("wheel", onWheel as any);
        container.removeEventListener("mouseleave", onLeave);
        map.scrollWheelZoom.disable();
      };
    }

    // mode === "off"
    return () => {
      map.scrollWheelZoom.disable();
    };
  }, [mode, map, setCtrlActive]);

  return null;
}

/* ====== Props ====== */
type IndexMapProps = {
  apartments: Apartment[];
  height?: number | string;
  width?: string | number;
  className?: string;
  fallbackCenter?: [number, number];
  fallbackZoom?: number;
  showLayersSwitch?: boolean;
  showScale?: boolean;
  /** کنترل اسکرول→زوم (پیش‌فرض: ctrl) */
  wheelMode?: WheelMode;
  /** نمایش هینت Ctrl */
  showWheelHint?: boolean;
};

/* ====== Component ====== */
export default function IndexMap({
  apartments,
  height = 560,
  width = "75%",
  className,
  fallbackCenter = [41.9028, 12.4964],
  fallbackZoom = 6,
  showLayersSwitch = true,
  showScale = true,
  wheelMode = "ctrl",
  showWheelHint = true,
}: IndexMapProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const withCoords = useMemo(
    () =>
      apartments
        .map((a) => {
          const coords = getCoordsFromApartment(a);
          return coords ? { a, coords } : null;
        })
        .filter(Boolean) as { a: Apartment; coords: [number, number] }[],
    [apartments]
  );

  const mkKey = (a: Apartment, idx: number) => `${a._id || a.slug || idx}`;

  const [ctrlActive, setCtrlActive] = useState(false);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        width,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
        margin: "24px auto",
        position: "relative",
      }}
    >
      <MapContainer
        center={fallbackCenter}
        zoom={fallbackZoom}
        // خیلی مهم: همیشه false شروع بشه، کنترل را ما می‌دهیم
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        minZoom={3}
        maxZoom={19}
      >
        <ZoomControl position="topleft" />
        {showScale && <ScaleControl imperial={false} position="bottomleft" />}

        {showLayersSwitch ? (
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Streets (Carto Light)">
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution="© OpenStreetMap contributors © CARTO"
                detectRetina={false}
                tileSize={256}
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="OSM Standard">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
                tileSize={256}
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Hybrid (Esri + Labels)">
              <>
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics"
                  tileSize={256}
                />
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
                  attribution="© CARTO"
                  tileSize={256}
                  opacity={0.55}
                />
              </>
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Dark (Carto)">
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="© OpenStreetMap contributors © CARTO"
                detectRetina={false}
                tileSize={256}
              />
            </LayersControl.BaseLayer>
          </LayersControl>
        ) : (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="© OpenStreetMap contributors © CARTO"
            detectRetina={false}
            tileSize={256}
          />
        )}

        {/* کنترل رفتار اسکرول-زوم */}
        <WheelZoomController mode={wheelMode} setCtrlActive={setCtrlActive} />

        {/* Fit به مارکرها */}
        <FitToMarkers
          coordsList={withCoords.map((x) => x.coords)}
          fallbackCenter={fallbackCenter}
          fallbackZoom={fallbackZoom}
        />

        {/* مارکرها */}
        {withCoords.map(({ a, coords }, idx) => (
          <Marker key={mkKey(a, idx)} position={coords} icon={googleLikeIcon}>
            <Popup maxWidth={320} minWidth={220}>
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ fontWeight: 700 }}>{a.title}</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>
                  {a.addressDetail ? `${a.address} — ${a.addressDetail}` : a.address}
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                  <span>👥 {a.guests}</span>
                  <span>🛁 {a.bathrooms}</span>
                  <span>📐 {a.sizeSqm}</span>
                </div>
                {a.image ? (
                  <img
                    src={a.image}
                    alt={a.title}
                    style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }}
                  />
                ) : null}
                <a href={`/apartments/${a.slug}`} style={{ marginTop: 4, textDecoration: "none", fontWeight: 600 }}>
                  View details →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
