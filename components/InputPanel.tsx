"use client";

import { Distance, Experience, RunnerProfile } from "@/lib/engine";

interface InputPanelProps {
  profile: RunnerProfile;
  paceInput: string;
  onChange: (profile: RunnerProfile) => void;
  onPaceChange: (raw: string) => void;
}

const distances: { value: Distance; label: string; sub: string }[] = [
  { value: "5K", label: "5K", sub: "5 km" },
  { value: "10K", label: "10K", sub: "10 km" },
  { value: "half", label: "HM", sub: "21.1 km" },
  { value: "marathon", label: "M", sub: "42.2 km" },
];

const experiences: { value: Experience; label: string; desc: string }[] = [
  { value: "beginner", label: "Beginner", desc: "< 1 jaar" },
  { value: "intermediate", label: "Intermediate", desc: "1–3 jaar" },
  { value: "advanced", label: "Advanced", desc: "3+ jaar" },
];

export default function InputPanel({ profile, paceInput, onChange, onPaceChange }: InputPanelProps) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "18px" }}>⚡</span>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
            Jouw Loopersprofiel
          </h2>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
          Vul je gegevens in voor een persoonlijk advies
        </p>
      </div>

      {/* Weight */}
      <div>
        <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>Gewicht</span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent)" }}>
            {profile.weight} kg
          </span>
        </label>
        <input
          type="range"
          min={40}
          max={130}
          value={profile.weight}
          onChange={(e) => onChange({ ...profile, weight: parseInt(e.target.value) })}
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>40 kg</span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>130 kg</span>
        </div>
      </div>

      {/* Pace */}
      <div>
        <label style={{ display: "block", marginBottom: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>
            Gewenst tempo
          </span>
        </label>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={paceInput}
            onChange={(e) => onPaceChange(e.target.value)}
            placeholder="4:30"
            style={{
              width: "100%",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "10px 60px 10px 14px",
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--text-primary)",
              outline: "none",
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = "var(--accent)";
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = "var(--border)";
            }}
          />
          <span
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "12px",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            min/km
          </span>
        </div>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
          Formaat: 4:30 of 4.5
        </p>
      </div>

      {/* Distance */}
      <div>
        <label style={{ display: "block", marginBottom: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>
            Afstand
          </span>
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px" }}>
          {distances.map((d) => (
            <button
              key={d.value}
              onClick={() => onChange({ ...profile, distance: d.value })}
              style={{
                background: profile.distance === d.value ? "var(--accent)" : "var(--surface-2)",
                border: `1px solid ${profile.distance === d.value ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "10px",
                padding: "10px 4px",
                cursor: "pointer",
                textAlign: "center",
                color: profile.distance === d.value ? "white" : "var(--text-secondary)",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 700 }}>{d.label}</div>
              <div style={{ fontSize: "10px", opacity: 0.7, marginTop: "2px" }}>{d.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <label style={{ display: "block", marginBottom: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>
            Ervaring
          </span>
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {experiences.map((exp) => (
            <button
              key={exp.value}
              onClick={() => onChange({ ...profile, experience: exp.value })}
              style={{
                background:
                  profile.experience === exp.value ? "var(--accent-glow)" : "var(--surface-2)",
                border: `1px solid ${
                  profile.experience === exp.value ? "var(--accent)" : "var(--border)"
                }`,
                borderRadius: "10px",
                padding: "10px 14px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: profile.experience === exp.value ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 500 }}>{exp.label}</span>
              <span style={{ fontSize: "11px", opacity: 0.6 }}>{exp.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile summary */}
      <div
        style={{
          background: "var(--surface-3)",
          borderRadius: "10px",
          padding: "12px 14px",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "0 0 6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Samenvatting
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            `${profile.weight} kg`,
            paceInput || "–",
            distances.find((d) => d.value === profile.distance)?.label ?? "",
            profile.experience,
          ].map((tag, i) => (
            <span
              key={i}
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "3px 8px",
                fontSize: "11px",
                color: "var(--text-secondary)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
