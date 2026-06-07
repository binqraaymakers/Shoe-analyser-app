"use client";

import { ShoeResult } from "@/lib/engine";

interface ComparePanelProps {
  shoeA: ShoeResult;
  shoeB: ShoeResult;
  onClose: () => void;
}

function CompareRow({
  label,
  a,
  b,
  higherIsBetter = true,
}: {
  label: string;
  a: number;
  b: number;
  higherIsBetter?: boolean;
}) {
  const aWins = higherIsBetter ? a >= b : a <= b;
  const bWins = higherIsBetter ? b > a : b < a;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        gap: "12px",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div style={{ textAlign: "right" }}>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: aWins ? "var(--success)" : "var(--text-secondary)",
          }}
        >
          {a}
        </span>
      </div>
      <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", minWidth: 80 }}>
        {label}
      </div>
      <div>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: bWins ? "var(--success)" : "var(--text-secondary)",
          }}
        >
          {b}
        </span>
      </div>
    </div>
  );
}

export default function ComparePanel({ shoeA, shoeB, onClose }: ComparePanelProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in-up"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "18px",
          padding: "28px",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "85vh",
          overflowY: "auto",
          opacity: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Vergelijking</h2>
          <button
            onClick={onClose}
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "6px 12px",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Sluiten
          </button>
        </div>

        {/* Headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "12px",
              textAlign: "right",
            }}
          >
            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "2px" }}>
              {shoeA.brand}
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
              {shoeA.model}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            VS
          </div>
          <div
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "12px",
            }}
          >
            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "2px" }}>
              {shoeB.brand}
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
              {shoeB.model}
            </div>
          </div>
        </div>

        {/* Comparison rows */}
        <div>
          <CompareRow label="Score" a={shoeA.normalizedScore} b={shoeB.normalizedScore} />
          <CompareRow label="Rebound" a={shoeA.rebound} b={shoeB.rebound} />
          <CompareRow label="Demping" a={shoeA.cushioning} b={shoeB.cushioning} />
          <CompareRow label="Stabiliteit" a={shoeA.stability} b={shoeB.stability} />
          <CompareRow label="Gewicht (g)" a={shoeA.weight} b={shoeB.weight} higherIsBetter={false} />
          <CompareRow label="Prijs (€)" a={shoeA.price} b={shoeB.price} higherIsBetter={false} />
        </div>

        {/* Carbon plates */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "12px",
            padding: "8px 0",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <span
              style={{
                fontSize: "12px",
                color: shoeA.carbonPlate ? "var(--gold)" : "var(--text-muted)",
                fontWeight: 600,
              }}
            >
              {shoeA.carbonPlate ? "✓ Carbon" : "Geen carbon"}
            </span>
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", minWidth: 80 }}>
            Koolstofplaat
          </div>
          <div>
            <span
              style={{
                fontSize: "12px",
                color: shoeB.carbonPlate ? "var(--gold)" : "var(--text-muted)",
                fontWeight: 600,
              }}
            >
              {shoeB.carbonPlate ? "✓ Carbon" : "Geen carbon"}
            </span>
          </div>
        </div>

        {/* Winner */}
        <div
          style={{
            marginTop: "20px",
            background: "var(--accent-glow)",
            border: "1px solid rgba(124,109,250,0.3)",
            borderRadius: "10px",
            padding: "14px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
            Beste keuze voor jou
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--accent)",
            }}
          >
            {shoeA.normalizedScore >= shoeB.normalizedScore
              ? `${shoeA.brand} ${shoeA.model}`
              : `${shoeB.brand} ${shoeB.model}`}
          </p>
        </div>
      </div>
    </div>
  );
}
