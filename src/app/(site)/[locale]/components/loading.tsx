"use client";

import React from "react";
import styles from "./Loading.module.css";
import type { CSSProperties } from "react";
import type { SVGProps } from "react";

// لوگوی شما
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

export type LoadingProps = {
  /** حالت تمام‌صفحه با بک‌درُپ */
  fullscreen?: boolean;
  /** متن برای screen reader */
  label?: string;
  /** اندازه‌ی لوگو (px) */
  logoWidth?: number;
  /** رنگ جوهری (برای لوگو و جزئیات) */
  ink?: string;
  /** رنگ پس‌زمینه بک‌درُپ */
  backdrop?: string;
  /** سرعت انیمیشن (ms) */
  speed?: number;
  /** اگر progress بدی، نوار پایین فعال میشه (0..100) */
  progress?: number;
  /** کلاس اضافه */
  className?: string;
  /** استایل inline */
  style?: CSSProperties;
};

export default function Loading({
  fullscreen = true,
  label = "Caricamento…",
  logoWidth = 190,
  ink = "#0f172a",
  backdrop = "rgba(14,16,20,.55)",
  speed = 900,
  progress,
  className,
  style
}: LoadingProps) {
  const cssVars = {
    "--ink": ink,
    "--backdrop": backdrop,
    "--speed": `${speed}ms`,
  } as CSSProperties;

  const rootClass = [
    styles.root,
    fullscreen ? styles.full : "",
    className || ""
  ].join(" ");

  const clampedProgress =
    typeof progress === "number"
      ? Math.max(0, Math.min(100, progress))
      : undefined;

  return (
    <div
      className={rootClass}
      style={{ ...cssVars, ...style }}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div className={styles.stage}>
        {/* پالس نوری پس‌زمینه لوگو */}
        <div className={styles.glow} aria-hidden="true" />
        {/* حلقه مدرن کانیک */}
        <div className={styles.ring} aria-hidden="true">
          <i className={styles.track} />
          <i className={styles.sweep} />
        </div>

        {/* لوگو */}
        <div className={styles.brand} aria-hidden="true">
          <LogoFull width={logoWidth} />
        </div>

        {/* نوار پیشرفت اختیاری */}
        {typeof clampedProgress === "number" && (
          <div className={styles.progress} aria-hidden="true">
            <div
              className={styles.progressBar}
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* متن برای SR (تکرار نشه) */}
      <span className={styles.srOnly}>{label}</span>
    </div>
  );
}
