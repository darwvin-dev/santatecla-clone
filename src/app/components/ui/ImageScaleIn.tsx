"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ImageScaleIn({
  src,
  alt,
  ratio = "16 / 9",
  height,
}: {
  src: string;
  alt: string;
  ratio?: string | null;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && el.classList.add("inview"),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="img-card"
      style={{
        overflow: "hidden",
        width: "100%",
        ...(ratio ? { aspectRatio: ratio } : {}),
        ...(height ? { height } : {}),
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="img"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
      <style jsx>{`
        .img-card :global(.img) {
          transform: scale(2);
          transform-origin: 20% 20%; /* از گوشه بالا-چپ */
          transition: transform 2000ms cubic-bezier(.2, .8, .2, 1);
          will-change: transform;
        }
        .img-card.inview :global(.img) {
          transform: scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .img-card :global(.img) {
            transition-duration: 0ms !important;
            transform: scale(1) !important;
          }
        }
      `}</style>
    </div>
  );
}
