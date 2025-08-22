"use client";

import React, { useEffect, useMemo, useState } from "react";
import { arrayMove, resolveUrl } from "@/lib/helper";
import { Section } from "./Section";

type FinalUIItem =
  | { kind: "existing"; id: string; url: string }
  | { kind: "new"; id: string; file: File };

export function ImagesManager({
  existingCover,
  coverImage,
  onCoverChange,

  existingGallery,
  setExistingGallery,
  galleryNew,
  setGalleryNew,
  onGalleryNewChange,
  onRemoveExisting,
  onRemoveNew,

  existingPlan,
  planImage,
  removePlan,
  setRemovePlan,
  onPlanChange,

  // NEW
  onFinalOrderChange,
}: {
  existingCover: string | null;
  coverImage: File | null;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  existingGallery: string[];
  setExistingGallery: React.Dispatch<React.SetStateAction<string[]>>;
  galleryNew: File[];
  setGalleryNew: React.Dispatch<React.SetStateAction<File[]>>;
  onGalleryNewChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveExisting: (url: string) => void;
  onRemoveNew: (idx: number) => void;

  existingPlan: string | null;
  planImage: File | null;
  removePlan: boolean;
  setRemovePlan: (v: boolean) => void;
  onPlanChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // NEW: خروجی ترتیب نهایی
  onFinalOrderChange?: (items: FinalUIItem[]) => void;
}) {
  const [dragIdxOld, setDragIdxOld] = useState<number | null>(null);
  const [dragIdxNew, setDragIdxNew] = useState<number | null>(null);

  // --- NEW: آرایه‌ی یکپارچه برای ترتیب نهایی UI ---
  const [finalOrder, setFinalOrder] = useState<FinalUIItem[]>([]);

  // مقداردهی اولیه‌ی finalOrder وقتی داده‌ها رسیدند
  useEffect(() => {
    setFinalOrder((prev) => {
      if (prev.length > 0) return prev;
      const ex = existingGallery.map((url) => ({ kind: "existing" as const, id: `ex:${url}`, url }));
      const nw = galleryNew.map((file, i) => ({ kind: "new" as const, id: `new:${i}_${file.name}`, file }));
      return [...ex, ...nw];
    });
  }, [existingGallery, galleryNew]);

  // اگر فایل جدیدی اضافه/حذف شد، finalOrder را هم همگام کن
  useEffect(() => {
    setFinalOrder((prev) => {
      const prevIds = new Set(prev.map((x) => x.id));

      // اضافه‌کردن جدیدهایی که تازه وارد شدند
      const adds: FinalUIItem[] = [];
      galleryNew.forEach((file, i) => {
        const id = `new:${i}_${file.name}`;
        if (!prevIds.has(id)) adds.push({ kind: "new", id, file });
      });

      // حذف‌کردن جدیدهایی که از state حذف شدند
      const newIds = new Set(galleryNew.map((f, i) => `new:${i}_${f.name}`));
      const filtered = prev.filter((x) => (x.kind === "new" ? newIds.has(x.id) : true));

      return adds.length ? [...filtered, ...adds] : filtered;
    });
  }, [galleryNew]);

  // sync به والد
  useEffect(() => {
    onFinalOrderChange?.(finalOrder);
  }, [finalOrder, onFinalOrderChange]);

  const moveFinal = (from: number, to: number) => {
    setFinalOrder((arr) => arrayMove(arr, from, to));
  };

  const removeFromFinal = (id: string) => {
    setFinalOrder((arr) => arr.filter((x) => x.id !== id));
  };

  // وقتی از لیست‌های جزئی حذف می‌کنی، از final هم حذفش کن
  const handleRemoveExisting = (url: string) => {
    onRemoveExisting(url);
    removeFromFinal(`ex:${url}`);
  };

  const handleRemoveNew = (idx: number) => {
    const idToRemove = `new:${idx}_${galleryNew[idx]?.name}`;
    onRemoveNew(idx);
    removeFromFinal(idToRemove);
  };

  return (
    <Section title="Immagini">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Cover */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Immagine principale</label>
          {existingCover && !coverImage && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <img src={resolveUrl(existingCover)} alt="Cover attuale" className="h-40 w-full object-cover" />
            </div>
          )}
          <label className="flex h-36 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600 hover:bg-slate-100">
            <input type="file" accept="image/*" className="hidden" onChange={onCoverChange} />
            <span>Seleziona file</span>
          </label>
          {coverImage && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <img src={URL.createObjectURL(coverImage)} alt="Nuova cover" className="h-40 w-full object-cover" />
            </div>
          )}
        </div>

        {/* Gallery (قدیمی / جدید — مدیریت داخلی) */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Galleria – esistenti</label>
          {existingGallery.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {existingGallery.map((url, i) => (
                <figure
                  key={url}
                  className="group relative overflow-hidden rounded-lg"
                  draggable
                  onDragStart={() => setDragIdxOld(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIdxOld === null || dragIdxOld === i) return;
                    setExistingGallery((arr) => arrayMove(arr, dragIdxOld, i));
                    setDragIdxOld(null);
                  }}
                  title="Drag to reorder (esistenti)"
                >
                  <img src={resolveUrl(url)} alt="Esistente" className="h-28 w-full object-cover ring-1 ring-slate-200" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExisting(url)}
                    className="absolute right-2 top-2 hidden rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-rose-600 shadow group-hover:block"
                  >
                    Rimuovi
                  </button>
                </figure>
              ))}
            </div>
          )}

          <label className="flex h-36 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600 hover:bg-slate-100">
            <input type="file" accept="image/*" multiple className="hidden" onChange={onGalleryNewChange} />
            <span>Aggiungi nuove immagini</span>
          </label>

          {galleryNew.length > 0 && (
            <>
              <label className="block text-sm font-medium text-slate-700">Galleria – nuove</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {galleryNew.map((f, i) => (
                  <figure
                    key={`${i}_${f.name}`}
                    className="group relative overflow-hidden rounded-lg"
                    draggable
                    onDragStart={() => setDragIdxNew(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIdxNew === null || dragIdxNew === i) return;
                      setGalleryNew((g) => arrayMove(g, dragIdxNew, i));
                      setDragIdxNew(null);
                    }}
                    title="Drag to reorder (nuove)"
                  >
                    <img src={URL.createObjectURL(f)} alt={`Nuova ${i + 1}`} className="h-28 w-full object-cover ring-1 ring-slate-200" />
                    <button
                      type="button"
                      onClick={() => handleRemoveNew(i)}
                      className="absolute right-2 top-2 hidden rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-rose-600 shadow group-hover:block"
                    >
                      Rimuovi
                    </button>
                  </figure>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Plan */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Planimetria (opzionale)</label>
          {existingPlan && !planImage && !removePlan && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <img src={resolveUrl(existingPlan)} alt="Planimetria attuale" className="h-40 w-full object-cover" />
            </div>
          )}
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={removePlan}
              onChange={(e) => { setRemovePlan(e.target.checked); }}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
            />
            Rimuovi planimetria
          </label>
          {!removePlan && (
            <>
              <label className="flex h-36 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600 hover:bg-slate-100">
                <input type="file" accept="image/*" className="hidden" onChange={onPlanChange} />
                <span>Seleziona file</span>
              </label>
              {planImage && (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <img src={URL.createObjectURL(planImage)} alt="Nuova planimetria" className="h-40 w-full object-cover" />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* --- NEW: Ordine finale (interleave) --- */}
      <div className="mt-6">
        <h4 className="mb-2 text-sm font-semibold text-slate-800">Ordine finale (trascina per riordinare)</h4>
        {finalOrder.length === 0 ? (
          <p className="text-sm text-slate-600">Nessuna immagine.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {finalOrder.map((it, i) => {
              const isExisting = it.kind === "existing";
              return (
                <figure
                  key={it.id}
                  className="group relative overflow-hidden rounded-lg ring-1 ring-slate-200"
                  draggable
                  onDragStart={() => (window as any).__dragIdx = i}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    const from = (window as any).__dragIdx as number | undefined;
                    if (from === undefined || from === i) return;
                    moveFinal(from, i);
                    (window as any).__dragIdx = undefined;
                  }}
                  title="Drag to reorder (ordine finale)"
                >
                  <img
                    src={isExisting ? resolveUrl(it.url) : URL.createObjectURL(it.file)}
                    alt={isExisting ? "Esistente" : "Nuova"}
                    className="h-28 w-full object-cover"
                  />
                  <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {isExisting ? "EXISTING" : "NEW"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromFinal(it.id)}
                    className="absolute right-2 top-2 hidden rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-rose-600 shadow group-hover:block"
                  >
                    Rimuovi da ordine
                  </button>
                </figure>
              );
            })}
          </div>
        )}
      </div>
    </Section>
  );
}
