"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoeResult } from "@/lib/engine";
import { ShoeCategory } from "@/lib/shoes";
import { shoeImages, brandFallbackColors } from "@/lib/shoeImages";

interface ShoeCardProps {
  shoe: ShoeResult;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const categoryLabels: Record<ShoeCategory, string> = {
  race: "Race",
  tempo: "Tempo",
  easy: "Easy Run",
  "all-around": "All-Around",
};

const categoryColors: Record<ShoeCategory, string> = {
  race: "#ef4444",
  tempo: "#f59e0b",
  easy: "#22c55e",
  "all-around": "#7c6dfa",
};

const brandColors: Record<string, string> = {
  Nike: "#FF6B35",
  Adidas: "#4CAF50",
  ASICS: "#2196F3",
};

function StatBar({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "10px", color: "var(--text-muted)", width: 60, flexShrink: 0 }}>
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: "4px",
          background: "var(--border)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(value / max) * 100}%`,
            height: "100%",
            background: "var(--accent)",
            borderRadius: "2px",
            transition: "width 0.5s ease",
          }}
        />
      </div>
      <span style={{ fontSize: "10px", color: "var(--text-secondary)", width: 16, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

/** Shoe photo overlay shown on hover. Falls back to a branded gradient if URL fails. */
function ShoeImageOverlay({ shoe }: { shoe: ShoeResult }) {
  const [imgFailed, setImgFailed] = useState(false);
  const imageUrl = shoeImages[shoe.id];
  const [bg1, bg2] = brandFallbackColors[shoe.brand] ?? ["#0a0a0b", "#1a1a1e"];
  const brandColor = brandColors[shoe.brand] ?? "var(--accent)";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        borderRadius: "14px",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Dark overlay so text below stays readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(160deg, ${bg1} 0%, ${bg2} 100%)`,
          opacity: 0.92,
        }}
      />

      {/* Product image */}
      {imageUrl && !imgFailed ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Image
            src={imageUrl}
            alt={`${shoe.brand} ${shoe.model}`}
            fill
            sizes="400px"
            style={{ objectFit: "contain", padding: "16px" }}
            onError={() => setImgFailed(true)}
            unoptimized
          />
        </div>
      ) : (
        /* Fallback: brand + model text centred on gradient */
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "20px",
          }}
        >
          <span style={{ fontSize: "40px" }}>👟</span>
          <span style={{ fontSize: "11px", color: brandColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
            {shoe.brand}
          </span>
          <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", textAlign: "center" }}>
            {shoe.model}
          </span>
        </div>
      )}

      {/* Bottom gradient for readability of the caption strip */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "56px",
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
        }}
      />

      {/* Caption strip */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div style={{ fontSize: "10px", color: brandColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {shoe.brand}
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "white" }}>{shoe.model}</div>
        </div>
        <div style={{ fontSize: "14px", fontWeight: 800, color: "white" }}>€{shoe.price}</div>
      </div>
    </div>
  );
}

export default function ShoeCard({ shoe, index, isSelected, onSelect }: ShoeCardProps) {
  const [hovered, setHovered] = useState(false);
  const delta = shoe.secPerKmDelta;
  const deltaStr = delta > 0 ? `-${delta}s/km` : `+${Math.abs(delta)}s/km`;
  const deltaColor = delta > 0 ? "var(--success)" : "var(--danger)";
  const brandColor = brandColors[shoe.brand] ?? "var(--accent)";
  const catColor = categoryColors[shoe.category];

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="animate-fade-in-up"
      style={{
        animationDelay: `${index * 40}ms`,
        opacity: 0,
        background: isSelected
          ? "var(--accent-glow)"
          : shoe.isBestMatch
          ? "rgba(124, 109, 250, 0.05)"
          : "var(--surface)",
        border: `1px solid ${
          isSelected ? "var(--accent)" : shoe.isBestMatch ? "rgba(124,109,250,0.3)" : "var(--border)"
        }`,
        borderRadius: "14px",
        padding: "18px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        minHeight: "160px",
      }}
    >
      {/* Best match top bar */}
      {shoe.isBestMatch && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, var(--accent), #a78bfa)",
          }}
        />
      )}

      {/* Hover image overlay — animates in/out */}
      <div
        style={{
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s ease",
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        <ShoeImageOverlay shoe={shoe} />
      </div>

      {/* ── Card content (hidden behind overlay when hovered) ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Rank badge + badges row */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", flexWrap: "wrap", paddingRight: "32px" }}>
          {/* Rank pill */}
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: shoe.rank === 1 ? "var(--gold)" : shoe.rank <= 3 ? "var(--surface-3)" : "var(--surface-2)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 700,
              color: shoe.rank === 1 ? "#1a1a00" : "var(--text-muted)",
              flexShrink: 0,
            }}
          >
            {shoe.rank === 1 ? "★" : shoe.rank}
          </div>

          <span style={{ fontSize: "10px", fontWeight: 600, color: brandColor, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {shoe.brand}
          </span>

          <span
            style={{
              fontSize: "9px",
              background: catColor + "22",
              color: catColor,
              border: `1px solid ${catColor}44`,
              borderRadius: "4px",
              padding: "1px 5px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.3px",
            }}
          >
            {categoryLabels[shoe.category]}
          </span>

          {shoe.isBestMatch && (
            <span
              style={{
                fontSize: "9px",
                background: "rgba(124,109,250,0.15)",
                color: "var(--accent)",
                border: "1px solid rgba(124,109,250,0.3)",
                borderRadius: "4px",
                padding: "1px 5px",
                fontWeight: 600,
              }}
            >
              Best match
            </span>
          )}
        </div>

        {/* Model name */}
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: "0 0 10px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {shoe.model}
        </h3>

        {/* Stat bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px" }}>
          <StatBar label="Rebound" value={shoe.rebound} />
          <StatBar label="Demping" value={shoe.cushioning} />
          <StatBar label="Stabiliteit" value={shoe.stability} />
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
              €{shoe.price}
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{shoe.weight}g</span>
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: deltaColor,
              background: delta > 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${delta > 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              borderRadius: "6px",
              padding: "2px 8px",
            }}
          >
            {deltaStr}
          </div>
        </div>
      </div>

      {/* Expandable explanation (only when selected, overlay is closed) */}
      {isSelected && !hovered && (
        <div
          className="animate-fade-in"
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: "14px",
            paddingTop: "14px",
            borderTop: "1px solid var(--border)",
            fontSize: "13px",
            lineHeight: "1.6",
            color: "var(--text-secondary)",
          }}
        >
          <p style={{ margin: 0 }}>{shoe.explanation}</p>
        </div>
      )}
    </div>
  );
}
