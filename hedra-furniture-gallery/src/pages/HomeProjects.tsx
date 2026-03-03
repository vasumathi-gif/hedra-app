import React from 'react';
import { motion, Variants } from "framer-motion";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/hero-furniture.jpg';
import Base from '@/assets/BASE.jpg';


const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.45, // ⬅ controls gap between heading, line, text
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1, // ⬅ slow animation
      ease: [0.16, 1, 0.3, 1], // premium smooth
    },
  },
};


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
            <motion.div
              className="text-center"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {/* Heading */}
              <motion.h1
                variants={item}
                className="text-4xl md:text-5xl font-bold text-[#14294C] mb-4"
              >
                Home Projects
              </motion.h1>

              {/* Line */}
              <motion.div
                variants={item}
                className="w-10 h-[2px] bg-[#14294C] mx-auto mb-6"
              />

              {/* Paragraph */}
              <motion.p
                variants={item}
                className="text-lg text-gray-900 max-w-2xl mx-auto"
              >
                Explore our portfolio of completed projects that showcase our craftsmanship
                and attention to detail across various spaces and industries.
              </motion.p>
            </motion.div>
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
                      <Badge variant="secondary"
                        className="bg-[#b53e1d] text-white hover:bg-[#b53e1d]/90">{project.category}</Badge>
                      <span className="text-sm text-gray-500">{project.year}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-[#14294C] mb-2 group-hover:text-[#14294C] transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-gray-900 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="border-t border-border pt-4">
                      <p className="text-sm">
                        <span className="font-medium text-gray-900">Client:</span>{' '}
                        <span className="text-gray-500">{project.client}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center bg-[linear-gradient(90deg,#293654_0%,#88747B_50%,#B78A83_100%)]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let us bring your vision to life with our expertise in custom furniture design and manufacturing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-block">
                <button className="bg-[#b53e1d] text-white hover:bg-[#b53e1d]/90 px-8 py-3 rounded-md font-semibold transition-colors">
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