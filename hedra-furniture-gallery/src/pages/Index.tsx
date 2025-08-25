import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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

const Index = () => {
  const { products, categories, getProductsByCategory } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  // Base URL for images
  const baseUrl = import.meta.env.VITE_API_BASE_URL;


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
      id: 3,
      image: "https://images.unsplash.com/photo-1582582421810-27d1a26c1e4f",
      title: "Elevate Every Room",
      highlight: "With Our Craftsmanship",
      description:
        "Handcrafted with passion and precision to turn every room into a work of art.",
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
                  <div className="absolute inset-0 bg-gradient-hero" />
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

        {/* Product Categories */}
        <FadeInSection delay={0.1}>
          <section className="py-16 bg-accent/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Explore Our Categories
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  From elegant sofas to ergonomic office chairs, discover furniture that suits every space and style.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Ensure categories is valid before mapping */}
                {categories && categories.length > 0 ? (
                  categories.map((category) => {
                    const categoryProducts = getProductsByCategory(category);
                    const categoryImage = categoryProducts.length > 0 && categoryProducts[0]?.imageUrl
                      ? `${baseUrl}${categoryProducts[0]?.imageUrl}`
                      : null;
                    console.log(categoryImage);

                    return (
                      <Link key={category} to={`/catalog/${category}`} className="group">
                        <Card className="overflow-hidden hover:shadow-elegant transition-all duration-300 group-hover:scale-105">
                          <div className="aspect-[4/3] overflow-hidden">
                            {categoryImage ? (
                              <img
                                src={categoryImage} // Use the raw image URL
                                alt={category}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-muted-foreground">
                                No image available
                              </div>
                            )}

                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              {category}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {categoryProducts.length} products available
                            </p>
                            <div className="flex items-center text-primary">
                              <span className="text-sm font-medium">View Collection</span>
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })
                ) : (
                  <div>No categories available</div>
                )}
              </div>
            </div>
          </section>
        </FadeInSection>

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
              <Swiper
                slidesPerView={2}
                spaceBetween={30}
                loop={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                }}
                modules={[Autoplay]}
              >
                {clientLogos.map((client, idx) => (
                  <SwiperSlide key={idx} className="flex items-center justify-center px-4">
                    <div className="h-24 flex items-center justify-center overflow-hidden">
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="h-16 w-auto object-contain transition-transform duration-500 ease-in-out hover:rotate-3 hover:scale-100 hover:opacity-90"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
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
