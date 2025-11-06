// src/pages/CategoryBrowse.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Download } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";

const getPdfUrl = (p: any) =>
  p?.catalogPdf || p?.brochureUrl || p?.pdfUrl || p?.documentUrl || "/brochures/LENKA.pdf";

const openPdfPreview = (url?: string | null) => {
  if (!url) return alert("No PDF available for this item yet.");
  const w = window.open(url, "_blank", "noopener,noreferrer");
  if (!w) window.location.href = url;
};

export default function CategoryBrowse() {
  const navigate = useNavigate();
  const { category = "" } = useParams();
  const { products } = useProducts();

  const items = products.filter(p => p.category === category);
  const title = decodeURIComponent(category).replace("-", " ");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-6 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-semibold capitalize">{title}</h1>
            <p className="text-sm text-muted-foreground">
              {items.length} item{items.length > 1 ? "s" : ""} in this category
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(p => (
                <Card key={p.id} className="overflow-hidden hover:shadow-card transition-all">
                  {/* Click image => this page is already open; go to product page OR a preview route */}
                  <button
                    className="relative aspect-[4/3] overflow-hidden group w-full"
                    onClick={() => navigate("/product", { state: { id: p.id } })}
                    aria-label={`Open ${p.name}`}
                  >
                    <img
                      src={(Array.isArray(p.images) && p.images[0]) || "/placeholder.jpg"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                  </button>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold line-clamp-1">{p.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">
                          {p.category.replace("-", " ")}
                        </p>
                      </div>
                      {p.featured && (
                        <span className="text-[10px] font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* <div className="mt-3 flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openPdfPreview(getPdfUrl(p))}>
                        <Download className="h-4 w-4 mr-1" />
                        Brochure
                      </Button>
                      <Button size="sm" onClick={() => navigate("/product", { state: { id: p.id } })}>
                        View
                      </Button>
                    </div> */}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
