import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/hero-furniture.jpg';
import Base from '@/assets/BASE.jpg';
const projects = [
  {
    id: '1',
    title: 'Luxury Corporate Office',
    category: 'Commercial',
    description: 'Complete furniture solution for a 5000 sq ft corporate office including executive desks, ergonomic chairs, and conference room furniture.',
    image: Base,
    year: '2024',
    client: 'TechCorp Industries'
  },
  {
    id: '2',
    title: 'Modern Residential Living',
    category: 'Residential',
    description: 'Custom living room set including modular sofas, coffee tables, and storage solutions for a contemporary home.',
    image: heroImage,
    year: '2023',
    client: 'Private Client'
  },
  {
    id: '3',
    title: 'Boutique Hotel Furnishing',
    category: 'Hospitality',
    description: 'Complete furnishing of a 50-room boutique hotel including lobby furniture, bedroom sets, and dining area pieces.',
    image: Base,
    year: '2023',
    client: 'Grandview Hotel'
  },
];

export default function HomeProjects() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Our Home Projects
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our portfolio of completed projects that showcase our craftsmanship 
                and attention to detail across various spaces and industries.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-elegant transition-all duration-300 group">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">{project.category}</Badge>
                      <span className="text-sm text-muted-foreground">{project.year}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="border-t border-border pt-4">
                      <p className="text-sm">
                        <span className="font-medium text-foreground">Client:</span>{' '}
                        <span className="text-muted-foreground">{project.client}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-hero text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let us bring your vision to life with our expertise in custom furniture design and manufacturing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-block">
                <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-3 rounded-md font-semibold transition-colors">
                  Get a Quote
                </button>
              </a>
              <a href="/catalog" className="inline-block">
                <button className="border border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-md font-semibold transition-colors">
                  View Catalog
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}