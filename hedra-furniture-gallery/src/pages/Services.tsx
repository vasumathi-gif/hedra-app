import React from 'react';
import { Hammer, Palette, Wrench, Truck, Users, Award } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Hammer,
    title: 'Custom Furniture Design',
    description: 'We create bespoke furniture pieces tailored to your specific requirements, style preferences, and space constraints.',
    features: ['Personalized design consultation', '3D visualization', 'Material selection guidance', 'Detailed craftsmanship']
  },
  {
    icon: Palette,
    title: 'Interior Design Consultation',
    description: 'Our design experts help you create cohesive spaces that reflect your style while maximizing functionality.',
    features: ['Space planning', 'Color coordination', 'Furniture arrangement', 'Accessory recommendations']
  },
  {
    icon: Wrench,
    title: 'Furniture Restoration',
    description: 'Give new life to your cherished pieces with our professional restoration and refinishing services.',
    features: ['Antique restoration', 'Wood refinishing', 'Upholstery repair', 'Hardware replacement']
  },
  {
    icon: Truck,
    title: 'Delivery & Installation',
    description: 'Professional delivery and installation services ensure your furniture is placed perfectly and safely.',
    features: ['White glove delivery', 'Professional assembly', 'Furniture placement', 'Packaging removal']
  },
  {
    icon: Users,
    title: 'Commercial Projects',
    description: 'Complete furniture solutions for offices, hotels, restaurants, and other commercial spaces.',
    features: ['Bulk ordering', 'Project management', 'Timeline coordination', 'Commercial-grade quality']
  },
  {
    icon: Award,
    title: 'Warranty & Support',
    description: 'Comprehensive warranty coverage and ongoing support to ensure your satisfaction and furniture longevity.',
    features: ['Quality guarantee', 'Maintenance tips', 'Repair services', 'Customer support']
  }
];

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Our Services
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From custom design to delivery and beyond, we provide comprehensive furniture solutions 
                that exceed expectations at every step of your journey.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Card key={index} className="h-full hover:shadow-card transition-all duration-300 group">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                        <IconComponent className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6">
                        {service.description}
                      </p>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We follow a structured approach to ensure every project meets our high standards 
                and your exact specifications.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Consultation',
                  description: 'Initial discussion to understand your needs, preferences, and budget.'
                },
                {
                  step: '02',
                  title: 'Design',
                  description: 'Create detailed designs and 3D visualizations for your approval.'
                },
                {
                  step: '03',
                  title: 'Crafting',
                  description: 'Expert craftsmen bring your design to life using premium materials.'
                },
                {
                  step: '04',
                  title: 'Delivery',
                  description: 'Professional delivery and installation to complete your project.'
                }
              ].map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-secondary-foreground">{process.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{process.title}</h3>
                  <p className="text-muted-foreground">{process.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-hero text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Let's Create Something Beautiful Together
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Ready to transform your space with custom furniture that reflects your style? 
              Get in touch with our team today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Start Your Project
                </Button>
              </a>
              <a href="/catalog">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                  View Our Work
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}