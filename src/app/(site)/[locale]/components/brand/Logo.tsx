"use client";
import type { SVGProps } from "react";

export function LogoFull(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 165 40"
      aria-label="Habitabio wordmark"
      {...props}
    >
      <text
        x="0"
        y="32"
        fill="var(--ink, #0f172a)"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="36"
        letterSpacing="0.2"
      >
        Habitabio
      </text>
    </svg>
  );
}

export function LogoH(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1024 1024" aria-label="H" {...props}>
      <text
        x="50%"
        y="74%"
        textAnchor="middle"
        fontFamily="Didot, Bodoni MT, 'Bodoni 72', Georgia, 'Times New Roman', serif"
        fontSize="820"
      >
        H
      </text>
    </svg>
  );
}
