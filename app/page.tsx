"use client";

import { useState, useMemo } from "react";
import { shoes, brands } from "@/lib/shoes";
import { ShoeCategory } from "@/lib/shoes";
import { RunnerProfile, ShoeResult, rankShoes, parsePace } from "@/lib/engine";
import InputPanel from "@/components/InputPanel";
import ShoeCard from "@/components/ShoeCard";
import FilterBar from "@/components/FilterBar";
import ComparePanel from "@/components/ComparePanel";

const defaultProfile: RunnerProfile = {
  weight: 75,
  pace: 5.0,
  distance: "10K",
  experience: "intermediate",
};

function SectionHeader({
  title,
  subtitle,
  accent,
  count,
}: {
  title: string;
  subtitle: string;
  accent?: string;
  count: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "2px",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h2
            style={{
              fontSize: "17px",
              fontWeight: 700,
              margin: 0,
              color: accent ?? "var(--text-primary)",
            }}
          >
            {title}
          </h2>
          <span
            style={{
              fontSize: "11px",
              background: accent ? accent + "22" : "var(--surface-3)",
              color: accent ?? "var(--text-secondary)",
              border: `1px solid ${accent ? accent + "44" : "var(--border)"}`,
              borderRadius: "20px",
              padding: "1px 8px",
              fontWeight: 600,
            }}
          >
            {count}
          </span>
        </div>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [profile, setProfile] = useState<RunnerProfile>(defaultProfile);
  const [paceInput, setPaceInput] = useState("5:00");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(brands);
  const [selectedCategory, setSelectedCategory] = useState<ShoeCategory | "all">("all");
  const [maxPrice, setMaxPrice] = useState(510);
  const [selectedShoeId, setSelectedShoeId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  function handlePaceChange(raw: string) {
    setPaceInput(raw);
    const parsed = parsePace(raw);
    if (!isNaN(parsed) && parsed > 0) {
      setProfile((p) => ({ ...p, pace: parsed }));
    }
  }

  function handleBrandToggle(brand: string) {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }

  // Rank all shoes together so scores are computed in full context
  const allRanked = useMemo(() => rankShoes(shoes, profile), [profile]);

  // Split into carbon & non-carbon BEFORE filters, so rankings are meaningful
  const carbonRanked = useMemo(
    () =>
      rankShoes(
        shoes.filter((s) => s.carbonPlate),
        profile
      ),
    [profile]
  );
  const nonCarbonRanked = useMemo(
    () =>
      rankShoes(
        shoes.filter((s) => !s.carbonPlate),
        profile
      ),
    [profile]
  );

  function applyFilters(list: ShoeResult[]) {
    return list.filter((s) => {
      const brandOk = selectedBrands.includes(s.brand);
      const catOk = selectedCategory === "all" || s.category === selectedCategory;
      const priceOk = s.price <= maxPrice;
      return brandOk && catOk && priceOk;
    });
  }

  const filteredCarbon = useMemo(() => applyFilters(carbonRanked), [carbonRanked, selectedBrands, selectedCategory, maxPrice]);
  const filteredNonCarbon = useMemo(() => applyFilters(nonCarbonRanked), [nonCarbonRanked, selectedBrands, selectedCategory, maxPrice]);
  const totalFiltered = filteredCarbon.length + filteredNonCarbon.length;

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [...prev.slice(1), id];
      return [...prev, id];
    });
  }

  const compareShoes = compareIds
    .map((id) => allRanked.find((s) => s.id === id))
    .filter(Boolean) as ShoeResult[];

  const topNonCarbon = filteredNonCarbon[0];
  const topCarbon = filteredCarbon[0];

  function ShoeGrid({
    list,
    startIndex = 0,
  }: {
    list: ShoeResult[];
    startIndex?: number;
  }) {
    if (list.length === 0) return null;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
          gap: "12px",
        }}
      >
        {list.map((shoe, i) => (
          <div key={shoe.id} style={{ position: "relative" }}>
            <ShoeCard
              shoe={shoe}
              index={startIndex + i}
              isSelected={selectedShoeId === shoe.id}
              onSelect={() => setSelectedShoeId((prev) => (prev === shoe.id ? null : shoe.id))}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCompare(shoe.id);
              }}
              title="Toevoegen aan vergelijking"
              style={{
                position: "absolute",
                bottom: "46px",
                right: "14px",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: compareIds.includes(shoe.id) ? "var(--accent)" : "var(--surface-3)",
                border: `1px solid ${compareIds.includes(shoe.id) ? "var(--accent)" : "var(--border)"}`,
                color: compareIds.includes(shoe.id) ? "white" : "var(--text-muted)",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                zIndex: 10,
              }}
            >
              {compareIds.includes(shoe.id) ? "✓" : "+"}
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--text-primary)" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 24px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "var(--accent)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              👟
            </div>
            <div>
              <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.3px" }}>RunIQ</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "8px" }}>
                Shoe Performance Optimizer
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {compareIds.length === 2 && (
              <button
                onClick={() => setShowCompare(true)}
                style={{
                  background: "var(--accent)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "7px 14px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Vergelijk 2 schoenen
              </button>
            )}
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "5px 10px",
              }}
            >
              {shoes.length} schoenen
            </div>
          </div>
        </div>
      </header>

      {/* Top picks banner */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(124,109,250,0.06) 0%, rgba(124,109,250,0.01) 100%)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "10px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            gap: "24px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {topNonCarbon && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Top regulier
              </span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                {topNonCarbon.brand} {topNonCarbon.model}
              </span>
              <span style={{ fontSize: "12px", color: topNonCarbon.secPerKmDelta > 0 ? "var(--success)" : "var(--danger)", fontWeight: 600 }}>
                {topNonCarbon.secPerKmDelta > 0 ? "▲" : "▼"} {Math.abs(topNonCarbon.secPerKmDelta)}s/km
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>€{topNonCarbon.price}</span>
            </div>
          )}

          {topNonCarbon && topCarbon && (
            <div style={{ width: "1px", height: "20px", background: "var(--border)" }} />
          )}

          {topCarbon && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "10px", color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                ⚡ Top carbon
              </span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                {topCarbon.brand} {topCarbon.model}
              </span>
              <span style={{ fontSize: "12px", color: topCarbon.secPerKmDelta > 0 ? "var(--success)" : "var(--danger)", fontWeight: 600 }}>
                {topCarbon.secPerKmDelta > 0 ? "▲" : "▼"} {Math.abs(topCarbon.secPerKmDelta)}s/km
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>€{topCarbon.price}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main layout */}
      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Left: Input panel */}
        <div style={{ position: "sticky", top: "84px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <InputPanel
            profile={profile}
            paceInput={paceInput}
            onChange={setProfile}
            onPaceChange={handlePaceChange}
          />

          {compareIds.length > 0 && (
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "14px",
              }}
            >
              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                Vergelijking ({compareIds.length}/2)
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {compareIds.map((id) => {
                  const s = allRanked.find((x) => x.id === id);
                  return s ? (
                    <div
                      key={id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "8px 10px",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{s.brand}</div>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>
                          {s.model}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCompare(id)}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "14px", padding: "2px" }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
              {compareIds.length === 2 && (
                <button
                  onClick={() => setShowCompare(true)}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    background: "var(--accent)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "9px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Vergelijk nu →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <FilterBar
            brands={brands}
            selectedBrands={selectedBrands}
            selectedCategory={selectedCategory}
            maxPrice={maxPrice}
            onBrandToggle={handleBrandToggle}
            onCategoryChange={setSelectedCategory}
            onMaxPriceChange={setMaxPrice}
            totalCount={shoes.length}
            filteredCount={totalFiltered}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 2px" }}>Schoenen Ranking</h1>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                {profile.weight}kg · {paceInput}/km · {profile.distance} · {profile.experience}
              </p>
            </div>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "right", margin: 0 }}>
              Hover voor foto · klik voor uitleg
              <br />
              <strong>+</strong> om te vergelijken
            </p>
          </div>

          {totalFiltered === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
              <p style={{ fontSize: "14px" }}>Geen schoenen gevonden met deze filters.</p>
            </div>
          ) : (
            <>
              {/* ── Non-carbon section ── */}
              {filteredNonCarbon.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <SectionHeader
                    title="Reguliere schoenen"
                    subtitle="Gerangschikt op jouw profiel — zonder carbon plaat"
                    count={filteredNonCarbon.length}
                  />
                  <ShoeGrid list={filteredNonCarbon} startIndex={0} />
                </div>
              )}

              {/* ── Carbon section ── */}
              {filteredCarbon.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* Divider */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 0 4px",
                      borderTop: "1px solid var(--border)",
                      marginTop: "4px",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(251,191,36,0.08)",
                        border: "1px solid rgba(251,191,36,0.25)",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ fontSize: "14px" }}>⚡</span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#fbbf24" }}>Carbon Plated</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                      Aparte categorie — carbon plaat geeft inherent een scoordeel en wordt hier los vergeleken
                    </p>
                  </div>

                  <SectionHeader
                    title="Carbon schoenen"
                    subtitle="Gerangschikt binnen de carbon-categorie op jouw profiel"
                    accent="#fbbf24"
                    count={filteredCarbon.length}
                  />
                  <ShoeGrid list={filteredCarbon} startIndex={filteredNonCarbon.length} />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {showCompare && compareShoes.length === 2 && (
        <ComparePanel
          shoeA={compareShoes[0]}
          shoeB={compareShoes[1]}
          onClose={() => setShowCompare(false)}
        />
      )}

      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "20px 24px",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
          RunIQ · Shoe Performance Optimizer · Data is indicatief op basis van dummy data
        </p>
      </footer>
    </div>
  );
}
