import React from "react";
import { Amenity, Feature } from "./FeaturesPicker";

export function FeatureCard({ feature, selected, onToggle }: { feature: Feature; selected: boolean; onToggle: (key: Amenity) => void; }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(feature.key)}
      className={[
        "group flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition",
        "hover:shadow-sm hover:bg-slate-50",
        selected ? "border-emerald-300 ring-2 ring-emerald-200 bg-white" : "border-slate-200 bg-white",
      ].join(" ")}
      role="switch"
      aria-checked={selected}
      title={feature.label}
    >
      <span className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white">
        <img src={feature.icon} alt="" width={22} height={22} />
      </span>
      <span className="text-sm font-medium text-slate-800">{feature.label}</span>
      <span className={["ml-auto inline-flex h-5 w-9 items-center rounded-full border transition", selected ? "border-emerald-300 bg-emerald-500/90" : "border-slate-300 bg-slate-200"].join(" ")}> 
        <span className={["h-4 w-4 rounded-full bg-white shadow transition", selected ? "translate-x-4" : "translate-x-1"].join(" ")} />
      </span>
    </button>
  );
}

