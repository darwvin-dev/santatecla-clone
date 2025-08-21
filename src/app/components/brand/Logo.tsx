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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
      aria-label="Habitabio mark"
      {...props}
    >
      <rect
        x="8"
        y="8"
        width="64"
        height="64"
        rx="14"
        fill="none"
        stroke="var(--accent, #16a34a)"
        strokeWidth="4"
      />
      <rect x="24" y="22" width="8" height="36" rx="2" fill="var(--ink, #0f172a)" />
      <rect x="48" y="22" width="8" height="36" rx="2" fill="var(--ink, #0f172a)" />
      <path
        d="M28 42 Q40 30 52 42"
        fill="none"
        stroke="var(--ink, #0f172a)"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
