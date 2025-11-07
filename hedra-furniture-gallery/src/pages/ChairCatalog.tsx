import React, { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { motion, easeOut } from "framer-motion";
import { apiGetRequest } from "../../service";

/** 🔎 Import all preview images from assets (for fallback use) */
const imgModules = import.meta.glob("@/assets/products/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  as: "url",
}) as Record<string, string>;

const imagesByBase: Record<string, string> = {};
for (const [path, url] of Object.entries(imgModules)) {
  const file = path.split("/").pop()!;
  const base = file.replace(/\.(png|jpe?g|webp|svg)$/i, "");
  imagesByBase[base] = url;
}

/** Motion animation variants */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.25 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
};

interface CatalogueItem {
  id: string;
  name: string;
  imageUrl?: string;
  pdfUrl?: string;
  brandLogoUrl?: string;
  type?: string;
}

export default function ChairCatalog() {
  const [chairs, setChairs] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChairs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await apiGetRequest("catalogue/listCatalogues?type=CHAIR_CATALOGUE", token);

        if (Array.isArray(res?.items)) {
          setChairs(res.items);
        } else if (Array.isArray(res?.data)) {
          setChairs(res.data);
        } else if (Array.isArray(res)) {
          setChairs(res);
        } else {
          console.warn("Unexpected response:", res);
        }
      } catch (error) {
        console.error("Error fetching chair catalogues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChairs();
  }, []);

  const hideOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.currentTarget as HTMLImageElement).style.display = "none";
  };

  const BASE_URL = "http://localhost:8000"; // ✅ for relative URLs

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.h2
                variants={item}
                className="text-2xl md:text-3xl lg:text-4xl font-semibold text-black mb-3"
              >
                Chair Catalogue
              </motion.h2>
              <motion.div
                variants={item}
                className="w-10 h-[2px] bg-black mx-auto mb-6"
              />
              <motion.p
                variants={item}
                className="text-sm md:text-base text-gray-700 max-w-3xl mx-auto leading-relaxed"
              >
                Browse our curated collection of chairs. Download the PDF catalogues
                and explore our premium designs.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="w-full border-t border-gray-200" />

        {/* Chair Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {loading ? (
              <p className="text-gray-500">Loading chair catalogues...</p>
            ) : chairs.length === 0 ? (
              <p className="text-gray-500">No chair catalogues available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {chairs.map((chair) => {
                  const image =
                    chair.imageUrl?.startsWith("http")
                      ? chair.imageUrl
                      : `${BASE_URL}${chair.imageUrl || ""}`;
                  const hoverImage =
                    imagesByBase[`${chair.name}-hover`] ??
                    imagesByBase["sofa1"] ??
                    undefined;
                  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://hedra-app-2.onrender.com";

                  const pdfHref = chair.pdfUrl
                    ? (chair.pdfUrl.startsWith("http") ? chair.pdfUrl
                      : chair.pdfUrl.startsWith("/") ? `${API_BASE}${chair.pdfUrl}`
                        : `${API_BASE}/${chair.pdfUrl}`)
                    : undefined;


                  return (
                    <Card
                      key={chair.id}
                      className="relative overflow-hidden group shadow-md rounded-md"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={image}
                          alt={chair.name}
                          className={`w-full h-full object-cover absolute inset-0 transition-[opacity,transform] duration-500 ${hoverImage ? "group-hover:opacity-0 group-hover:scale-110" : "group-hover:scale-110"
                            }`}
                          onError={hideOnError}
                        />
                        {hoverImage && (
                          <img
                            src={hoverImage}
                            alt={`${chair.name} alternate`}
                            className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-[opacity,transform] duration-500"
                            onError={hideOnError}
                          />
                        )}
                      </div>


                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col">
                        <span className="text-white text-lg font-semibold mb-2">
                          {chair.name}
                        </span>
                        {pdfHref && (
                          <a
                            href={pdfHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-b from-red-700 to-black text-white text-sm px-4 py-2 rounded-md w-fit hover:opacity-90 transition"
                            title="Open PDF in a new tab"
                          >
                            DOWNLOAD
                          </a>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
