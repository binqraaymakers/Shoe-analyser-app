"use client";

import { ShoeResult } from "@/lib/engine";
import { ShoeCategory } from "@/lib/shoes";

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
  HOKA: "#FF5722",
  Brooks: "#9C27B0",
  "New Balance": "#FF9800",
};

function ScoreRing({ score }: { score: number }) {
  const radius = 24;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#22c55e" : score >= 55 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
      <svg width={64} height={64} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={32} cy={32} r={radius} fill="none" stroke="var(--border)" strokeWidth={4} />
        <circle
          cx={32}
          cy={32}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
      </div>
    </div>
  );
}

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

export default function ShoeCard({ shoe, index, isSelected, onSelect }: ShoeCardProps) {
  const delta = shoe.secPerKmDelta;
  const deltaStr = delta > 0 ? `-${delta}s/km` : `+${Math.abs(delta)}s/km`;
  const deltaColor = delta > 0 ? "var(--success)" : "var(--danger)";
  const brandColor = brandColors[shoe.brand] ?? "var(--accent)";
  const catColor = categoryColors[shoe.category];

  return (
    <div
      onClick={onSelect}
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
      }}
    >
      {/* Rank badge */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          right: "14px",
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
        }}
      >
        {shoe.rank === 1 ? "★" : shoe.rank}
      </div>

      {/* Best match banner */}
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

      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
        {/* Score ring */}
        <ScoreRing score={shoe.normalizedScore} />

        {/* Main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: brandColor,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
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
            {shoe.carbonPlate && (
              <span
                style={{
                  fontSize: "9px",
                  background: "rgba(251,191,36,0.1)",
                  color: "#fbbf24",
                  border: "1px solid rgba(251,191,36,0.3)",
                  borderRadius: "4px",
                  padding: "1px 5px",
                  fontWeight: 600,
                }}
              >
                Carbon
              </span>
            )}
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

          <h3
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: "0 0 8px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              paddingRight: "32px",
            }}
          >
            {shoe.model}
          </h3>

          {/* Stats bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px" }}>
            <StatBar label="Rebound" value={shoe.rebound} />
            <StatBar label="Demping" value={shoe.cushioning} />
            <StatBar label="Stabiliteit" value={shoe.stability} />
          </div>

          {/* Footer row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                €{shoe.price}
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {shoe.weight}g
              </span>
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
      </div>

      {/* Expandable explanation */}
      {isSelected && (
        <div
          className="animate-fade-in"
          style={{
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
