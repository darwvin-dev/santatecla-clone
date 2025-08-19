"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { LatLngLiteral, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

type LatLng = { lat: number; lng: number };

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
});

const THEMES = {
  osm: {
    label: "Standard (OSM)",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  },
  light: {
    label: "Chiaro (Carto Positron)",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  dark: {
    label: "Scuro (Carto Dark Matter)",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  satellite: {
    label: "Satellite (Esri)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
} as const;
type ThemeKey = keyof typeof THEMES;

function ClickHandler({
  onPick,
  readOnly,
}: {
  onPick: (lat: number, lng: number) => void;
  readOnly?: boolean;
}) {
  useMapEvents({
    click(e) {
      if (!readOnly) onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPicker({
  initialAddress,
  onPick,
  defaultCenter = { lat: 45.478, lng: 9.156 },
  defaultZoom = 14,
  className,
}: {
  initialAddress?: string;
  onPick: (lat: number, lng: number) => void;
  defaultCenter?: LatLngLiteral;
  defaultZoom?: number;
  className?: string;
}) {
  const [pos, setPos] = useState<LatLngLiteral>(defaultCenter);
  const [zoom] = useState(defaultZoom);
  const [theme, setTheme] = useState<ThemeKey>("light");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mapRef = useRef<LeafletMap | null>(null);

  // ----- Search (Nominatim) -----
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<
    Array<{ display_name: string; lat: string; lon: string }>
  >([]);
  const [activeIdx, setActiveIdx] = useState<number>(-1);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIdx(-1);
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        setIsSearching(true);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=7&countrycodes=it`;
        const res = await fetch(url, {
          headers: { "Accept-Language": "it" },
          signal: controller.signal,
        });
        const data = (await res.json()) as Array<{
          display_name: string;
          lat: string;
          lon: string;
        }>;
        setResults(data);
      } catch {
        // ignore
      } finally {
        setIsSearching(false);
      }
    }, 350); // debounce
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  const handleSelectResult = (idx: number) => {
    const r = results[idx];
    if (!r) return;
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    setPos({ lat, lng });
    onPick(lat, lng);
    setResults([]);
    setQuery(r.display_name);
    setActiveIdx(-1);
    // flyTo برای UX بهتر
    if (mapRef.current) mapRef.current.flyTo([lat, lng], Math.max(16, zoom));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0) handleSelectResult(activeIdx);
    } else if (e.key === "Escape") {
      setResults([]);
    }
  };

  // ----- Geolocate -----
  const geolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const { latitude, longitude } = p.coords;
        setPos({ lat: latitude, lng: longitude });
        onPick(latitude, longitude);
        if (mapRef.current)
          mapRef.current.flyTo([latitude, longitude], Math.max(16, zoom));
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
  };

  // ----- Pick handlers -----
  const handlePick = useCallback(
    (lat: number, lng: number) => {
      setPos({ lat, lng });
      onPick(lat, lng);
    },
    [onPick]
  );

  // ----- Fullscreen -----
  const toggleFullscreen = () => {
    setIsFullscreen((v) => !v);
    // این invalidateSize باعث می‌شه نقشه در تمام‌صفحه درست رندر بشه
    setTimeout(() => mapRef.current?.invalidateSize(), 250);
  };

  // center by initialAddress? اختیاریت می‌گذاریم؛ اگر لازم داشتی می‌تونی geocode کنی

  const containerClass = `stl-map-picker ${
    isFullscreen ? "stl-map-picker--fullscreen" : ""
  } ${className ?? ""}`;

  return (
    <div className={containerClass}>
      {/* Controls overlay */}
      <div className="stl-map-picker__toolbar">
        {/* Search */}
        <div className="stl-map-picker__search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cerca un indirizzo…"
            aria-label="Cerca un indirizzo"
          />
          {isSearching && (
            <span className="stl-map-picker__spinner" aria-hidden />
          )}
          {!!results.length && (
            <ul className="stl-map-picker__results" role="listbox">
              {results.map((r, i) => (
                <li
                  key={`${r.lat}-${r.lon}-${i}`}
                  role="option"
                  aria-selected={i === activeIdx}
                  className={i === activeIdx ? "active" : ""}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectResult(i);
                  }}
                >
                  {r.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Theme select */}
        <div className="stl-map-picker__theme">
          <label className="stl-map-picker__label" htmlFor="stl-theme-select">
            Tema
          </label>
          <select
            id="stl-theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeKey)}
            aria-label="Tema mappa"
          >
            {Object.entries(THEMES).map(([key, t]) => (
              <option key={key} value={key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="stl-map-picker__actions">
          <button
            type="button"
            className="stl-btn stl-btn--ghost"
            onClick={geolocate}
            title="Usa la mia posizione"
          >
            Usa la mia posizione
          </button>
          <button
            type="button"
            className="stl-btn stl-btn--primary"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? "Esci da schermo intero" : "Schermo intero"}
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="stl-map-picker__map">
        <MapContainer
          center={pos}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
          ref={(m) => {
            mapRef.current = m;
          }}
        >
          <TileLayer
            key={theme}
            url={THEMES[theme].url}
            attribution={THEMES[theme].attribution}
          />
          <ClickHandler onPick={handlePick} />
          <Marker
            position={pos}
            draggable
            icon={markerIcon}
            eventHandlers={{
              dragend: (e) => {
                const m = e.target as L.Marker;
                const p = m.getLatLng();
                handlePick(p.lat, p.lng);
              },
            }}
          />
        </MapContainer>
      </div>

      {/* Lat/Lng quick edit */}
      <div className="stl-map-picker__coords">
        <div className="stl-field">
          <label className="stl-map-picker__label">Latitudine</label>
          <input
            type="number"
            step="0.000001"
            value={pos.lat}
            onChange={(e) =>
              handlePick(parseFloat(e.target.value || "0") || pos.lat, pos.lng)
            }
          />
        </div>
        <div className="stl-field">
          <label className="stl-map-picker__label">Longitudine</label>
          <input
            type="number"
            step="0.000001"
            value={pos.lng}
            onChange={(e) =>
              handlePick(pos.lat, parseFloat(e.target.value || "0") || pos.lng)
            }
          />
        </div>
      </div>
    </div>
  );
}
