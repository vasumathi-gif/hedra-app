import React from 'react';
import { Users, Award, Clock, Heart } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import heroImage from '@/assets/hero-furniture.jpg';

const values = [
  {
    icon: Heart,
    title: 'Passion for Craft',
    description: 'Every piece we create is infused with passion and dedication to the art of furniture making.'
  },
  {
    icon: Award,
    title: 'Quality Excellence',
    description: 'We never compromise on quality, using only the finest materials and time-tested techniques.'
  },
  {
    icon: Users,
    title: 'Customer Focus',
    description: 'Your satisfaction is our priority. We work closely with you to bring your vision to life.'
  },
  {
    icon: Clock,
    title: 'Timeless Design',
    description: 'We create furniture that transcends trends, built to last and cherished for generations.'
  }
];

const stats = [
  { number: '30+', label: 'Years of Experience' },
  { number: '500+', label: 'Projects Completed' },
  { number: '50+', label: 'Skilled Craftsmen' },
  { number: '98%', label: 'Customer Satisfaction' }
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                About Hedra Fabrications
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Three decades of craftsmanship, innovation, and dedication to creating 
                exceptional furniture that transforms spaces and lives.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded in 1994, Hedra Fabrications began as a small family workshop with a simple mission: 
                    to create beautiful, functional furniture that stands the test of time. What started with 
                    traditional woodworking techniques has evolved into a modern manufacturing facility that 
                    combines heritage craftsmanship with contemporary design.
                  </p>
                  <p>
                    Today, we're proud to be one of the region's leading furniture manufacturers, serving both 
                    residential and commercial clients with custom solutions that reflect their unique style 
                    and functional requirements. Our team of skilled artisans and designers work together to 
                    bring your vision to life.
                  </p>
                  <p>
                    Every piece that leaves our workshop carries with it our commitment to excellence, 
                    sustainability, and the timeless art of furniture making. We believe that great furniture 
                    is more than just functional – it's an investment in comfort, style, and quality of life.
                  </p>
                </div>
              </div>
              <div className="lg:order-first">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                  <img
                    src={heroImage}
                    alt="Hedra Fabrications workshop"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/90 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do, from design conception to final delivery.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-card transition-all duration-300 group">
                    <CardContent className="pt-8 pb-6">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all duration-300">
                        <IconComponent className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                To create exceptional furniture that enhances the way people live and work, 
                combining traditional craftsmanship with modern innovation to deliver pieces 
                that are not only beautiful but also functional, sustainable, and built to last.
              </p>
              <div className="bg-gradient-card p-8 rounded-lg border border-border">
                <blockquote className="text-lg italic text-foreground">
                  "We believe that great furniture should tell a story – your story. Every piece we create 
                  is designed to become part of your life's journey, growing more beautiful and meaningful 
                  with each passing year."
                </blockquote>
                <cite className="block mt-4 text-muted-foreground font-medium">
                  — The Hedra Fabrications Team
                </cite>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-hero text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Create Your Story?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let us help you find or create the perfect furniture pieces that will become 
              cherished parts of your home or workspace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact">
                <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-3 rounded-md font-semibold transition-colors">
                  Get in Touch
                </button>
              </a>
              <a href="/catalog">
                <button className="border border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-md font-semibold transition-colors">
                  Explore Our Work
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