"use client";

import React, { useEffect, useState } from "react";
import styles from "./Loading.module.css";
import type { CSSProperties } from "react";

// لوگوی خلاقانه Habitabio با طراحی مینیمال
function CreativeLogo({ color = "#3b82f6", size = 120 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="60" r="54" stroke={color} strokeWidth="3" strokeDasharray="10 6" className={styles.logoCircle} />
      <circle cx="60" cy="60" r="40" stroke={color} strokeWidth="2" strokeOpacity="0.7" className={styles.logoCircleInner} />
      <text
        x="60"
        y="65"
        textAnchor="middle"
        fill={color}
        fontFamily="Georgia, serif"
        fontSize="20"
        fontWeight="700"
        className={styles.logoText}
      >
        H
      </text>
    </svg>
  );
}

export type LoadingProps = {
  fullscreen?: boolean;
  label?: string;
  size?: number;
  color?: string;
  secondaryColor?: string;
  backdrop?: string;
  progress?: number;
  className?: string;
  style?: CSSProperties;
  showProgress?: boolean;
};

export default function Loading({
  fullscreen = true,
  label = "Loading...",
  size = 100,
  color = "#3b82f6",
  secondaryColor = "#8b5cf6",
  backdrop = "rgba(255, 255, 255, 0.92)",
  progress,
  className,
  style,
  showProgress = false,
}: LoadingProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const cssVars = {
    "--loading-color": color,
    "--loading-color-secondary": secondaryColor,
    "--loading-backdrop": backdrop,
    "--loading-size": `${size}px`,
  } as CSSProperties;

  const rootClass = [
    styles.loadingContainer,
    fullscreen ? styles.fullscreen : "",
    isVisible ? styles.visible : "",
    className || "",
  ]
    .join(" ")
    .trim();

  const progressValue = typeof progress === "number" 
    ? Math.min(100, Math.max(0, Math.round(progress))) 
    : 0;

  return (
    <div
      className={rootClass}
      style={{ ...cssVars, ...style }}
      role="status"
      aria-label={label}
    >
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <CreativeLogo color={color} size={size} />
          
          {/* ذرات چرخان اطراف لوگو */}
          <div className={styles.particles}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={styles.particle}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  backgroundColor: i % 2 === 0 ? color : secondaryColor,
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* خطای امواج */}
        <div className={styles.waveWrapper}>
          <div className={styles.wave}></div>
          <div className={styles.wave}></div>
        </div>
        
        {/* نوار پیشرفت */}
        {showProgress && (
          <div className={styles.progressContainer}>
            <div className={styles.progressText}>
              {progressValue}%
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressValue}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}