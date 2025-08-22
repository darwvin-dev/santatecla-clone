'use client';

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./layout/Header";
import NavMenu from "./layout/NavMenu";
import "../globals.css";
import Footer from "./layout/Footer";
import BannerBook from "./layout/BannerBook";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  // بستن روی کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isMenuOpen) return;
      const target = e.target as Node | null;
      if (menuRef.current && target && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, { passive: true });
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // بستن روی Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isMenuOpen) return;
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  // بستن روی تغییر مسیر
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // قفل اسکرول وقتی منو باز است
  useEffect(() => {
    const { body } = document;
    if (!body) return;
    const prev = body.style.overflow;
    if (isMenuOpen) body.style.overflow = "hidden";
    else body.style.overflow = prev || "";
    return () => {
      body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <Header setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />

      {/* اوِرلِی: کلیک روی آن منو را می‌بندد */}
      {isMenuOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.35)",
            backdropFilter: "blur(2px)",
            zIndex: 998, // کمتر از NavMenu
            border: "none",
          }}
        />
      )}

      {/* مطمئن شو NavMenu ریشه‌اش ref می‌گیرد (forwardRef پایین) */}
      <NavMenu isMenuOpen={isMenuOpen} ref={menuRef} />

      <div className="wrap container-fluid">
        <div className="content row">
          <main className="main col-12">
            {children}
            <BannerBook />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

