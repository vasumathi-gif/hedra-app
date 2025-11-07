import React, { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { motion, easeOut } from "framer-motion";
import { apiGetRequest } from "../../service";

/** 🔎 Import all upholstery preview images */
const imgModules = import.meta.glob("@/assets/upholstery/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  as: "url",
}) as Record<string, string>;

const imagesByBase: Record<string, string> = {};
for (const [path, url] of Object.entries(imgModules)) {
  const file = path.split("/").pop()!;
  const base = file.replace(/\.(png|jpe?g|webp|svg)$/i, "");
  imagesByBase[base] = url;
}

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

export default function ChooseUpholstery() {
  const [fabrics, setFabrics] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpholstery = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await apiGetRequest("catalogue/listCatalogues?type=UPHOLSTERY", token);

        if (Array.isArray(res?.items)) {
          setFabrics(res.items);
        } else if (Array.isArray(res?.data)) {
          setFabrics(res.data);
        } else if (Array.isArray(res)) {
          setFabrics(res);
        } else {
          console.warn("Unexpected response:", res);
        }
      } catch (error) {
        console.error("Error fetching upholstery catalogues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpholstery();
  }, []);

  const hideOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.currentTarget as HTMLImageElement).style.display = "none";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.p variants={item} className="text-sm uppercase tracking-widest text-gray-600 mb-3">
                Pick Your Color and Texture
              </motion.p>
              <motion.h2 variants={item} className="text-2xl md:text-3xl lg:text-4xl font-semibold text-black mb-3">
                Customise Your Furniture
              </motion.h2>
              <motion.div variants={item} className="w-10 h-[2px] bg-black mx-auto mb-6" />
              <motion.p variants={item} className="text-sm md:text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Edendek offers a wide variety of upholstery options. Pick from our collection of plain fabrics,
                printed fabrics, and leatherette. We’ve curated the best for your furniture.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="w-full border-t border-gray-200" />

        {/* Fabrics Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative flex items-center justify-center mb-10">
              <span className="relative px-4 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-gray-800">Plain Fabrics</h2>
              </span>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading upholstery catalogues...</p>
            ) : fabrics.length === 0 ? (
              <p className="text-gray-500">No upholstery catalogues available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {fabrics.map((fabric) => {
                  // ✅ Use imageUrl and pdfUrl from backend
                  const image =
                    fabric.imageUrl ||
                    imagesByBase[fabric.name ?? ""] ||
                    imagesByBase["lenka"];
                  const hoverImage = imagesByBase[`${fabric.name}-hover`] ?? undefined;
                  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://hedra-app-2.onrender.com";

                 // In your component
const pdfHref = `https://hedra-app-2.onrender.com${fabric.pdfUrl}`;


                  return (
                    <Card key={fabric.id} className="relative overflow-hidden group shadow-md rounded-md">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={image}
                          alt={fabric.name}
                          className={`w-full h-full object-cover absolute inset-0 transition-[opacity,transform] duration-500 ${hoverImage ? "group-hover:opacity-0 group-hover:scale-110" : "group-hover:scale-110"
                            }`}
                        />
                        {hoverImage && (
                          <img
                            src={hoverImage}
                            alt={`${fabric.name} alternate`}
                            className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-[opacity,transform] duration-500"
                          />
                        )}
                      </div>

                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col">
                        <span className="text-white text-lg font-semibold mb-2">{fabric.name}</span>
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
