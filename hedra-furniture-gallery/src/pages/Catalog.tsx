import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Filter, Grid3X3, List, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useProducts } from '@/contexts/ProductContext';
import { PRODUCT_CATEGORIES, ProductCategory } from '@/types/product';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Catalog() {
  const navigate = useNavigate();
  const { category } = useParams<{ category: ProductCategory }>();
  const { products, getProductsByCategory, searchProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(category || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerTitle, setViewerTitle] = useState<string>('');
  const [viewerProducts, setViewerProducts] = useState<typeof products>([]);
  const openCategoryViewer = (title: string, items: typeof products) => {
    setViewerTitle(title);
    setViewerProducts(items);
    setViewerOpen(true);
  };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const nextPreview = () => {
    setPreviewIndex((i) => (i + 1) % viewerProducts.length);
  };
  const prevPreview = () => {
    setPreviewIndex((i) => (i - 1 + viewerProducts.length) % viewerProducts.length);
  };

  const active = viewerProducts[previewIndex];



  const catalogRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'all') {
      result = getProductsByCategory(selectedCategory);
    }

    if (searchQuery.trim()) {
      result = searchProducts(searchQuery).filter(product =>
        selectedCategory === 'all' || product.category === selectedCategory
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery, getProductsByCategory, searchProducts]);

  const groupedByCategory = useMemo(() => {
    const map = new Map<string, typeof products>();
    filteredProducts.forEach((product) => {
      if (!map.has(product.category)) {
        map.set(product.category, []);
      }
      map.get(product.category)?.push(product);
    });
    return Array.from(map.entries());
  }, [filteredProducts]);

  const handleDownload = async () => {
    if (!catalogRef.current) return;

    const node = catalogRef.current;
    const images = Array.from(node.querySelectorAll('img'));

    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      })
    );

    const canvas = await html2canvas(node, { useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('catalog.pdf');
  };

  // Function to navigate to the Product Detail page and pass the ID in the state
  const handleViewProduct = (productId: string) => {
    navigate("/product", { state: { id: productId } });
  };

  // Try common field names for a product's PDF URL.
  // Adjust to your real field (catalogPdf / brochureUrl / pdfUrl / documentUrl, etc.)
  // If you have a static brochure file in /public/brochures/LENKA.pdf:
  const getPdfUrl = (p: any) =>
    p?.catalogPdf || p?.brochureUrl || p?.pdfUrl || p?.documentUrl || "/brochures/LENKA.pdf";


  // Opens a PDF in a new tab (preview). Falls back gracefully if blocked.
  const openPdfPreview = (e: React.MouseEvent, url?: string | null) => {
    e.stopPropagation();            // don't trigger the card's onClick (navigate)
    if (!url) {
      alert("No PDF available for this item yet.");
      return;
    }
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) {
      // popup blocked → navigate current tab as a fallback
      window.location.href = url;
    }
  };



  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Category Viewer */}
        <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
          <DialogContent className="max-w-6xl w-[96vw] p-0 overflow-hidden">
            <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">{viewerTitle}</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {viewerProducts.length} item{viewerProducts.length > 1 ? 's' : ''} in this category
                </p>
              </div>
              <button className="p-2 rounded hover:bg-muted" onClick={() => setViewerOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Grid of products in this category */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {viewerProducts.map((p, idx) => (
                  <Card
                    key={p.id}
                    className="overflow-hidden hover:shadow-card transition-all duration-300 cursor-pointer"
                    onClick={() => openPreview(idx)}   // 👈 open preview for clicked product
                  >
                    <div className="relative aspect-[4/3] overflow-hidden group">
                      <img
                        src={Array.isArray(p.images) && p.images.length ? p.images[0] : '/placeholder.jpg'}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-1">{p.name}</h3>
                          <p className="text-xs text-muted-foreground capitalize">{p.category.replace('-', ' ')}</p>
                        </div>
                        {p.featured && (
                          <span className="text-[10px] font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPdfPreview(e, getPdfUrl(p));
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Brochure
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewerOpen(false);
                            handleViewProduct(p.id);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* Image Preview (Lightbox) */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-[1000px] w-[96vw] p-0 overflow-hidden">
            {active && (
              <div className="relative bg-black/90 text-white">
                {/* header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <div className="min-w-0">
                    <p className="text-sm opacity-70">{viewerTitle}</p>
                    <h3 className="text-lg font-semibold truncate">{active.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => { setPreviewOpen(false); handleViewProduct(active.id); }}>
                      View product
                    </Button>
                    <button className="p-2 rounded hover:bg-white/10" onClick={() => setPreviewOpen(false)}>
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* main image area */}
                <div className="relative">
                  <button className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20"
                    onClick={prevPreview}>
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  <div className="aspect-[4/3] grid place-items-center">
                    <img
                      src={(Array.isArray(active.images) && active.images.length ? active.images[0] : '/placeholder.jpg')}
                      alt={active.name}
                      className="max-h-[70vh] object-contain"
                    />
                  </div>

                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20"
                    onClick={nextPreview}>
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                {/* thumbnails row */}
                <div className="p-4 bg-black/80 overflow-x-auto">
                  <div className="flex gap-3">
                    {viewerProducts.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => setPreviewIndex(i)}
                        className={`shrink-0 border rounded-md overflow-hidden ${i === previewIndex ? 'border-white' : 'border-white/20'}`}
                        title={p.name}
                      >
                        <img
                          src={Array.isArray(p.images) && p.images.length ? p.images[0] : '/placeholder.jpg'}
                          alt={p.name}
                          className="h-16 w-24 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>


        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Product Catalog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our comprehensive collection of premium furniture designed to elevate your space.
            </p>
          </div>
        </section>

        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-4 items-center">
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as ProductCategory | 'all')}
                >
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border border-border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button> */}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                {selectedCategory !== 'all' && ` in ${PRODUCT_CATEGORIES.find(c => c.value === selectedCategory)?.label}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
          </div>
        </section>

        {/* PDF target area */}
        <section className="py-12" ref={catalogRef}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groupedByCategory.map(([categoryKey, categoryProducts]) => {
                    const firstProduct = categoryProducts[0];
                    return (
                      <div
                        key={firstProduct.id}
                        onClick={() => navigate(`/catalog/${encodeURIComponent(categoryKey)}/browse`)}
                        className="cursor-pointer"
                      >

                        <Card className="overflow-hidden hover:shadow-card transition-all duration-300">
                          <div className="relative aspect-[4/3] overflow-hidden group">
                            <img
                              src={
                                Array.isArray(firstProduct.images) && firstProduct.images.length > 0
                                  ? firstProduct.images[0]
                                  : '/placeholder.jpg'
                              }
                              alt={firstProduct.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* optional hover overlay for contrast */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Download button ON the image */}
                            {/* Download button ON the image (actually opens preview) */}
                            <button
                              onClick={(e) => openPdfPreview(e, getPdfUrl(firstProduct))}
                              aria-label="Open catalog PDF"
                              className="
    absolute left-3 bottom-3 inline-flex items-center gap-2 px-3 py-2 rounded-md
    text-white text-sm font-semibold
    bg-gradient-to-b from-[#6b1d1d] to-[#1c0b0b]
    shadow-[inset_0_1px_0_rgba(255,255,255,.15),0_8px_16px_rgba(0,0,0,.35)]
    hover:from-[#7f2323] hover:to-[#0f0707]
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30
    active:translate-y-px backdrop-blur-sm transition-all
  "
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                              </svg>
                              Download
                            </button>


                          </div>

                          <CardContent className="p-4 text-center">
                            <h3 className="font-semibold text-foreground mb-2 capitalize">
                              {categoryKey.replace('-', ' ')}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {categoryProducts.length} product{categoryProducts.length > 1 ? 's' : ''} available
                            </p>
                          </CardContent>
                        </Card>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} onClick={() => handleViewProduct(product.id)}>
                      <Card className="overflow-hidden hover:shadow-card transition-all duration-300">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-64 aspect-[4/3] md:aspect-auto overflow-hidden">
                            <img
                              src={product.images?.[0] || '/placeholder.jpg'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <CardContent className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <div className="flex gap-2">
                                <span className="text-xs font-medium text-primary capitalize bg-primary/10 px-2 py-1 rounded">
                                  {product.category.replace('-', ' ')}
                                </span>
                                {product.featured && (
                                  <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-4 line-clamp-3">{product.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium text-foreground">{key}:</span>
                                  <span className="text-muted-foreground ml-1">{value}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
