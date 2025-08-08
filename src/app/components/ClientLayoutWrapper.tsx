'use client';

import { useState } from "react";
import Header from "./header/Header";
import NavMenu from "./header/NavMenu";
import "../globals.css"

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={isMenuOpen ? "is-open" : ""}>
      <Header setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
      {isMenuOpen && <NavMenu />}
      {children}
    </div>
  );
}
