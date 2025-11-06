

// src/pages/CategoryProducts.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { apiGetRequest } from "../../service.tsx";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | string[];
  category: string;
};

// -------------- helpers --------------
const firstImageFrom = (img?: string | string[]) => {
  if (!img) return undefined;
  if (Array.isArray(img)) return img[0];
  try {
    const parsed = JSON.parse(img);
    if (Array.isArray(parsed) && parsed.length) return String(parsed[0]);
  } catch {}
  const first = img.split(/[,;\s]+/).find(Boolean);
  return first;
};

// Parent → subcategories (labels & slugs are static; thumbnails are fetched)
const SUBCATEGORY_MAP: Record<
  string,
  { value: string; label: string }[]
> = {
  // SOFA
  "sofa": [
    { value: "sofa",               label: "All Sofas" },
    { value: "sofa-1-seater",      label: "1 seater to Single seater" },
    { value: "sofa-2-seater",      label: "2 seater to Two-Seater" },
    { value: "sofa-3-seater",      label: "3 Seater to Three-seater" },
    { value: "sofa-4-seater-plus", label: "4 seater to four-seater" },
    { value: "sofa-corner",        label: "Corner Sofas" },
    { value: "sofa-modular",       label: "Modular Sofas" },
    { value: "sofa-lounge",        label: "Lounge Sofas" },
    { value: "sofa-recliner",      label: "Recliners" },
  ],

  // CENTER TABLES
  "center-tables": [
    { value: "center-tables",           label: "All Center Tables" },
    { value: "center-tables-rectangular", label: "Rectangular Tables" },
    { value: "center-tables-oval",        label: "Oval Tables" },
    { value: "center-tables-circular",    label: "Circular Tables" },
  ],

  // BEDS
  "bed": [
    { value: "bed",                 label: "All Beds" },
    { value: "bed-regular",         label: "Regular Beds" },
    { value: "bed-storage",         label: "Beds with Storage" },
    { value: "bed-bedside-tables",  label: "Bedside Tables" },
    { value: "bed-stools",          label: "Bedroom Stools" },
    { value: "bed-dressing-chairs", label: "Dressing Table Chairs" },
  ],

  // DINING TABLES
  "dining-table": [
    { value: "dining-table",           label: "All Dining Tables" },
    { value: "dining-table-rectangular", label: "Rectangular" },
    { value: "dining-table-circular",    label: "Circular" },
    { value: "dining-table-oval",        label: "Oval" },
  ],

  // OFFICE TABLES
  "office-tables": [
    { value: "office-tables",          label: "All Tables" },
    { value: "office-tables-boss",     label: "Boss Tables" },
    { value: "office-tables-conference", label: "Conference Room" },
    { value: "office-tables-work-desks", label: "Work Desks" },
    { value: "office-tables-center",     label: "Center Tables" },
  ],
};

const PLACEHOLDER = "/placeholder.jpg";

// -------------- page --------------
const CategoryProducts = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // figure out the "family" key for subcategories (e.g., "sofa" for any sofa-*)
  const familyKey = useMemo(() => {
    if (!category) return undefined;
    const keys = Object.keys(SUBCATEGORY_MAP);
    // pick the longest matching key to be safe
    return keys
      .filter((k) => category === k || category.startsWith(k))
      .sort((a, b) => b.length - a.length)[0];
  }, [category]);

  // subcategories for this family (if any)
  const subcats = familyKey ? SUBCATEGORY_MAP[familyKey] : [];

  // thumbnails for each subcategory: slug → image url
  const [subThumbs, setSubThumbs] = useState<Record<string, string>>({});

  // fetch thumbnails dynamically (first product image in each subcategory)
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!subcats.length) {
        setSubThumbs({});
        return;
      }
      try {
        const token = localStorage.getItem("token") || "";
        const results = await Promise.all(
          subcats.map(async (s) => {
            try {
              // uses existing endpoint; we take the first product (if any)
              const data: Product[] = await apiGetRequest(
                `products/getProductsByCategory/${s.value}`,
                token
              );
              const img =
                data?.length ? firstImageFrom(data[0]?.imageUrl) ?? PLACEHOLDER : PLACEHOLDER;
              return [s.value, img] as const;
            } catch {
              return [s.value, PLACEHOLDER] as const;
            }
          })
        );
        if (!cancelled) {
          const map: Record<string, string> = {};
          results.forEach(([slug, img]) => (map[slug] = img));
          setSubThumbs(map);
        }
      } catch {
        if (!cancelled) setSubThumbs({});
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [familyKey]); // re-fetch when switching to a new family

  // fetch current list of products
  useEffect(() => {
    if (!category) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || "";
        const data = await apiGetRequest(
          `products/getProductsByCategory/${category}`,
          token
        );
        setProducts(data ?? []);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  if (loading) {
    return <div className="container mx-auto px-4 py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:underline">Home</Link> /{" "}
          <span className="capitalize">{category?.replace(/-/g, " ")}</span>

        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-5 capitalize">
  {category?.replace(/-/g, " ")}
</h1>


        {/* ✅ Dynamic subcategory strip (images from API) */}
        {!!subcats.length && (
         <div className="mb-6">
  {/* smaller, auto-fit grid */}
  <div className="[grid-template-columns:repeat(auto-fit,minmax(120px,1fr))] grid gap-3">
    {subcats.map((s) => {
      const active = category === s.value;
      const img = subThumbs[s.value] || PLACEHOLDER;
      return (
        <button
          key={s.value}
          type="button"
          onClick={() => navigate(`/${s.value}`)}
        className={`text-left rounded-lg border bg-white overflow-hidden transition hover:shadow-md focus:outline-none ${
  active ? "border-primary" : "border-gray-200"
}`}

        >
          {/* smaller thumbnail box */}
          <div className="w-full h-24 sm:h-28 overflow-hidden">
            <img
              src={img}
              alt={s.label}
              className="h-full w-full object-cover"
              // onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
            />
          </div>
          {/* tighter label */}
          <div className="px-2 py-1.5">
            <div className="text-xs sm:text-[13px] font-medium leading-tight line-clamp-2">
              {s.label}
            </div>
          </div>
        </button>
      );
    })}
  </div>
</div>

        )}

        {/* Product Grid */}
        {products.length === 0 ? (
          <p className="text-muted-foreground">No products found in {category}.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const firstImage = firstImageFrom(p.imageUrl) || PLACEHOLDER;
              return (
                <div
                  key={p.id}
                  className="group cursor-pointer"
                  onClick={() => navigate("/product", { state: { id: p.id } })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate("/product", { state: { id: p.id } })}
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-white">
                    <img
                      src={firstImage}
                      alt={p.name}
                      onError={(e) => ((e.currentTarget.src = PLACEHOLDER))}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="text-base font-semibold">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Rs. {Number(p.price ?? 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryProducts;
