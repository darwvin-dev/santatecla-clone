// components/admin/AdminHeader.tsx
"use client";

export default function AdminHeader() {
  return (
    <div className="flex items-center justify-between gap-3">
      <h1 className="truncate text-base font-semibold text-gray-800 sm:text-lg">Gestione</h1>
      <div className="flex items-center gap-3">
        <span className="hidden text-gray-600 sm:inline">👤 Admin</span>
      </div>
    </div>
  );
}
