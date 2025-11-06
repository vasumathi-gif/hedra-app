import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useProducts } from '@/contexts/ProductContext';
import heroImage from '@/assets/hero-furniture.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import FadeInSection from '@/components/ui/FadeInSection';
import { ChevronRight } from "lucide-react";
import manufacturerIcon from "../assets/icons/manufacturing.png";
import wholesalerIcon from "../assets/icons/shopping_7157797.png";
import distributorIcon from "../assets/icons/delivery-truck_2127856.png"; // e.g., a truck
import retailerIcon from "../assets/icons/market_17697728.png";       // a shop/storefront
import consumerIcon from "../assets/icons/group_16073336.png";       // people silhouette
import websiteIcon from "../assets/icons/smart-tv_15445036.png";
import { apiGetRequest } from '../../service';
import {
  Truck,
  DollarSign,
  ShieldCheck,
  Handshake,
  HeartHandshake,
} from "lucide-react";

// put near the top of the file
// Scales with CSS width (recommended)
const OpenQuote: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 100 100"
    aria-hidden="true"
    className={`text-gray-300/70 ${className}`}
    preserveAspectRatio="xMinYMin meet"
  >
    <text
      x="6"          // slight left inset
      y="78"         // baseline so curves sit nicely
      fontSize="100" // big glyph; SVG scales via width classes
      fontFamily="Georgia, 'Times New Roman', Times, serif"
      fill="currentColor"
    >
      {`“`}
    </text>
  </svg>
);



// ----- Categories preview helpers (module scope) -----
type PreviewDef = { label: string; candidates: string[]; mode?: "exact" | "includes" };

// Match a real backend category name from several possible spellings
const resolveCategoryName = (candidates: string[], all: string[]): string | null => {
  const lc = new Set(all.map((c) => c.toLowerCase()));
  return candidates.find((c) => lc.has(c.toLowerCase())) || null;
};

// The preview items to show (edit order/text to taste)
const PREVIEW_DEFS: PreviewDef[] = [
  // ⬇️ Sofas now matches any category that CONTAINS "sofa"
  { label: "Sofas", candidates: ["sofa"], mode: "includes" },
  { label: "Boss Chairs", candidates: ["boss-chairs", "boss-chairs"] },
  { label: "Mesh Chairs", candidates: ["high-back-mesh-chairs", "high-back-mesh-chairs"] },
  { label: "Cafe Chairs", candidates: ["cafe-chairs", "cafe-chairs"] },
  { label: "Beds", candidates: ["bed"], mode: "includes" },
  { label: "Office Lounge Chairs", candidates: ["lounge-chairs", "lounge-chairs"] },
  { label: "Bar Stools", candidates: ["bar-stools", "bar-stools"] },
  { label: "Desk Chairs", candidates: ["office-tables-work-desks"], mode: "includes" },
  { label: "Boss Tables", candidates: ["office-tables-boss"], mode: "includes" },
];



const formatINR = (val: any) => {
  const n = typeof val === "number" ? val : Number(val);
  if (!isFinite(n)) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
};



