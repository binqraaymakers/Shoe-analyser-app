"use client";

import { ShoeCategory } from "@/lib/shoes";

interface FilterBarProps {
  brands: string[];
  selectedBrands: string[];
  selectedCategory: ShoeCategory | "all";
  maxPrice: number;
  onBrandToggle: (brand: string) => void;
  onCategoryChange: (cat: ShoeCategory | "all") => void;
  onMaxPriceChange: (price: number) => void;
  totalCount: number;
  filteredCount: number;
}

const categoryOptions: { value: ShoeCategory | "all"; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "race", label: "Race" },
  { value: "tempo", label: "Tempo" },
  { value: "easy", label: "Easy" },
  { value: "all-around", label: "All-Around" },
];

export default function FilterBar({
  brands,
  selectedBrands,
  selectedCategory,
  maxPrice,
  onBrandToggle,
  onCategoryChange,
  onMaxPriceChange,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "16px 18px",
        display: "flex",
        gap: "20px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Category filter */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        {categoryOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onCategoryChange(opt.value)}
            style={{
              background:
                selectedCategory === opt.value ? "var(--accent)" : "var(--surface-2)",
              border: `1px solid ${
                selectedCategory === opt.value ? "var(--accent)" : "var(--border)"
              }`,
              borderRadius: "8px",
              padding: "5px 12px",
              fontSize: "12px",
              fontWeight: 600,
              color: selectedCategory === opt.value ? "white" : "var(--text-secondary)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div style={{ width: "1px", height: "24px", background: "var(--border)", flexShrink: 0 }} />

      {/* Brand filter */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {brands.map((brand) => {
          const active = selectedBrands.includes(brand);
          return (
            <button
              key={brand}
              onClick={() => onBrandToggle(brand)}
              style={{
                background: active ? "var(--surface-3)" : "var(--surface-2)",
                border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "8px",
                padding: "5px 10px",
                fontSize: "11px",
                fontWeight: 600,
                color: active ? "var(--accent)" : "var(--text-muted)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {brand}
            </button>
          );
        })}
      </div>

      <div style={{ width: "1px", height: "24px", background: "var(--border)", flexShrink: 0 }} />

      {/* Price filter */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          Max €{maxPrice}
        </span>
        <input
          type="range"
          min={100}
          max={300}
          step={10}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(parseInt(e.target.value))}
          style={{ width: "90px" }}
        />
      </div>

      <div style={{ marginLeft: "auto", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{filteredCount}</span>{" "}
          / {totalCount} schoenen
        </span>
      </div>
    </div>
  );
}
