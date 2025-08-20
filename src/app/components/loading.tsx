"use client";

import React from "react";

type LoadingProps = {
  variant?: "ring" | "dots";
  size?: number;
  thickness?: number;
  color?: string;
  trackColor?: string;
  speed?: number; // ms
  label?: string;
  fullscreen?: boolean;
  backdrop?: boolean;
  show?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

const Loading: React.FC<LoadingProps> = ({
  variant = "ring",
  size = 28,
  thickness = 3,
  color = "currentColor",
  trackColor = "rgba(0,0,0,0.12)",
  speed = 900,
  label = "Caricamento…",
  fullscreen = false,
  backdrop = true,
  show = true,
  style,
  className,
}) => {
  if (!show) return null;

  const vars = {
    "--size": `${size}px`,
    "--thickness": `${thickness}px`,
    "--color": color,
    "--track": trackColor,
    "--speed": `${speed}ms`,
  } as React.CSSProperties & Record<"--size" | "--thickness" | "--color" | "--track" | "--speed", string>;

  const LoaderEl =
    variant === "dots" ? (
      <div className="dots" aria-hidden="true">
        <i /><i /><i />
      </div>
    ) : (
      <div className="ring" aria-hidden="true" />
    );

  const core = (
    <div
      className={`spin-root${className ? ` ${className}` : ""}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      style={{ ...vars, ...style, color }}
      data-variant={variant}
    >
      {LoaderEl}
      {/* Screen-reader متن تکراری نشه: از aria-label بالا استفاده شده */}
      <span className="sr-only">{label}</span>

      <style jsx>{`
        .spin-root {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          line-height: 1;
        }
        .sr-only {
          position: absolute !important;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0,0,0,0);
          white-space: nowrap; border: 0;
        }

        /* ===== Ring ===== */
        .ring {
          width: var(--size);
          height: var(--size);
          border-radius: 999px;
          border: var(--thickness) solid var(--track);
          border-top-color: var(--color);
          animation: spin var(--speed) linear infinite;
          will-change: transform;
        }

        /* ===== Dots ===== */
        .dots {
          width: calc(var(--size) * 2);
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: calc(var(--size) * 0.15);
        }
        .dots i {
          width: calc(var(--size) * 0.28);
          height: calc(var(--size) * 0.28);
          border-radius: 50%;
          background: var(--color);
          opacity: .8;
          animation: bounce var(--speed) ease-in-out infinite;
        }
        .dots i:nth-child(2) { animation-delay: calc(var(--speed) * .15); }
        .dots i:nth-child(3) { animation-delay: calc(var(--speed) * .30); }

        /* Motion reduce */
        @media (prefers-reduced-motion: reduce) {
          .ring { animation-duration: calc(var(--speed) * 2); }
          .dots i { animation-duration: calc(var(--speed) * 2); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: .4; }
          40% { transform: translateY(-30%); opacity: 1; }
        }
      `}</style>
    </div>
  );

  if (!fullscreen) return core;

  return (
    <div
      className="spin-overlay"
      aria-hidden="false"
      role="presentation"
    >
      {core}
      <style jsx>{`
        .spin-overlay {
          position: fixed; inset: 0;
          display: grid; place-items: center;
          z-index: 9999;
          ${backdrop ? "background: rgba(15,15,20,.45); backdrop-filter: blur(2px);" : ""}
        }
      `}</style>
    </div>
  );
};

export default Loading;
