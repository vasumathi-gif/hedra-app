import React, { useState, useMemo, useRef } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
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
import { cn } from '@/lib/utils';

export default function Catalog() {
  const navigate = useNavigate();
  const { category } = useParams<{ category: ProductCategory }>();
  const { products, getProductsByCategory, searchProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(category || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
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

                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
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
                      <div key={firstProduct.id} onClick={() => handleViewProduct(firstProduct.id)}>
                        <Card className="overflow-hidden hover:shadow-card transition-all duration-300">
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={Array.isArray(firstProduct.images) && firstProduct.images.length > 0
                                ? firstProduct.images[0]
                                : '/placeholder.jpg'}
                              alt={firstProduct.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
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
