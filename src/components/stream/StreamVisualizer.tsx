"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface StreamVisualizerProps {
  streams: {
    id: string;
    umkmName: string;
    ratePerSecond: number;
    particleColor: string;
    intensity?: number; // 0-1, scales particle density
  }[];
  height?: number;
  showLabels?: boolean;
}

/**
 * Visualisasi aliran uang dari UMKM (kiri) ke investor (kanan).
 * Partikel mengalir sepanjang path SVG dengan animasi Framer Motion.
 */
export function StreamVisualizer({
  streams,
  height = 280,
  showLabels = true,
}: StreamVisualizerProps) {
  const width = 1000; // viewBox width
  const innerH = height - 40;

  // Generate particle configs per stream
  const particles = useMemo(() => {
    const result: {
      streamId: string;
      umkmName: string;
      color: string;
      delay: number;
      pathY: number;
      duration: number;
    }[] = [];
    streams.forEach((stream, idx) => {
      const pathY = ((idx + 1) / (streams.length + 1)) * innerH + 20;
      const count = Math.max(4, Math.floor((stream.intensity ?? 0.5) * 8));
      for (let i = 0; i < count; i++) {
        result.push({
          streamId: stream.id,
          umkmName: stream.umkmName,
          color: stream.particleColor,
          delay: (i / count) * 2,
          pathY,
          duration: 2.2 + Math.random() * 0.8,
        });
      }
    });
    return result;
  }, [streams, innerH]);

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="stream-bg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.52 0.11 172)" stopOpacity="0.05" />
            <stop offset="50%" stopColor="oklch(0.7 0.17 75)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="oklch(0.52 0.11 172)" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Background flow lines */}
        {streams.map((stream, idx) => {
          const pathY = ((idx + 1) / (streams.length + 1)) * innerH + 20;
          return (
            <g key={`line-${stream.id}`}>
              <line
                x1={120}
                y1={pathY}
                x2={width - 120}
                y2={pathY}
                stroke={stream.particleColor}
                strokeWidth="1.5"
                strokeOpacity="0.18"
                strokeDasharray="4 6"
              />
              <line
                x1={120}
                y1={pathY}
                x2={width - 120}
                y2={pathY}
                stroke="url(#stream-bg)"
                strokeWidth="3"
                strokeOpacity="0.4"
              />
            </g>
          );
        })}

        {/* Animated particles */}
        {particles.map((p, idx) => (
          <motion.circle
            key={`particle-${p.streamId}-${idx}`}
            cx={0}
            cy={p.pathY}
            r={3.5}
            fill={p.color}
            initial={{ cx: 120, opacity: 0 }}
            animate={{ cx: [120, width - 120], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ filter: `drop-shadow(0 0 4px ${p.color})` }}
          />
        ))}

        {/* Source node: UMKM (left) — halo ring only, icon rendered as HTML overlay below */}
        <g>
          <circle
            cx={70}
            cy={height / 2}
            r={38}
            fill="var(--card)"
            stroke="oklch(0.52 0.11 172)"
            strokeWidth="2.5"
          />
        </g>

        {/* Destination node: Investor (right) — halo ring only, icon rendered as HTML overlay below */}
        <g>
          <circle
            cx={width - 70}
            cy={height / 2}
            r={38}
            fill="var(--card)"
            stroke="oklch(0.7 0.17 75)"
            strokeWidth="2.5"
          />
        </g>
      </svg>

      {/* HTML overlay: UMKM + Investor brand icons (positioned to match SVG circles, won't distort) */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/stream-umkm.png"
          alt="UMKM"
          className="absolute object-contain"
          style={{
            left: "7%",
            top: "50%",
            width: "11%",
            maxWidth: "70px",
            height: "auto",
            transform: "translate(-50%, -50%)",
          }}
        />
        <img
          src="/stream-investor.png"
          alt="Investor"
          className="absolute object-contain"
          style={{
            right: "7%",
            top: "50%",
            width: "11%",
            maxWidth: "70px",
            height: "auto",
            transform: "translate(50%, -50%)",
          }}
        />
      </div>

      {showLabels && (
        <div className="absolute inset-0 pointer-events-none">
          {streams.map((stream, idx) => {
            const pathY = ((idx + 1) / (streams.length + 1)) * innerH + 20;
            const topPct = (pathY / height) * 100;
            return (
              <div
                key={`label-${stream.id}`}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-card/80 backdrop-blur-sm border"
                style={{
                  top: `${topPct}%`,
                  color: stream.particleColor,
                  borderColor: `${stream.particleColor}40`,
                }}
              >
                {stream.umkmName} · {stream.ratePerSecond.toFixed(3)} IDR/detik
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
