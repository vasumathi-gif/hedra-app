import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import edendekLogo from "../../assets/icons/300px.png";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      {/* ↓ was py-12. Reduce top padding only. */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* ↓ align all columns to the same top line */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Company Info */}
          <div className="space-y-8">
            <div className="flex items-center gap-1 leading-none -mt-[1px]">
              <img
                src={edendekLogo}
                alt="Edendek logo"
                className="block h-12 w-auto"  // ↑ increased size
                loading="eager"
              />
            </div>

            <p className="mt-2 text-sm text-muted-foreground leading-snug
               max-w-[22ch] sm:max-w-[24ch] md:max-w-[28ch] lg:max-w-[30ch]">
              Creating exceptional furniture pieces that blend craftsmanship with modern design.
              Your trusted partner for premium furniture solutions.
            </p>

          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">Home</Link>
              <Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors text-sm">Product Catalog</Link>
              <Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors text-sm">Our Projects</Link>
              <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors text-sm">Services</Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About Us</Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Services</h3>
            <nav className="flex flex-col space-y-2">
              <span className="text-muted-foreground text-sm">Custom Furniture</span>
              <span className="text-muted-foreground text-sm">Interior Design</span>
              <span className="text-muted-foreground text-sm">Furniture Restoration</span>
              <span className="text-muted-foreground text-sm">Commercial Projects</span>
              <span className="text-muted-foreground text-sm">Consultation</span>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
    Contact Us
  </h3>

  {/* 2-column grid: fixed icon column + flexible text column */}
  <div className="grid grid-cols-[22px,1fr] gap-x-3 gap-y-2 items-start">
    {/* Phone */}
    <Phone className="h-5 w-5 text-primary mt-0.5" />
    <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>

    {/* Email */}
    <Mail className="h-5 w-5 text-primary mt-0.5" />
    <span className="text-sm text-muted-foreground">info@edendek.com</span>

    {/* Address */}
    <MapPin className="h-5 w-5 text-primary mt-0.5" />
    <address className="not-italic text-sm text-muted-foreground leading-snug">
      No: 126/1, Sivanthi Athithan Nagar,<br />
      Ambedkar Main Road,<br />
      Redhills, Chennai,<br />
      Tamil Nadu: 600 052
    </address>
  </div>

  {/* Socials */}
  <div className="flex gap-4 pt-2">
    <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
      <Facebook className="h-5 w-5" />
    </a>
    <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
      <Instagram className="h-5 w-5" />
    </a>
    <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
      <Linkedin className="h-5 w-5" />
    </a>
  </div>
</div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© 2025 Edendek. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
