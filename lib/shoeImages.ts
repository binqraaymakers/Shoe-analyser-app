/**
 * Product image URLs per shoe ID.
 * Sources: official brand CDNs (adidas.com, nike.com, asics.com).
 * ShoeCard uses onError to fall back to a branded gradient when a URL fails.
 */
export const shoeImages: Record<string, string> = {
  // ─── Adidas ────────────────────────────────────────────────────────────────
  "adidas-evo-sl":
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7c49e18e85444a79b96aaf5700f07cc8_9366/Adizero_Evo_SL_Running_Shoes_Black_IH4641_01_standard.jpg",
  "adidas-sl2":
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/adizero-sl-2-shoes/adizero-sl-2-shoes.jpg",
  "adidas-boston-13":
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/adizero-boston-13/IF4599_01_standard.jpg",
  "adidas-adios-9":
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/adizero-adios-9/IG3049_01_standard.jpg",
  "adidas-adios-pro-4":
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/adizero-adios-pro-4/IF3203_01_standard.jpg",
  "adidas-adios-pro-evo-2":
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/adizero-adios-pro-evo-2/IF1831_01_standard.jpg",
  "adidas-adistar-byd":
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/adistar-byd/IG7655_01_standard.jpg",

  // ─── Nike ──────────────────────────────────────────────────────────────────
  "nike-pegasus-42":
    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/a7a1a680-d7a9-4d6f-9555-ef6d2f8a1bed/pegasus-42-road-running-shoes.png",
  "nike-pegasus-plus":
    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/0e7a3bec-53ed-43f9-a13f-cebe5c3c8b28/pegasus-plus-road-running-shoes.png",
  "nike-pegasus-premium":
    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/0c11773d-53da-4756-ac07-d5ef0929aa10/pegasus-premium-road-running-shoes.png",
  "nike-vomero-18":
    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/b9241eba-7a0f-4e4a-b19e-b3e3c5c7e2fe/vomero-18-road-running-shoes.png",
  "nike-vomero-plus":
    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/nike-vomero-plus-road-running-shoes.png",
  "nike-structure-plus":
    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/nike-structure-plus-road-running-shoes.png",
  "nike-zoom-fly-6":
    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/dfe2b5d0-eb12-4a6e-aac5-aaf4fbf2a07a/zoom-fly-6-road-running-shoes.png",
  "nike-vaporfly-4":
    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fccd06af-8a9e-4278-9f73-7f3ce3027fd0/vaporfly-4-road-racing-shoes.png",
  "nike-streakfly-2":
    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/nike-streakfly-2-road-racing-shoes.png",
  "nike-alphafly-3":
    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/84ba3d9e-0aba-4285-94ca-bb59c6e779f4/alphafly-3-road-racing-shoes.png",

  // ─── ASICS ─────────────────────────────────────────────────────────────────
  "asics-superblast-3":
    "https://images.asics.com/is/image/asics/1012B735_100_SR_RT_GLB?$aProductImage$",
  "asics-novablast-5":
    "https://images.asics.com/is/image/asics/1012B507_100_SR_RT_GLB?$aProductImage$",
  "asics-nimbus-27":
    "https://images.asics.com/is/image/asics/1011B794_100_SR_RT_GLB?$aProductImage$",
  "asics-cumulus-27":
    "https://images.asics.com/is/image/asics/1011B962_100_SR_RT_GLB?$aProductImage$",
  "asics-magic-speed-4":
    "https://images.asics.com/is/image/asics/1011B704_100_SR_RT_GLB?$aProductImage$",
  "asics-metaspeed-sky-tokyo":
    "https://images.asics.com/is/image/asics/1011B595_001_SR_RT_GLB?$aProductImage$",
  "asics-metaspeed-edge-tokyo":
    "https://images.asics.com/is/image/asics/1011B596_001_SR_RT_GLB?$aProductImage$",
  "asics-sonicblast":
    "https://images.asics.com/is/image/asics/1011B350_002_SR_RT_GLB?$aProductImage$",
  "asics-versablast-4":
    "https://images.asics.com/is/image/asics/1012B542_100_SR_RT_GLB?$aProductImage$",
  "asics-gt1000-14":
    "https://images.asics.com/is/image/asics/1011B819_001_SR_RT_GLB?$aProductImage$",
  "asics-gt2000-13":
    "https://images.asics.com/is/image/asics/1011B815_001_SR_RT_GLB?$aProductImage$",
  "asics-kayano-31":
    "https://images.asics.com/is/image/asics/1011B693_400_SR_RT_GLB?$aProductImage$",
};

/** Brand accent colours used as fallback gradient when a product image fails. */
export const brandFallbackColors: Record<string, [string, string]> = {
  Adidas: ["#0a0a0b", "#1a1a24"],
  Nike: ["#0a0a0b", "#1f1510"],
  ASICS: ["#0a0a0b", "#0e141e"],
};