const Index = () => {
  const { products, categories, getProductsByCategory } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [bestLoading, setBestLoading] = useState(false);
  const [bestError, setBestError] = useState<string | null>(null);
  const token = localStorage.getItem('authToken');

  const [brandLogos, setBrandLogos] = useState<any[]>([]);
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLogoLoading(true);
      setLogoError(null);
      try {
        const res = await apiGetRequest("catalogue/listCatalogues?type=BRAND_LOGO", token);
        console.log("Brand Logos Response:", res);

        // ✅ Works whether response = { items: [...] } or nested
        const list =
          Array.isArray(res?.items)
            ? res.items
            : Array.isArray(res?.data?.items)
              ? res.data.items
              : Array.isArray(res)
                ? res
                : [];

        setBrandLogos(list);
      } catch (err: any) {
        setLogoError(err?.message || "Failed to load brand logos");
      } finally {
        setLogoLoading(false);
      }
    })();
  }, [token]);



  useEffect(() => {
    (async () => {
      setBestLoading(true);
      setBestError(null);
      try {
        // ❗ endpoint only (your API_BASE_URL already has /api/)
        const res = await apiGetRequest("products/best-sellers", token);
        console.log(res)
        // handle both array or {data: [...]}
        const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        setBestSellers(list);
      } catch (e: any) {
        setBestError(e?.message || "Failed to load best sellers");
      } finally {
        setBestLoading(false);
      }
    })();
  }, []);


  // Base URL for images
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL?.replace(/\/$/, "") || "";


  useEffect(() => {
    if (products && products.length > 0) {
      setFeaturedProducts(products.filter(product => product.featured));
    }
  }, [products]);
  console.log(products)

  // Check if categories are available and are valid
  if (!categories || categories.length === 0) {
    console.error('No categories found');
  }

  const heroSlides = [
    {
      id: 1,
      image: heroImage,
      title: "Crafting Excellence in",
      highlight: "Furniture Design",
      description:
        "Where tradition meets innovation. Discover our collection of handcrafted furniture that transforms spaces into experiences.",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      title: "Inspired Living Spaces",
      highlight: "Designed for You",
      description:
        "From modern minimalism to classic charm, our furniture reflects your personality and lifestyle.",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36", // replace with your image URL or local import
      title: "Modern Comfort",
      highlight: "Redefined",
      description:
        "Experience unmatched comfort with our modern furniture designs, built to suit your lifestyle.",
    },
  ];

  const clientLogos = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Facebook", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" },
    { name: "Airbnb", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg" },
    { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
  ];

  // put above Index component (or inside, before return)
  const toAbsUrl = (url?: string, FILE_BASE = "") =>
    url && url.startsWith("http")
      ? url
      : url
        ? `${FILE_BASE}/${url.replace(/^\/+/, "")}`
        : "";

  function getFirstImageFromProduct(product: any, FILE_BASE = ""): string | null {
    // 1) If ProductContext already normalized to product.images: string[]
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return toAbsUrl(product.images[0], FILE_BASE);
    }

    // 2) If backend stored JSON string in imageUrl: '["url1","url2"]'
    if (typeof product?.imageUrl === "string" && product.imageUrl.trim()) {
      const s = product.imageUrl.trim();
      try {
        if (s.startsWith("[")) {
          const arr = JSON.parse(s);
          if (Array.isArray(arr) && arr.length > 0) {
            return toAbsUrl(arr[0], FILE_BASE);
          }
        }
        // 3) Single URL string fallback
        return toAbsUrl(s, FILE_BASE);
      } catch {
        // ignore parse errors and fall through
      }
    }

    return null;
  }

  const norm = (s?: any) => String(s ?? "").toLowerCase().trim();

  // Try to read a product's categories in a tolerant way
  function productCategoryStrings(p: any): string[] {
    const list: string[] = [];
    if (p?.category) list.push(p.category);
    if (p?.categorySlug) list.push(p.categorySlug);
    if (Array.isArray(p?.categories)) list.push(...p.categories);
    return list.map(norm).filter(Boolean);
  }

  // Does a product belong to any category that matches candidates?
  function productMatchesCandidates(p: any, candidates: string[], mode: "exact" | "includes") {
    const catStrs = productCategoryStrings(p);
    const cands = candidates.map(norm);

    if (mode === "exact") {
      return catStrs.some(cs => cands.includes(cs));
    }
    // "includes" => accept substring matches (e.g., sofa-1-seater)
    return catStrs.some(cs => cands.some(cand => cs.includes(cand)));
  }

  // Find products for a given preview item (works for both exact and includes)
  function findPreviewProducts(
    def: PreviewDef,
    categories: string[] | undefined,
    products: any[] | undefined,
    getProductsByCategory: (cat: string) => any[]
  ): any[] {
    const mode = def.mode ?? "exact";

    if (mode === "exact") {
      // old behavior: try to resolve to a single exact category name
      const lcSet = new Set((categories ?? []).map(norm));
      const hit = def.candidates.find(c => lcSet.has(norm(c)));
      return hit ? getProductsByCategory(hit) : [];
    }

    // "includes": collect any product whose category contains any candidate
    const list = (products ?? []).filter(p => productMatchesCandidates(p, def.candidates, "includes"));
    return list;
  }


  // helper once (keeps exact > includes > fallback)
  function resolveCategorySlugFor(def: PreviewDef, categories?: string[]) {
    const cats = (categories ?? []).map(c => ({ raw: c, lc: c.toLowerCase() }));
    const cands = def.candidates.map(c => c.toLowerCase());

    // exact
    for (const cand of cands) {
      const hit = cats.find(c => c.lc === cand);
      if (hit) return hit.raw;
    }
    // includes (handles sofa-1-seater, sofa-3-seater, etc.)
    for (const cand of cands) {
      const hit = cats.find(c => c.lc.includes(cand));
      if (hit) return hit.raw;
    }
    // fallback
    return def.candidates[0];
  }


  function getLogoImage(item: any): string | null {
    if (item?.imageUrl) return item.imageUrl;             // <— prefer direct URL
    if (item?.brandLogoUrl) return item.brandLogoUrl;
    if (item?.image) return `${FILE_BASE}/${String(item.image).replace(/^\/+/, "")}`;
    if (item?.thumbnailBytes) return `${FILE_BASE}/${String(item.thumbnailBytes).replace(/^\/+/, "")}`;
    return null;
  }


  const renderPreviewItem = (def: PreviewDef) => {
    const prods = findPreviewProducts(def, categories, products, getProductsByCategory);

    // choose the first product with a usable image
    const firstWithImg = prods.find(p => !!getFirstImageFromProduct(p, FILE_BASE));
    const img = firstWithImg ? getFirstImageFromProduct(firstWithImg, FILE_BASE) : null;

    // ALWAYS go to the category route (no /catalog?query=...)
    const slug = resolveCategorySlugFor(def, categories);
    const href = categories?.length ? `/${encodeURIComponent(slug)}` : "#";
    const clickable = !!categories?.length;

    return (
      <Link
        key={def.label}
        to={href}
        className="group flex flex-col items-center"
        onClick={(e) => { if (!clickable) e.preventDefault(); }}
        aria-label={clickable ? `View ${def.label}` : `${def.label} (coming soon)`}
      >
        <div className="p-1 rounded-full bg-white shadow-sm ring-1 ring-gray-200">
          <div className="h-36 w-36 sm:h-40 sm:w-40 rounded-full overflow-hidden ring-1 ring-gray-300 group-hover:ring-gray-400 transition">
            {img ? (
              <img
                src={img}
                alt={def.label}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200" />
            )}
          </div>
        </div>
        <span className="mt-3 text-sm sm:text-base font-medium text-foreground text-center">
          {def.label}
        </span>
      </Link>
    );
  };



  // split into two rows: first row 5, second row 4
  const row1: PreviewDef[] = PREVIEW_DEFS.slice(0, 5);
  const row2: PreviewDef[] = PREVIEW_DEFS.slice(5, 9);


  type FlowStep = { icon: string; label: string };

  const FlowRow = ({ title, steps }: { title: string; steps: FlowStep[] }) => (
    <div className="w-full">
      <h4 className="text-lg md:text-xl font-semibold text-foreground mb-4 ">
        {title}
      </h4>

      {/* Left-aligned, wider row so both rows start at same x-position */}
      <div className="mx-auto max-w-[1120px] flex flex-wrap items-center justify-start gap-y-8 gap-x-4 md:gap-x-5 ">
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            {/* Icon + label (bigger sizes) */}
            <div className="flex flex-col items-center w-[136px] sm:w-[152px]">
              <div className="h-20 w-20 sm:h-24 sm:w-24 flex items-center justify-center">
                <img
                  src={s.icon}
                  alt={s.label}
                  className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
                  loading="lazy"
                />
              </div>
              <div className="mt-2 text-sm sm:text-base text-muted-foreground text-center">
                {s.label}
              </div>
            </div>

            {/* Bigger arrow, fixed width keeps spacing uniform */}
            {i < steps.length - 1 && (
              <div className="w-8 sm:w-9 flex items-center justify-center">
                <ChevronRight className="h-8 w-8 md:h-9 md:w-9 opacity-60" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const BenefitIcons = {
    customization: (
      // crossed tools (simple)
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l6-6" />
        <path d="M7 17l-4 4" />
        <path d="M9.5 7.5l7 7" />
        <path d="M12.5 4.5l7 7" />
        <circle cx="10" cy="6" r="2" stroke="currentColor" />
        <circle cx="18" cy="14" r="2" stroke="currentColor" />
      </svg>
    ),
    materials: (
      // artist palette
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c5.25 0 9.5 3.77 9.5 8.2 0 2.23-1.68 3.3-3.39 3.3H17a2 2 0 0 0-2 2v.14c0 1.86-1.65 3.36-3.68 3.36C6.75 20 2.5 16.23 2.5 11.8 2.5 7.77 6.2 3 12 3z" />
        <circle cx="8.5" cy="9" r="1.1" fill="currentColor" />
        <circle cx="12" cy="7.5" r="1.1" fill="currentColor" />
        <circle cx="15.5" cy="9.5" r="1.1" fill="currentColor" />
        <circle cx="10.5" cy="12" r="1.1" fill="currentColor" />
      </svg>
    ),
    timing: (
      // clock
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
    quality: (
      // shield
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    proportions: (
      // ruler
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M7 6v3M10 6v2M13 6v3M16 6v2M19 6v3" />
      </svg>
    ),
    partnership: (
      // handshake
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 13l3 3a3 3 0 0 0 4.2 0L18 13" />
        <path d="M2.5 12l3.5-3.5a3 3 0 0 1 4.2 0L12 10l1.8-1.5a3 3 0 0 1 4.2 0L21.5 12" />
        <path d="M7.5 15.5L6 17M10 16.5L8.5 18M13 16.5L11.5 18M16 15.5L14.5 17" />
      </svg>
    ),
    savings: (
      // rupee tag
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12l-7.5 7.5a2 2 0 0 1-2.8 0L4 14.8V4h10.8L20 9.2V12z" />
        <circle cx="15" cy="9" r="1" />
        <path d="M8 7h6M8 11h3c2 0 3 1 3 2" />
      </svg>
    ),
    customize: (
      // needle/thread
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 5c-2.5 0-4 2-4 3.5S16 12 19 12" />
        <path d="M12 4L5 21" />
        <path d="M12 4c1.5 1 2.2 2.5 2 4" />
      </svg>
    ),
    commercial: (
      // shield solid check
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    support: (
      // headset
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12a8 8 0 0 1 16 0" />
        <path d="M4 13v3a2 2 0 0 0 2 2h2v-5H6a2 2 0 0 0-2 2zM20 13v3a2 2 0 0 1-2 2h-2v-5h2a2 2 0 0 1 2 2z" />
      </svg>
    ),
    supply: (
      // link
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13" />
        <path d="M14 11a5 5 0 0 1 0 7L12.5 19.5a5 5 0 0 1-7-7L7 11" />
      </svg>
    ),
    priority: (
      // tag
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12l-7.5 7.5a2 2 0 0 1-2.8 0L4 14.8V4h10.8L20 9.2V12z" />
        <circle cx="8.5" cy="8.5" r="1.2" />
      </svg>
    ),
  };



  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[70vh]">
          <Swiper
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            modules={[Autoplay]}
            className="h-full"
          >
            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div
                  className="relative min-h-[70vh] flex items-center justify-center bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-hero opacity-70" />
                  <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                      {slide.title}
                      <span className="block text-accent">{slide.highlight}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-up">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
                      <Link to="/catalog">
                        <Button variant="hero" size="lg" className="w-full sm:w-auto">
                          Explore Catalog
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      <Link to="/contact">
                        <Button variant="elegant" size="lg" className="w-full sm:w-auto">
                          Get Consultation
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>


        {/* CATEGORIES PREVIEW (Hedra Fabrications style, 5 + 4) */}
        <FadeInSection delay={0.08}>
          <section className="py-14 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">


              {/* Row 1: 2 cols (xs), 3 cols (sm), 5 cols (lg) */}
              <div
                className="grid grid-cols-[repeat(2,auto)] sm:grid-cols-[repeat(3,auto)] lg:grid-cols-[repeat(5,auto)]
             justify-center gap-x-2 gap-y-4 sm:gap-x-3 sm:gap-y-6 mx-auto"
              >
                {row1.map(renderPreviewItem)}
              </div>


              {/* Row 2: 2 cols (xs), 3 cols (sm), 4 cols (lg) */}
              <div
                className="mt-8 grid grid-cols-[repeat(2,auto)] sm:grid-cols-[repeat(3,auto)] lg:grid-cols-[repeat(4,auto)]
             justify-center gap-x-2 gap-y-4 sm:gap-x-3 sm:gap-y-6 mx-auto"
              >
                {row2.map(renderPreviewItem)}
              </div>


            </div>
          </section>
        </FadeInSection>

        {/* Divider */}
        <div className="w-[90%] mx-auto border-t border-black" />


        {/* Supply chain flows (icons from src/assets/icons) */}
        {/* ----------------- Block 1: Title + Flows ----------------- */}
        <FadeInSection delay={0.12}>
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto rounded-xl bg-white">
                {/* ----------- Why Choose Us ----------- */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Choose Us</h2>
                  <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                    We are not resellers. We are direct manufacturers with control over every stage of production.
                    This ensures competitive pricing, faster timelines, and a consistent standard of quality.
                  </p>
                </div>

                {/* Traditional Retail */}
                <FlowRow
                  title="Traditional Retail"
                  steps={[
                    { icon: manufacturerIcon, label: "Manufacturer" },
                    { icon: wholesalerIcon, label: "Wholesaler" },
                    { icon: distributorIcon, label: "Distributor" },
                    { icon: retailerIcon, label: "Retailer" },
                    { icon: consumerIcon, label: "Consumer" },
                  ]}
                />

                <div className="my-10 " />

                {/* Direct-to-Consumer */}
                <FlowRow
                  title="Direct-to-Consumer Retail (Edendek Method)"
                  steps={[
                    { icon: manufacturerIcon, label: "Manufacturer" },
                    { icon: websiteIcon, label: "Advertising / Website" },
                    { icon: consumerIcon, label: "Consumer" },
                  ]}
                />

                {/* Divider before the 5 key points */}

              </div>
            </div>
          </section>
        </FadeInSection>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />


        {/* ----------------- Block 2: 5 Key Points (separate fade) ----------------- */}
        <FadeInSection delay={0.2}>
          <section className="pt-10 pb-12 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-center">
                  {[
                    {
                      icon: <Truck className="h-6 w-6 text-primary" />,
                      title: "Faster Delivery",
                      desc: "Our streamlined supply chain ensures products reach you quickly and safely.",
                    },
                    {
                      icon: <DollarSign className="h-6 w-6 text-primary" />,
                      title: "Affordable Prices",
                      desc: "By cutting out middlemen, we keep costs lower without compromising quality.",
                    },
                    {
                      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
                      title: "Quality Assurance",
                      desc: "Every product is checked and verified before it reaches your doorstep.",
                    },
                    {
                      icon: <Handshake className="h-6 w-6 text-primary" />,
                      title: "Trusted Service",
                      desc: "We have a strong track record of reliability and customer satisfaction.",
                    },
                    {
                      icon: <HeartHandshake className="h-6 w-6 text-primary" />,
                      title: "Customer First",
                      desc: "Your feedback drives us — we tailor our services to match your needs.",
                    },
                  ].map((point, idx) => (
                    <div
                      key={idx}
                      className="px-4 flex flex-col items-center"
                      style={{ transitionDelay: `${idx * 60}ms` }} // small stagger
                    >
                      <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                        {point.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{point.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{point.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>


        {/* Divider */}
        <div className="w-[90%] mx-auto border-t border-black" />

        {/* ----------------- Block: Benefits of purchasing from Edendek ----------------- */}
        <FadeInSection delay={0.15}>
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Benefits of purchasing from Edendek
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl mx-auto">
                {/* Left */}
                <div className="pr-6 md:pr-10">
                  <h3 className="mb-6 text-xl font-semibold text-center ml-10">
                    For Interior Designers &amp; Architects
                  </h3>

                  <ul className="space-y-5 ml-20">
                    {[
                      { title: "Unlimited Customization", desc: "Bring Any Design to Life.", icon: BenefitIcons.customization },
                      { title: "Extensive Material Selection", desc: "1200+ Fabric & Leatherette colour Options.", icon: BenefitIcons.materials },
                      { title: "Reliable Project Timing", desc: "Guaranteed On-Time Delivery.", icon: BenefitIcons.timing },
                      { title: "Confidence in Quality", desc: "Superior Materials & Craftsmanship.", icon: BenefitIcons.quality },
                      { title: "Perfect Proportions", desc: "Furniture Tailored to Your Exact Space.", icon: BenefitIcons.proportions },
                      { title: "A True Partnership", desc: "We Execute Your Unique Vision.", icon: BenefitIcons.partnership },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 ml-12">
                        <span
                          className="
    mt-0.5 inline-flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center
    rounded-md bg-[#EEF1FF] text-[#633501] 
    [&>svg]:h-5 [&>svg]:w-5 md:[&>svg]:h-6 md:[&>svg]:w-6
  "
                        >
                          {item.icon}
                        </span>

                        <div>
                          <p className="font-medium">{item.title}:{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>


                {/* Right */}
                <div>
                  <h3 className="mb-6 text-xl font-semibold text-center ml-10">
                    For Bulk Purchasers &amp; Corporate Clients
                  </h3>
                  <ul className="space-y-5 ml-20">
                    {[
                      { title: "Significant Cost Savings", desc: "by Cutting Out the Middleman.", icon: BenefitIcons.savings },
                      { title: "Fully Customize Designs", desc: "Fabrics, and Branding.", icon: BenefitIcons.customize },
                      { title: "Guaranteed Commercial-Grade", desc: "Quality and Durability.", icon: BenefitIcons.commercial },
                      { title: "Direct Expert Support", desc: "and Streamlined Logistics.", icon: BenefitIcons.support },
                      { title: "Access to a Long-Term Supply", desc: "of Parts and Replacements.", icon: BenefitIcons.supply },
                      { title: "Priority Service", desc: "and Volume-Based Pricing.", icon: BenefitIcons.priority },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 ml-12">
                        <span
                          className="
    mt-0.5 inline-flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center
    rounded-md bg-[#EEF1FF] text-[#633501]
    [&>svg]:h-5 [&>svg]:w-5 md:[&>svg]:h-6 md:[&>svg]:w-6
  "
                        >
                          {item.icon}
                        </span>

                        <div>
                          <p className="font-medium">{item.title}:{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* Divider */}
        <div className="w-[90%] mx-auto border-t border-black" />


        {/* --- BEST SELLERS (from API via apiGetRequest) --- */}
        <FadeInSection delay={0.1}>
          <section className="py-14 bg-white" id="best-sellers">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Best Sellers</h2>
                <p className="text-muted-foreground max-w-3xl mx-auto mt-3">
                  This collection features our most loved pieces by architects and interior designers —
                  proven favorites that stand the test of time.
                </p>
              </div>

              {bestLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-[4/3] animate-pulse bg-gray-100" />
                      <CardContent className="py-4">
                        <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {bestError && !bestLoading && (
                <div className="text-center text-red-600">Failed to load best sellers. {bestError}</div>
              )}

              {!bestLoading && !bestError && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {bestSellers.map((p: any) => {
                    const img = getFirstImageFromProduct(p, FILE_BASE);
                    const title = p?.name || p?.title || "Untitled";

                    // prefer p.id; fallback to _id if your API uses Mongo-style ids
                    const pid = p?.id ?? p?._id;

                    // if no id, don't navigate
                    const canOpen = !!pid;

                    return (
                      <Link
                        to="/product"
                        state={canOpen ? { id: pid } : undefined}
                        onClick={(e) => { if (!canOpen) e.preventDefault(); }}
                        key={pid || p?.slug || title}
                        className="block"
                        aria-label={canOpen ? `Open ${title}` : `${title} (unavailable)`}
                      >
                        <Card className="overflow-hidden group hover:shadow-elegant transition-all">
                          <div className="aspect-[4/3] bg-gray-100">
                            {img ? (
                              <img
                                src={img}
                                alt={title}
                                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                            )}
                          </div>
                          <CardContent className="py-4">
                            <div className="text-center font-semibold tracking-wide uppercase">
                              {title}
                            </div>
                            <CardContent className="py-4">
                              <div className="text-center space-y-1">
                                {/* Price row */}
                                {(() => {
                                  const price = p?.price ?? p?.sellingPrice ?? p?.pricing?.price;
                                  const mrp = p?.mrp ?? p?.listPrice ?? p?.pricing?.mrp;
                                  const priceFmt = formatINR(price);
                                  const mrpFmt = formatINR(mrp);

                                  if (!priceFmt && !mrpFmt) return null;

                                  return (
                                    <div className="text-sm">
                                      {priceFmt && (
                                        <span className="font-medium text-foreground">{priceFmt}</span>
                                      )}
                                      {mrpFmt && mrpFmt !== priceFmt && (
                                        <span className="ml-2 text-muted-foreground line-through">
                                          {mrpFmt}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })()}
                              </div>
                            </CardContent>

                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}

              {!bestLoading && !bestError && bestSellers.length === 0 && (
                <div className="text-center text-muted-foreground">No best sellers to display yet.</div>
              )}
            </div>
          </section>
        </FadeInSection>



        {/* Divider */}
        <div className="w-[90%] mx-auto border-t border-black" />


        {/* --- CLIENT TESTIMONIALS --- */}
        <FadeInSection delay={0.15}>
          <section className="py-16 bg-white" id="client-testimonials">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                  CLIENT TESTIMONIALS
                </h2>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                {[
                  {
                    text:
                      "I like all the chairs specially Gavin is lovely. Very happy with services and coordination is super. Thank you so much for prompt delivery 🙏🌸 Keep it up good work👍",
                    author: "Sujata Naik, Homestyling",
                  },
                  {
                    text:
                      "Edendek has been a great furniture partner for us since the beginning of our journey at 91Springboard. They have also managed to scale their capacity well in line with our rapid expansion. They have been able to match our product needs and have always delivered on time.",
                    author: "Pranay Gupta, Co-Founder, 91Springboard",
                  },
                  {
                    text:
                      "For our work furniture requirements, we have many vendors on-board. Edendek is a furniture partner with the best track record of quality and service, and the lowest complaint rate compared to others.",
                    author:
                      "Anirudh Sundareswar, Director & Head of Sourcing, BNY Mellon",
                  },
                  {
                    text:
                      "We really like the quality and finish provided by Edendek in their teak wood and upholstered furniture. I hope they open a showroom in Bangalore soon, for us to take our clients there.",
                    author: "Sunitha Kondur, Partner, HundredHands",
                  },
                  {
                    text:
                      "Edendek is a great furniture partner for architects and interior designers. It was easy to communicate and discuss designs with them. Their products and service is awesome.",
                    author:
                      "Shraddhanjali Chowdhury, Architect, Balan and Nambisan Architects",
                  },
                  {
                    text:
                      "Edendek team has a good design sense and are able to connect with the designer community quite well. What I like about them is that they also provide customised furniture for our projects, beyond what they have in their catalog.",
                    author: "Kruti Parikh, Associate Design Director, FITCH",
                  },
                ].map((t, idx) => (
                  <div key={idx} className="relative">
                    {/* Big quote mark */}
                    <OpenQuote className="absolute -top-3 -left-3 w-20 sm:w-24 pointer-events-none select-none" />

                    {/* Content block with left padding so quote doesn't overlap */}
                    <div className="pl-8 sm:pl-10">
                      {/* Body (smaller, lighter, slightly tighter like screenshot) */}
                      <p className="text-gray-700 text-sm md:text-base leading-7 relative z-10">
                        {t.text}
                      </p>

                      {/* Divider + Author aligned to the right */}
                      <div className="mt-6 flex items-center justify-end gap-4">
                        <div className="h-[2px] w-20 bg-black" />
                        <span className="text-sm font-normal text-gray-900">
                          {t.author}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>




        {/* Divider */}
        <div className="w-[90%] mx-auto border-t border-black" />

        {/* Clients Slider */}
        <FadeInSection delay={0.2}>
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Trusted by Leading Brands
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                We’re proud to work with clients who trust our craftsmanship and innovation.
              </p>

              {logoLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-100 rounded-md animate-pulse mx-auto w-32"
                    />
                  ))}
                </div>
              )}

              {logoError && <div className="text-red-600 mt-4">{logoError}</div>}

              {!logoLoading && !logoError && (
                brandLogos.length > 0 ? (
                  <Swiper
                    slidesPerView={2}
                    spaceBetween={30}
                    loop
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    breakpoints={{
                      640: { slidesPerView: 3 },
                      768: { slidesPerView: 4 },
                      1024: { slidesPerView: 5 },
                    }}
                    modules={[Autoplay]}
                  >
                    {brandLogos.map((b, idx) => (
                      <SwiperSlide
                        key={b.id || idx}
                        className="flex items-center justify-center px-4"
                      >
                        <div className="h-24 flex items-center justify-center overflow-hidden">
                          {b.imageUrl ? (
                            <img
                              src={b.imageUrl}
                              alt={b.name || `Brand ${idx + 1}`}
                              className="h-20 w-auto object-contain transition-transform duration-500 ease-in-out hover:scale-105 hover:opacity-90"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-16 w-32 bg-gray-100 rounded-md" />
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="text-gray-500">No brand logos found.</div>
                )
              )}
            </div>
          </section>
        </FadeInSection>



        {/* CTA Section */}
        <FadeInSection delay={0.3}>
          <section className="py-16 bg-gradient-hero text-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Space?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Get in touch with our design experts and discover how we can create the perfect furniture for your home or office.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Start Your Project
                  </Button>
                </Link>
                <Link to="/catalog">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-black hover:bg-white hover:text-primary">
                    Browse Catalog
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </FadeInSection>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
