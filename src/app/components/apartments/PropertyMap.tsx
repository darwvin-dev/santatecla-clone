"use client";

// NOTE: Make sure you import Leaflet CSS once in your app root (e.g., app/layout.tsx or globals.css):
// import "leaflet/dist/leaflet.css";

import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import L from "leaflet";

// Dynamic imports to avoid SSR issues with react-leaflet
const RLMapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
);
const RLTileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false }
);
const RLMarker = dynamic(async () => (await import("react-leaflet")).Marker, {
  ssr: false,
});
const RLPopup = dynamic(async () => (await import("react-leaflet")).Popup, {
  ssr: false,
});

// Types
export type Theme = "light" | "dark";

export type PropertyMapProps = {
  lat?: number;
  lng?: number;
  data?: any; // kept for compatibility; not used in this snippet
  zoom?: number;
  /** Height of the inline map container */
  height?: number | string;
  /** Width of the inline map container */
  width?: number | string;
  theme?: Theme;
  addressLabel?: string;
  showFullscreenButton?: boolean;
  className?: string;
  /** Border radius for the inline map container (e.g., 12, "12px", "1rem") */
  radius?: number | string;
};

const lightTile = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: "&copy; OpenStreetMap contributors",
};

const darkTile = {
  url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  attribution:
    '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
};

// Default Leaflet marker icons (fixes missing icons in many bundlers)
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
});

export default function PropertyMap({
  lat,
  lng,
  zoom = 15,
  height = 320,
  width = "100%",
  data,
  theme = "light",
  addressLabel,
  showFullscreenButton = true,
  className,
  radius = 12,
}: PropertyMapProps) {
  const [fullscreen, setFullscreen] = useState(false);

  const tile = theme === "dark" ? darkTile : lightTile;

  const center = useMemo(() => {
    if (typeof lat === "number" && typeof lng === "number") {
      return { lat, lng };
    }
    return { lat: 45.4642, lng: 9.19 };
  }, [lat, lng]);

  const hasCoords = typeof lat === "number" && typeof lng === "number";

  return (
    <div className={`row padding-y-0-80 ${className ?? ""}`.trim()}>
      <div className="col-12">
        <div className="container" style={{ position: "relative" }}>
          <p className="ff-sans fw-400 fz-24 color-black lh-sm">
            Come raggiungere l'appartamento{" "}
          </p>
          <p className="ff-sans fw-200 fz-18 color-gray lh-sm mb-0">
            MM4 Tricolore - Stazione Trenord Dateo | Autobus 54 e 61{" "}
          </p>

          {!hasCoords && (
            <div
              style={{
                padding: 16,
                fontSize: 14,
                marginTop: 12,
              }}
            >
              Nessuna posizione impostata. Aggiungi lat/lng per visualizzare la mappa.
            </div>
          )}

          {hasCoords && (
            <>
              {showFullscreenButton && (
                <button
                  type="button"
                  onClick={() => setFullscreen(true)}
                  aria-label="Apri a schermo intero"
                  className="pm-fs-btn"
                  style={{
                    position: "absolute",
                    zIndex: 500,
                    right: 10,
                    top: 10,
                    background: "rgba(0,0,0,.75)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 10px",
                    cursor: "pointer",
                    fontSize: 12,
                    backdropFilter: "blur(2px)",
                  }}
                >
                  Full screen
                </button>
              )}

              <div
                style={{
                  height,
                  width,
                  marginTop: 12,
                  borderRadius: typeof radius === "number" ? `${radius}px` : radius,
                  overflow: "hidden",
                  boxShadow: "0 6px 24px rgba(0,0,0,.08)",
                }}
              >
                <RLMapContainer
                  center={center}
                  zoom={zoom}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom
                >
                  <RLTileLayer attribution={tile.attribution} url={tile.url} />
                  <RLMarker position={center} icon={markerIcon}>
                    {addressLabel ? <RLPopup>{addressLabel}</RLPopup> : null}
                  </RLMarker>
                </RLMapContainer>
              </div>
            </>
          )}

          {/* Fullscreen Overlay */}
          {fullscreen && hasCoords && (
            <div
              className="pm-fs-overlay"
              role="dialog"
              aria-modal="true"
              style={{
                position: "fixed",
                inset: 0,
                background: "#000",
                zIndex: 9999,
              }}
            >
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                aria-label="Chiudi schermo intero"
                style={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  background: "rgba(255,255,255,.9)",
                  color: "#000",
                  border: "none",
                  borderRadius: 10,
                  padding: "8px 12px",
                  cursor: "pointer",
                  zIndex: 10000,
                  fontWeight: 600,
                }}
              >
                Chiudi
              </button>

              <div style={{ position: "absolute", inset: 0 }}>
                <RLMapContainer
                  center={center}
                  zoom={zoom}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom
                >
                  <RLTileLayer attribution={tile.attribution} url={tile.url} />
                  <RLMarker position={center} icon={markerIcon}>
                    {addressLabel ? <RLPopup>{addressLabel}</RLPopup> : null}
                  </RLMarker>
                </RLMapContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
