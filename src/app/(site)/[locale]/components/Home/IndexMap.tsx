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

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${breakpoint}px)`);
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, [breakpoint]);
  return isMobile;
}

/**
 * Responsive height: on mobile the map is compact but sizeable; on desktop accept given height.
 * If a number is provided, it will be used as px on desktop.
 */
function useResponsiveHeight(defaultHeight: number | string) {
  const isMobile = useIsMobile();
  const [h, setH] = useState<string | number>(defaultHeight);
  useEffect(() => {
    if (!isMobile) {
      setH(defaultHeight);
      return;
    }
    const vw = Math.max(320, Math.min(window.innerWidth, 768));
    const px = Math.round(Math.max(240, Math.min(vw * 0.6, 400)));
    setH(px);
  }, [isMobile, defaultHeight]);
  return h;
}

/* ====== Fit bounds smartly ====== */
function FitToMarkers({
  coordsList,
  fallbackCenter,
  fallbackZoom,
  padding,
}: {
  coordsList: [number, number][];
  fallbackCenter: [number, number];
  fallbackZoom: number;
  padding?: [number, number];
}) {
  const map = useMap();
  const isMobile = useIsMobile();
  useEffect(() => {
    if (coordsList.length > 1) {
      const bounds = L.latLngBounds(coordsList.map(([la, ln]) => L.latLng(la, ln)));
      map.fitBounds(bounds, { padding: padding ?? (isMobile ? [16, 16] : [48, 48]) });
    } else if (coordsList.length === 1) {
      // Respect current zoom if it's already tighter
      map.setView(coordsList[0], Math.max(map.getZoom(), 14), { animate: true });
    } else {
      map.setView(fallbackCenter, fallbackZoom, { animate: false });
    }
  }, [coordsList, fallbackCenter, fallbackZoom, map, isMobile, padding]);
  return null;
}

/* ====== Google-like marker (SVG) ====== */
const googleLikeIcon = L.divIcon({
  className: "",
  html: `
  <svg width="28" height="42" viewBox="0 0 28 42" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <defs><filter id="s" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
    </filter></defs>
    <g filter="url(#s)">
      <path d="M14 0C6.5 0 0.5 5.9 0.5 13.2C0.5 22.1 10.4 34.7 13.2 38.2C13.6 38.7 14.4 38.7 14.8 38.2C17.6 34.7 27.5 22.1 27.5 13.2C27.5 5.9 21.5 0 14 0Z" fill="#EA4335"/>
      <circle cx="14" cy="13" r="5.2" fill="#fff"/>
    </g>
  </svg>` ,
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -38],
});

/* ====== Wheel zoom controller ====== */
export type WheelMode = "off" | "on" | "hover" | "ctrl";
function WheelZoomController({
  mode,
  setCtrlActive,
}: {
  mode: WheelMode;
  setCtrlActive?: (v: boolean) => void;
}) {
  const map = useMap();
  useEffect(() => {
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
    return () => {
      map.scrollWheelZoom.disable();
    };
  }, [mode, map, setCtrlActive]);
  return null;
}

/* ====== Props ====== */
export type IndexMapProps = {
  apartments: Apartment[];
  /** Desktop height (px or CSS). Mobile height is auto-compacted. */
  height?: number | string;
  /** Desktop width. On mobile it will always be 100%. */
  width?: string | number;
  className?: string;
  fallbackCenter?: [number, number];
  fallbackZoom?: number;
  showLayersSwitch?: boolean;
  showScale?: boolean;
  wheelMode?: WheelMode;
  showWheelHint?: boolean;
  /** Extra padding when fitting markers */
  fitPadding?: [number, number];
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
  fitPadding,
}: IndexMapProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const responsiveHeight = useResponsiveHeight(height);

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
        height: typeof responsiveHeight === "number" ? `${responsiveHeight}px` : responsiveHeight,
        width: isMobile ? "100%" : width,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
        margin: isMobile ? "12px auto" : "24px auto",
        position: "relative",
        background: "#f6f6f6",
      }}
    >
      {/* Wheel hint (desktop only) */}
      {showWheelHint && !isMobile && wheelMode === "ctrl" && (
        <div
          role="note"
          aria-live="polite"
          style={{
            position: "absolute",
            right: 12,
            bottom: 12,
            zIndex: 1000,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: 8,
            fontSize: 12,
            pointerEvents: "none",
            display: "flex",
            gap: 6,
            alignItems: "center",
            opacity: ctrlActive ? 0.2 : 1,
            transition: "opacity .2s ease",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 2h6a2 2 0 0 1 2 2v4h-2V4H9v16h6v-4h2v4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" fill="currentColor"/>
          </svg>
          Hold <b style={{ marginInline: 4 }}>Ctrl</b> to zoom
        </div>
      )}

      <MapContainer
        center={fallbackCenter}
        zoom={fallbackZoom}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        minZoom={3}
        maxZoom={19}
        preferCanvas
      >
        <ZoomControl position={isMobile ? "bottomright" : "topleft"} />
        {showScale && (
          <ScaleControl imperial={false} position={isMobile ? "bottomleft" : "bottomleft"} />
        )}

        {showLayersSwitch ? (
          <LayersControl position={isMobile ? "topright" : "topright"}>
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

        <WheelZoomController mode={wheelMode} setCtrlActive={setCtrlActive} />

        <FitToMarkers
          coordsList={withCoords.map((x) => x.coords)}
          fallbackCenter={fallbackCenter}
          fallbackZoom={fallbackZoom}
          padding={fitPadding}
        />

        {withCoords.map(({ a, coords }, idx) => (
          <Marker key={mkKey(a, idx)} position={coords} icon={googleLikeIcon}>
            <Popup maxWidth={isMobile ? 280 : 340} minWidth={isMobile ? 200 : 240} autoPan>
              <div
                style={{
                  display: "grid",
                  gap: 8,
                  lineHeight: 1.25,
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 14 }}>{a.title}</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>
                  {a.addressDetail ? `${a.address} — ${a.addressDetail}` : a.address}
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, alignItems: "center" }}>
                  <span title="Guests">👥 {a.guests}</span>
                  <span title="Bathrooms">🛁 {a.bathrooms}</span>
                  <span title="Size">📐 {a.sizeSqm}</span>
                </div>
                {a.image ? (
                  <img
                    src={a.image}
                    alt={a.title}
                    style={{
                      width: "100%",
                      height: isMobile ? 120 : 150,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <a
                  href={`/apartments/${a.slug}`}
                  style={{
                    marginTop: 6,
                    textDecoration: "none",
                    fontWeight: 700,
                    alignSelf: "start",
                  }}
                >
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
