
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import furnitureHero from "@/assets/products/modern living room.webp";
import edendekLogo from "../../assets/icons/300px.png";


/* -------------------- NAV DATA -------------------- */
const navigation = [
  { name: "Home", href: "/" },
  {
    name: "Furniture",
    columns: [
      {
        sections: [
          {
            title: "HOME",
            items: [
              {
                name: "Sofas",
                href: "/sofa",
                subItems: [
                  { name: "1 seater to Single seater", href: "/sofa-1-seater" },
                  { name: "2 seater to Two-Seater", href: "/sofa-2-seater" },
                  { name: "3 Seater to Three-seater", href: "/sofa-3-seater" },
                  { name: "4 seater to four-seater", href: "/sofa-4-seater-plus" },
                  { name: "Corner Sofas", href: "/sofa-corner" },
                  { name: "Modular Sofas", href: "/sofa-modular" },
                  { name: "Lounge Sofas", href: "/sofa-lounge" }, // fixed
                  { name: "Recliners", href: "/sofa-recliner" },
                ],
              },
              {
                name: "Center Tables",
                href: "/center-tables",
                subItems: [
                  { name: "Rectangular Tables", href: "/center-tables-rectangular" },
                  { name: "Oval Tables", href: "/center-tables-oval" },
                  { name: "Circular Tables", href: "/center-tables-circular" }, // fixed
                ],
              },
              {
                name: "Beds",
                href: "/bed",
                subItems: [
                  { name: "Regular Beds", href: "/bed-regular" },
                  { name: "Beds with Storage", href: "/bed-storage" },
                  { name: "Bedside Tables", href: "/bed-bedside-tables" },
                  { name: "Bedroom Stools", href: "/bed-stools" },
                  { name: "Dressing Table Chairs", href: "/bed-dressing-chairs" },
                ],
              },
              { name: "Pouffes", href: "/pouffes" },
              {
                name: "Dining Tables",
                href: "/dining-table",
                subItems: [
                  { name: "Rectangular", href: "/dining-table-rectangular" },
                  { name: "Circular", href: "/dining-table-circular" },
                  { name: "Oval", href: "/dining-table-oval" },
                ],
              },
              { name: "Dining Chairs", href: "/dining-chairs" },
              { name: "Study Chairs", href: "/study-chairs" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            title: "OFFICE",
            items: [
              { name: "Boss Chairs", href: "/boss-chairs" },
              { name: "High Back Mesh Chairs", href: "/high-back-mesh-chairs" },
              { name: "Medium Back Workstation Chairs", href: "/medium-back-workstation-chairs" },
              { name: "Lounge Chairs", href: "/lounge-chairs" },
              { name: "Office Sofas", href: "/office-sofas" },
              {
                name: "Tables",
                href: "/office-tables",
                subItems: [
                  { name: "Boss Tables", href: "/office-tables-boss" },
                  { name: "Conference Room", href: "/office-tables-conference" },
                  { name: "Work Desks", href: "/office-tables-work-desks" },
                  { name: "Center Tables", href: "/office-tables-center" },
                ],
              },
              { name: "Meeting Room Chairs", href: "/meeting-room-chairs" },
              { name: "Visitor Chairs", href: "/visitor-chairs" },
              { name: "Training Chairs", href: "/training-chairs" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            title: "CAFE",
            items: [
              { name: "Cafe Chairs", href: "/cafe-chairs" },
              { name: "Dining Chairs", href: "/cafe-dining-chairs" },
              { name: "Bar Stools", href: "/bar-stools" },
              { name: "Outdoor", href: "/outdoor" },
              { name: "Cafe Tables", href: "/cafe-tables" },
              { name: "High Tables", href: "/high-tables" },
            ],
          },
        ],
      },
    ],
    image: {
      src: furnitureHero,
      alt: "Modern living room",
      caption: "Modern Comfort • Redefined",
      cta: { label: "Explore Catalog", href: "/catalog" },
    },
  },
  // { name: "Projects", href: "/projects" },
  // { name: "Catalog", href: "/catalog" },
  // { name: "Services", href: "/services" },
  {
    name: "Projects",
    dropdown: [
      { name: "Office Projects", href: "/projects" },
      { name: "Home Projects", href: "/homeprojects" },
      { name: "Chair Catalogues", href: "/chaircatalog" },
      { name: "Choose Upholstery", href: "/chooseupholstery" },
      { name: "Send an Enquiry", href: "/funrifanenquiry" },
    ],
  },

  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

/* -------------------- REUSABLE NAV LINKS -------------------- */
const NavLinks = ({
  navigation,
  openDropdown,
  setOpenDropdown,
  isPathActive,
  isMegaActive,
}: any) => {
  const anyDropdownOpen = Boolean(openDropdown);

  return (
    <nav className="hidden md:flex items-center gap-6" data-dropdown-area>
      {navigation.map((item: any) => {
        const isMega = !!item.columns;

        // ── Mega menu (Furniture)
        if (isMega) {
          // Active if it's the open dropdown, OR (no dropdown open & current path is inside Furniture)
          const active = openDropdown === item.name || (!anyDropdownOpen && isMegaActive(item));

          return (
            <div key={item.name} className="relative">
              <button
                type="button"
                aria-expanded={openDropdown === item.name}
                onClick={() =>
                  setOpenDropdown(openDropdown === item.name ? null : item.name)
                }
                className={cn(
                  "flex items-center text-sm font-medium hover:text-primary focus:outline-none",
                  active ? "text-primary border-b-2 border-primary pb-0.5" : "text-muted-foreground"
                )}
              >
                {item.name}
                <ChevronDown
                  className={cn(
                    "ml-1 h-4 w-4 transition-transform",
                    openDropdown === item.name && "rotate-180"
                  )}
                />
              </button>
            </div>
          );
        }

        // ── Simple dropdown (B2B)
        if (item.dropdown) {
          const pathActive = item.dropdown?.some((d: any) => isPathActive(d.href));
          // Active if it's the open dropdown, OR (no dropdown open & current path is inside B2B)
          const active = openDropdown === item.name || (!anyDropdownOpen && pathActive);

          return (
            <div key={item.name} className="relative">
              <button
                type="button"
                aria-expanded={openDropdown === item.name}
                onClick={() =>
                  setOpenDropdown(openDropdown === item.name ? null : item.name)
                }
                className={cn(
                  "flex items-center text-sm font-medium hover:text-primary focus:outline-none",
                  active ? "text-primary border-b-2 border-primary pb-0.5" : "text-muted-foreground"
                )}
              >
                {item.name}
                <ChevronDown
                  className={cn(
                    "ml-1 h-4 w-4 transition-transform",
                    openDropdown === item.name && "rotate-180"
                  )}
                />
              </button>

              {openDropdown === item.name && (
                <div
                  className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  data-dropdown-area
                >
                  <ul className="py-2">
                    {item.dropdown.map((d: any) => (
                      <li key={d.name}>
                        <Link
                          to={d.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {d.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        }

        // ── Normal link (Home, About, Contact)
        // Only active when its path matches AND no dropdown is open.
        const active = isPathActive(item.href) && !anyDropdownOpen;

        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "text-sm font-medium hover:text-primary",
              active ? "text-primary border-b-2 border-primary pb-0.5" : "text-muted-foreground"
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

const DesktopUtilities = () => (
  <div className="hidden md:flex items-center gap-4">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Phone className="h-4 w-4" />
      <span>+91 99624 52447</span>
    </div>
    <Link to="/admin">
      <Button variant="outline" size="sm">Admin</Button>
    </Link>
  </div>
);


/* -------------------- HEADER -------------------- */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const ENTER_AT = 120; // start compact header after this
    const EXIT_AT = 80;  // return to expanded before this (hysteresis)

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled((prev) => {
          if (!prev && y > ENTER_AT) return true;
          if (prev && y < EXIT_AT) return false;
          return prev;
        });
        ticking = false;
      });
    };

    onScroll(); // initialize
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close any open dropdown on outside click or Esc
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      // If the click isn't inside any element marked as dropdown area, close it
      if (openDropdown && !target?.closest?.("[data-dropdown-area]")) {
        setOpenDropdown(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openDropdown]);

  // Also close dropdowns on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);


  const furniture = navigation.find((n: any) => n.name === "Furniture");

  const isPathActive = (href?: string) => {
    if (!href) return false;
    const p = location.pathname;
    return p === href || p.startsWith(href + "/");
  };

  const isMegaActive = (mega: any) =>
    mega?.columns?.some((col: any) =>
      col.sections?.some((sec: any) =>
        sec.items?.some((it: any) => isPathActive(it.href))
      )
    ) ?? false;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* ---------- Expanded layout (logo above navbar) ---------- */}
        {!scrolled && (
          <>
            {/* Row 1: Logo centered */}

            <div className="h-16 flex justify-center items-center">
              <Link to="/" className="flex items-center gap-2">
                <img src={edendekLogo} alt="Edendek logo" className="block h-12 w-auto" />
              </Link>
            </div>



            {/* Row 2: Navbar centered + desktop utilities at right */}
            <div className="h-12 relative flex justify-center items-center">
              <NavLinks
                navigation={navigation}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                isPathActive={isPathActive}
                isMegaActive={isMegaActive}
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <DesktopUtilities />
              </div>
            </div>

          </>
        )}

        {/* ---------- Compact layout (logo left • navbar centered • utilities right) ---------- */}
        {scrolled && (
          <div className="h-16 relative flex items-center transition-all duration-500">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={edendekLogo} alt="Edendek logo" className="block h-12 w-auto" />
            </Link>


            {/* Center: Nav (absolute true center, independent of left/right widths) */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <NavLinks
                navigation={navigation}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                isPathActive={isPathActive}
                isMegaActive={isMegaActive}
              />
            </div>

            {/* Right: Contact + Admin (desktop only) */}
            <div className="ml-auto">
              <DesktopUtilities />
            </div>

            {/* Mobile menu button (only on small screens) */}
            <div className="md:hidden absolute right-2">
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        )}


        {/* ---------- MEGA DROPDOWN (anchored below the header) ---------- */}
        {openDropdown === "Furniture" && furniture && (
          <div
            className="absolute left-0 right-0 bg-white border-t border-border shadow-lg z-50"
            style={{ top: scrolled ? "64px" : "calc(56px + 48px)" }}
            data-dropdown-area
          >
            <div className="grid grid-cols-[1fr_1fr_1fr_280px] gap-8 px-6 py-6 ml-10 mr-20">
              {/* 3 text columns */}
              {furniture.columns.map((col: any, idx: number) => (
                <div key={idx} className="pr-6">
                  {col.sections.map((section: any) => (
                    <div key={section.title} className="mb-6 last:mb-0">
                      <div className="text-[12px] tracking-wide font-semibold text-gray-900 uppercase mb-2 ml-2">
                        {section.title}
                      </div>

                      <ul className="space-y-1.5">
                        {section.items.map((g: any) => (
                          <li key={g.name} className="relative group">
                            {/* Parent row */}
                            <Link
                              to={g.href}
                              className="flex items-center justify-between px-2 py-1.5 rounded text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <span>{g.name}</span>
                              {g.subItems && (
                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                              )}
                            </Link>

                            {/* Hover flyout for sub-items */}
                            {g.subItems && (
                              <div
                                className="
                                  absolute left-full top-0 ml-2 hidden group-hover:block group-focus-within:block
                                  min-w-[220px] bg-white border border-gray-200 rounded-md shadow-lg z-50
                                  py-2
                                "
                              >
                                <ul className="space-y-0.5">
                                  {g.subItems.map((sub: any) => (
                                    <li key={sub.name}>
                                      <Link
                                        to={sub.href}
                                        className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setOpenDropdown(null)}
                                      >
                                        {sub.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}

              {/* Right image panel */}
              <div className="pl-2">
                <div className="relative overflow-hidden rounded-md h-full min-h-[240px] bg-gray-100">
                  <img
                    src={furniture.image?.src || "/images/menu/fallback.jpg"}
                    alt={furniture.image?.alt || "Furniture"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    {furniture.image?.caption && (
                      <div className="text-sm font-medium mb-2">{furniture.image.caption}</div>
                    )}
                    {furniture.image?.cta && (
                      <Link to={furniture.image.cta.href} onClick={() => setOpenDropdown(null)}>
                        <Button size="sm" variant="secondary">
                          {furniture.image.cta.label}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* ---------- MOBILE NAV ---------- */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white shadow-sm">
            <div className="px-3 py-4 space-y-2">
              {navigation.map((item, idx) => {
                // determine if this item is currently open
                const isOpen = openDropdown === item.name;

                // ----- SIMPLE LINK
                if (!item.columns && !item.dropdown) {
                  return (
                    <Link
                      key={idx}
                      to={item.href || "#"}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                        location.pathname === item.href
                          ? "text-primary bg-accent"
                          : "text-muted-foreground hover:text-primary hover:bg-accent"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                }

                // ----- FURNITURE (MEGA MENU)
                if (item.columns) {
                  return (
                    <div key={idx}>
                      <button
                        onClick={() =>
                          setOpenDropdown(isOpen ? null : item.name)
                        }
                        className="flex w-full justify-between items-center px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
                      >
                        {item.name}
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                        />
                      </button>

                      <div
                        className={cn(
                          "overflow-hidden transition-[max-height] duration-300 ease-in-out pl-4",
                          isOpen ? "max-h-[800px]" : "max-h-0"
                        )}
                      >
                        {item.columns.flatMap((col) =>
                          col.sections.flatMap((section) =>
                            section.items.map((it) => (
                              <Link
                                key={it.name}
                                to={it.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-1 text-sm text-gray-700 hover:text-primary"
                              >
                                {it.name}
                              </Link>
                            ))
                          )
                        )}
                      </div>
                    </div>
                  );
                }

                // ----- PROJECTS DROPDOWN
                if (item.dropdown) {
                  return (
                    <div key={idx}>
                      <button
                        onClick={() =>
                          setOpenDropdown(isOpen ? null : item.name)
                        }
                        className="flex w-full justify-between items-center px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
                      >
                        {item.name}
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                        />
                      </button>

                      <div
                        className={cn(
                          "overflow-hidden transition-[max-height] duration-300 ease-in-out pl-4",
                          isOpen ? "max-h-[400px]" : "max-h-0"
                        )}
                      >
                        {item.dropdown.map((d) => (
                          <Link
                            key={d.name}
                            to={d.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-1 text-sm text-gray-700 hover:text-primary"
                          >
                            {d.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return null;
              })}

              {/* ----- CONTACT INFO & ADMIN ----- */}
              <div className="border-t border-border pt-4 space-y-2">
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Admin Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}


      </div>
    </header>
  );
}
