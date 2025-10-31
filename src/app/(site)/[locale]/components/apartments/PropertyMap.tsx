"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  LayersControl,
  ScaleControl,
  Circle,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";

interface MapProps {
  coords: [number, number];
  zoom?: number;
  // گزینه‌ها (اختیاری)
  options?: {
    showScale?: boolean;
    showLayers?: boolean;
    showLocate?: boolean;
    showFullscreen?: boolean;
    showCopyCoords?: boolean;
    showReset?: boolean;
    draggable?: boolean;
    scrollWheelZoom?: boolean;
    minZoom?: number;
    maxZoom?: number;
  };
}

function ChangeView({ coords, zoom = 12 }: { coords: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, zoom, { animate: true });
  }, [coords, zoom, map]);
  return null;
}

/** پنل کنترل‌های سفارشی (بالا-راست) */
function Controls({
  wrapperRef,
  initialCenter,
  initialZoom,
  opts,
}: {
  wrapperRef: React.RefObject<HTMLDivElement> | React.MutableRefObject<HTMLDivElement | null>;
  initialCenter: [number, number];
  initialZoom: number;
  opts: Required<Required<MapProps>["options"]>;
}) {
  const map = useMap();
  const [geo, setGeo] = useState<{ latlng: L.LatLng; accuracy: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const doLocate = () => {
    if (!navigator.geolocation) return;
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
        setGeo({ latlng, accuracy: pos.coords.accuracy || 30 });
        map.flyTo(latlng, Math.max(map.getZoom(), 14), { animate: true });
        setLoadingLoc(false);
      },
      () => setLoadingLoc(false),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  const doFullscreen = async () => {
    const el = wrapperRef.current;
    if (!el) return;
    // Fullscreen API
    if (!document.fullscreenElement) {
      await el.requestFullscreen().catch(() => {});
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  };

  const doCopyCenter = async () => {
    const c = map.getCenter();
    const s = `${c.lat.toFixed(6)},${c.lng.toFixed(6)}`;
    try {
      await navigator.clipboard.writeText(s);
    } catch {}
  };

  const doReset = () => {
    map.flyTo(initialCenter, initialZoom, { animate: true });
  };

  return (
    <>
      {/* پنل دکمه‌ها */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          display: "flex",
          gap: 8,
          zIndex: 1000,
          padding: 8,
          borderRadius: 12,
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        {opts.showLocate && (
          <button
            onClick={doLocate}
            title="Locate me"
            style={btnStyle}
            disabled={loadingLoc}
          >
            {loadingLoc ? "…" : "📍"}
          </button>
        )}
        {opts.showFullscreen && (
          <button onClick={doFullscreen} title="Fullscreen" style={btnStyle}>
            ⛶
          </button>
        )}
        {opts.showCopyCoords && (
          <button onClick={doCopyCenter} title="Copy center coords" style={btnStyle}>
            ⧉
          </button>
        )}
        {opts.showReset && (
          <button onClick={doReset} title="Reset view" style={btnStyle}>
            ↺
          </button>
        )}
      </div>

      {/* نمایش دایره دقت مکان‌یابی */}
      {geo && (
        <>
          <Marker position={geo.latlng} />
          <Circle center={geo.latlng} radius={Math.min(geo.accuracy, 120)} />
        </>
      )}
    </>
  );
}

const btnStyle: React.CSSProperties = {
  appearance: "none",
  border: "none",
  outline: "none",
  height: 36,
  width: 36,
  borderRadius: 10,
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  background: "rgba(255,255,255,0.9)",
};

/** نقشه اصلی با UI مدرن و آپشن‌های زیاد (رایگان) */
export default function PropertyMapClient({
  coords,
  zoom = 12,
  options,
}: MapProps) {
  const center = useMemo<[number, number]>(() => coords, [coords]);
  const wrapperRef = useRef<HTMLDivElement | null>(null!);

  // پیش‌فرض‌ها
  const opts = {
    showScale: true,
    showLayers: true,
    showLocate: true,
    showFullscreen: true,
    showCopyCoords: true,
    showReset: true,
    draggable: true,
    scrollWheelZoom: false,
    minZoom: 3,
    maxZoom: 19,
    ...(options || {}),
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        height: 560,
        width: "75%",
        borderRadius: 16,
        margin: "24px auto",
        overflow: "hidden",
        boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={opts.minZoom}
        maxZoom={opts.maxZoom}
        scrollWheelZoom={opts.scrollWheelZoom}
        dragging={opts.draggable}
        zoomControl={false} // جایگزین با ZoomControl پایین برای جای بهتر
        style={{ height: "100%", width: "100%" }}
      >
        {/* Zoom control گوشه چپ بالا تا با پنل تداخل نداشته باشه */}
        <ZoomControl position="topleft" />

        {/* خط‌کش مقیاس */}
        {opts.showScale && <ScaleControl imperial={false} position="bottomleft" />}

        {/* لایه‌ها: تم روشن/تاریک رایگان */}
        {opts.showLayers ? (
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Carto • Light (modern)">
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution="© OpenStreetMap contributors © CARTO"
                detectRetina={false}
                tileSize={256}
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Carto • Dark (modern)">
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="© OpenStreetMap contributors © CARTO"
                detectRetina={false}
                tileSize={256}
              />
            </LayersControl.BaseLayer>

            {/* برچسب‌ها به‌صورت Overlay (اختیاری) */}
            <LayersControl.Overlay name="Labels (Light)" checked={false}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
                attribution="© OpenStreetMap contributors © CARTO"
              />
            </LayersControl.Overlay>
          </LayersControl>
        ) : (
          // اگر LayersControl غیرفعاله، پیش‌فرض Light
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="© OpenStreetMap contributors © CARTO"
            detectRetina={false}
            tileSize={256}
          />
        )}

        {/* مارکر مرکز اولیه */}
        <Marker position={center} />
        <ChangeView coords={center} zoom={zoom} />

        {/* کنترل‌های سفارشی */}
        <Controls
          wrapperRef={wrapperRef}
          initialCenter={center}
          initialZoom={zoom}
          opts={opts}
        />
      </MapContainer>
    </div>
  );
}
