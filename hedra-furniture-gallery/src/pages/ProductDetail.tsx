import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useProducts } from '@/contexts/ProductContext';
import { cn } from '@/lib/utils';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { getProductById, products } = useProducts();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  console.log("Product ID from URL:", id);
  const product = getProductById(id);
  console.log('Fetched Product:', product);

  if (!id) {
    return <Navigate to="/catalog" replace />;
  }

  // const product = getProductById(id);
  // console.log(product); 
  // console.log('Fetched Product:', product);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
            <Link to="/catalog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Catalog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

    // Utility to concatenate class names
  const cn = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="py-4 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
              <span>/</span>
              <Link
                to={`/catalog/${product.category}`}
                className="hover:text-primary transition-colors capitalize"
              >
                {product.category.replace('-', ' ')}
              </Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  {product.images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                        onClick={previousImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>

                      {/* Image indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {product.images.map((_, index) => (
                          <button
                            key={index}
                            className={cn(
                              "w-2 h-2 rounded-full transition-colors",
                              index === currentImageIndex ? "bg-white" : "bg-white/50"
                            )}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        className={cn(
                          "aspect-square rounded-md overflow-hidden border-2 transition-colors",
                          index === currentImageIndex
                            ? "border-primary"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary" className="capitalize">
                      {product.category.replace('-', ' ')}
                    </Badge>
                    {product.featured && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {product.name}
                  </h1>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  {/* Price */}
                  <p className="text-xl font-semibold text-foreground mt-2">
                    ₹ {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Link to="/contact" className="flex-1">
                    <Button variant="hero" size="lg" className="w-full">
                      Request Quote
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Specifications */}
                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* <dl className="space-y-3">
                      {Object.entries(product.specifications ?? {}).map(([key, value]) => (

                        <div key={key} className="flex justify-between border-b border-border pb-2 last:border-b-0">
                          <dt className="font-medium text-foreground">{key}</dt>
                          <dd className="text-muted-foreground">{value}</dd>
                        </div>
                      ))}
                    </dl> */}
                    <dl className="space-y-3">
                      {(() => {
                        const specs = product.specifications;

                        // Normalize to [label, value] pairs
                        let pairs: Array<[string, string]> = [];

                        if (Array.isArray(specs)) {
                          // Backend sends: [{ key: string, value: string }]
                          pairs = specs
                            .filter((s: any) => s && typeof s === "object")
                            .map((s: any, idx: number) => [
                              String(s.key ?? `Spec ${idx + 1}`),
                              String(s.value ?? ""),
                            ]);
                        } else if (specs && typeof specs === "object") {
                          // Backend sends: { label: value, ... }
                          pairs = Object.entries(specs).map(([k, v]) => [String(k), String(v ?? "")]);
                        }

                        if (pairs.length === 0) {
                          return (
                            <p className="text-sm text-muted-foreground">
                              No specifications provided.
                            </p>
                          );
                        }

                        return pairs.map(([label, val], i) => (
                          <div
                            key={`${label}-${i}`}
                            className="flex justify-between border-b border-border pb-2 last:border-b-0"
                          >
                            <dt className="font-medium text-foreground">{label}</dt>
                            <dd className="text-muted-foreground">{val}</dd>
                          </div>
                        ));
                      })()}
                    </dl>
                  </CardContent>
                </Card>
                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="capitalize">
                          {tag}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                )}


                {/* Additional Info */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Quality Guarantee</h4>
                        <p className="text-muted-foreground">All our furniture comes with a comprehensive quality guarantee.</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Custom Options</h4>
                        <p className="text-muted-foreground">Available for customization to fit your specific requirements.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Related Products</h2>
                <p className="text-muted-foreground">
                  Discover more products from our {product.category.replace('-', ' ')} collection
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`} className="group">
                    <Card className="overflow-hidden hover:shadow-card transition-all duration-300">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={relatedProduct.images[0]}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedProduct.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}


