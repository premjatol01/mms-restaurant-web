import React from "react";
import Link from "next/link";
import PublicMapView from "./components/PublicMapView";
import InquiryForm from "./components/InquiryForm";
import PublicFooter from "./components/PublicFooter";
import {
  Utensils,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Search,
  Home,
  UtensilsCrossed,
  Tag,
  Percent,
} from "lucide-react";

async function getRestaurantData(subdomain) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${apiUrl}/restaurants/portfolio/${subdomain}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      if (errJson?.isUnpublished) {
        return { isUnpublished: true };
      }
      return null;
    }

    const json = await res.json();
    return json?.success ? json.data : null;
  } catch (err) {
    // Backend may be offline or network unreachable
    return null;
  }
}

function normalizeHex(hex) {
  if (!hex || typeof hex !== "string") return null;
  let clean = hex.trim().replace(/^#/, "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  return clean.length === 6 ? `#${clean.toLowerCase()}` : null;
}

function getContrastColor(hexColor) {
  const norm = normalizeHex(hexColor);
  if (!norm) return "#ffffff";
  const r = parseInt(norm.slice(1, 3), 16);
  const g = parseInt(norm.slice(3, 5), 16);
  const b = parseInt(norm.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? "#0f172a" : "#ffffff";
}

function isDarkColor(hexColor) {
  return getContrastColor(hexColor) === "#ffffff";
}

export default async function RestaurantPortfolioPage({ params }) {
  const { subdomain } = await params;
  const restaurant = await getRestaurantData(subdomain);

  // If no restaurant data is returned by the API or website is unpublished, show the not-found/unavailable page
  if (!restaurant || restaurant.isUnpublished) {
    const isUnpublished = restaurant?.isUnpublished;
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
        <header className="max-w-6xl mx-auto w-full py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white">Tablly</span>
          </Link>
        </header>

        <main className="max-w-md mx-auto text-center space-y-6 py-16">
          <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
            <Search className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {isUnpublished ? "Unpublished • Not Available" : "404 • Not Found"}
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-3">
              {isUnpublished ? "Website Currently Unavailable" : "Restaurant Not Found"}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isUnpublished
                ? `The website for ${subdomain} is currently unpublished or undergoing maintenance by the restaurant owner.`
                : `We couldn't find an active restaurant portfolio for ${subdomain}. The restaurant may not exist or its subdomain may have changed.`}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Home className="w-4 h-4" />
              <span>Go to Tablly Homepage</span>
            </Link>
          </div>
        </main>

        <footer className="text-center text-xs text-slate-500 py-4">
          &copy; {new Date().getFullYear()} Tablly Platform. All rights reserved.
        </footer>
      </div>
    );
  }

  // Restaurant details from database
  const {
    name = "Restaurant",
    tagline,
    shortDescription,
    fullDescription,
    restaurantType,
    cuisineTypes = [],
    establishmentYear,
    coverImage,
    logo,
    detailedAddress,
    address,
    contact = {},
    businessHours = [],
    socialLinks = {},
    googleReviewLink,
    websiteColors = {},
    sections = [],
    popularItems = [],
    activeOffers = [],
  } = restaurant;

  // Derive theme colors (defaults match blush & mint or backend default)
  const primary = normalizeHex(websiteColors?.primary) || "#f29191";
  const secondary = normalizeHex(websiteColors?.secondary) || "#b1e5e6";
  const background = normalizeHex(websiteColors?.background) || "#ffffff";
  const text = normalizeHex(websiteColors?.text) || "#1f2937";

  const isDarkBg = isDarkColor(background);
  const primaryContrast = getContrastColor(primary);
  const secondaryContrast = getContrastColor(secondary);

  const themeVars = {
    "--theme-primary": primary,
    "--theme-primary-text": primaryContrast,
    "--theme-secondary": secondary,
    "--theme-secondary-text": secondaryContrast,
    "--theme-background": background,
    "--theme-text": text,
    "--theme-surface": isDarkBg
      ? `color-mix(in srgb, ${text} 9%, ${background})`
      : `color-mix(in srgb, ${secondary} 9%, #ffffff)`,
    "--theme-surface-soft": isDarkBg
      ? `color-mix(in srgb, ${text} 5%, ${background})`
      : `color-mix(in srgb, ${secondary} 18%, ${background})`,
    "--theme-border": `color-mix(in srgb, ${text} 14%, transparent)`,
    "--theme-border-subtle": `color-mix(in srgb, ${text} 8%, transparent)`,
    "--theme-text-muted": `color-mix(in srgb, ${text} 70%, transparent)`,
    "--theme-text-faint": `color-mix(in srgb, ${text} 45%, transparent)`,
    "--theme-primary-soft": `color-mix(in srgb, ${primary} 15%, transparent)`,
    "--theme-secondary-soft": `color-mix(in srgb, ${secondary} 25%, transparent)`,
  };

  // Section finders: check if section is present and enabled from restaurant-admin
  const isSectionEnabled = (id) => {
    const sec = sections?.find((s) => s.sectionId === id || s.type === id || s.id === id);
    return Boolean(sec && sec.enabled !== false);
  };

  const heroSection = sections?.find((s) => s.sectionId === "hero" || s.type === "hero");
  const aboutSection = sections?.find((s) => s.sectionId === "about" || s.type === "about");
  const menuSection = sections?.find((s) => s.sectionId === "menu" || s.type === "menu");
  const offersSection = sections?.find((s) => s.sectionId === "offers" || s.type === "offers");
  const gallerySection = sections?.find((s) => s.sectionId === "gallery" || s.type === "gallery");
  const mapSection = sections?.find((s) => s.sectionId === "map" || s.type === "map");
  const inquirySection = sections?.find((s) => s.sectionId === "inquiry" || s.type === "inquiry");
  const footerSection = sections?.find((s) => s.sectionId === "footer" || s.type === "footer") || restaurant.footer;

  const heroHeading = heroSection?.content?.heading || name;
  const heroDescription =
    heroSection?.content?.description ||
    shortDescription ||
    fullDescription ||
    "Welcome to our restaurant! Explore our full digital menu and enjoy freshly prepared dishes at your table.";
  const heroButtonText = heroSection?.content?.buttonText || "Browse Digital Menu";
  const heroCover = heroSection?.content?.imageUrl || coverImage;

  const aboutTitle = aboutSection?.content?.title || "About Us";
  const aboutDescription =
    aboutSection?.content?.description ||
    fullDescription ||
    shortDescription ||
    "";
  const aboutImage = aboutSection?.content?.imageUrl || aboutSection?.content?.image;

  const displayCity = detailedAddress?.city || address?.city || "Local City";
  const displayAddress =
    detailedAddress?.line1 ||
    detailedAddress?.area ||
    address?.fullAddress ||
    `${displayCity}, ${detailedAddress?.state || address?.state || "India"}`;

  return (
    <div
      style={{
        ...themeVars,
        backgroundColor: "var(--theme-background)",
        color: "var(--theme-text)",
      }}
      className="min-h-screen font-sans antialiased transition-colors duration-200"
    >
      {/* ───────────────── TOP NAV ───────────────── */}
      <header
        style={{
          backgroundColor: "color-mix(in srgb, var(--theme-background) 88%, transparent)",
          borderColor: "var(--theme-border)",
        }}
        className="sticky top-0 z-40 backdrop-blur-md border-b"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo.startsWith("http") ? logo : `http://localhost:5000${logo}`}
                alt={name}
                className="w-10 h-10 rounded-xl object-cover border"
                style={{ borderColor: "var(--theme-border)" }}
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold"
                style={{
                  backgroundColor: "var(--theme-primary-soft)",
                  borderColor: "color-mix(in srgb, var(--theme-primary) 30%, transparent)",
                  color: "var(--theme-primary)",
                }}
              >
                <Utensils className="w-5 h-5" />
              </div>
            )}
            <div>
              <h1
                style={{ color: "var(--theme-text)" }}
                className="text-base sm:text-lg font-bold leading-tight"
              >
                {name}
              </h1>
              {tagline && (
                <p
                  style={{ color: "var(--theme-text-muted)" }}
                  className="text-xs hidden sm:block truncate max-w-xs"
                >
                  {tagline}
                </p>
              )}
            </div>
          </div>

          {/* Quick Header Navigation for enabled sections */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold" style={{ color: "var(--theme-text-muted)" }}>
            {isSectionEnabled("menu") && (
              <a href="#menu" className="hover:opacity-80 transition-opacity">Menu</a>
            )}
            {isSectionEnabled("offers") && (
              <a href="#offers" className="hover:opacity-80 transition-opacity">Offers</a>
            )}
            {isSectionEnabled("about") && (
              <a href="#about" className="hover:opacity-80 transition-opacity">About</a>
            )}
            {isSectionEnabled("gallery") && (
              <a href="#gallery" className="hover:opacity-80 transition-opacity">Gallery</a>
            )}
            {isSectionEnabled("map") && (
              <a href="#map" className="hover:opacity-80 transition-opacity">Location</a>
            )}
            {isSectionEnabled("inquiry") && (
              <a href="#inquiry" className="hover:opacity-80 transition-opacity">Contact</a>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {contact?.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: "var(--theme-primary-soft)",
                  color: "var(--theme-primary)",
                  borderColor: "color-mix(in srgb, var(--theme-primary) 30%, transparent)",
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border font-semibold text-xs transition-all hover:opacity-90"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ───────────────── 1. HERO SECTION (Only if enabled) ───────────────── */}
      {isSectionEnabled("hero") && (
        <section className="relative overflow-hidden pt-8 pb-16">
          {heroCover && (
            <div className="absolute inset-0 z-0 opacity-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroCover.startsWith("http") ? heroCover : `http://localhost:5000${heroCover}`}
                alt={name}
                className="w-full h-full object-cover blur-sm"
              />
            </div>
          )}
          <div
            style={{
              background: `linear-gradient(to bottom, transparent, var(--theme-background))`,
            }}
            className="absolute inset-0 z-0"
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {restaurantType && (
                  <span
                    style={{
                      backgroundColor: "var(--theme-primary-soft)",
                      color: "var(--theme-primary)",
                      borderColor: "color-mix(in srgb, var(--theme-primary) 30%, transparent)",
                    }}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                  >
                    {restaurantType}
                  </span>
                )}
                {establishmentYear && (
                  <span
                    style={{
                      backgroundColor: "var(--theme-surface)",
                      color: "var(--theme-text-muted)",
                      borderColor: "var(--theme-border)",
                    }}
                    className="text-xs px-2.5 py-1 rounded-full border"
                  >
                    Est. {establishmentYear}
                  </span>
                )}
                <span
                  style={{
                    backgroundColor: "var(--theme-surface)",
                    color: "var(--theme-text-muted)",
                    borderColor: "var(--theme-border)",
                  }}
                  className="text-xs px-2.5 py-1 rounded-full border flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" />
                  <span>{displayCity}</span>
                </span>
              </div>

              <h2
                style={{ color: "var(--theme-text)" }}
                className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight"
              >
                {heroHeading}
              </h2>

              <p
                style={{ color: "var(--theme-text-muted)" }}
                className="text-sm sm:text-base leading-relaxed max-w-2xl"
              >
                {heroDescription}
              </p>

              {cuisineTypes && cuisineTypes.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {cuisineTypes.map((cuisine, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: "var(--theme-surface)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-text)",
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg border font-medium"
                    >
                      • {cuisine}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-4 flex flex-wrap gap-3">
                {isSectionEnabled("menu") && (
                  <a
                    href="#menu"
                    style={{
                      backgroundColor: "var(--theme-primary)",
                      color: "var(--theme-primary-text)",
                      boxShadow: "0 10px 25px -5px color-mix(in srgb, var(--theme-primary) 35%, transparent)",
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
                  >
                    <span>{heroButtonText || "Explore Menu"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
                {contact?.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      backgroundColor: "var(--theme-surface)",
                      borderColor: "var(--theme-border)",
                      color: "var(--theme-text)",
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-colors hover:opacity-90"
                  >
                    <MessageCircle className="w-4 h-4" style={{ color: "var(--theme-primary)" }} />
                    <span>WhatsApp Us</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── 2. ABOUT SECTION (Only if enabled) ───────────────── */}
      {isSectionEnabled("about") && (
        <section
          id="about"
          style={{
            backgroundColor: "var(--theme-surface-soft)",
            borderColor: "var(--theme-border)",
          }}
          className="py-16 sm:py-20 border-t"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div
              className={`grid grid-cols-1 ${
                aboutImage ? "lg:grid-cols-2" : "max-w-3xl"
              } gap-10 lg:gap-14 items-center`}
            >
              <div className="space-y-4">
                <span
                  style={{
                    backgroundColor: "var(--theme-primary-soft)",
                    color: "var(--theme-primary)",
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>About Us</span>
                </span>
                <h3
                  style={{ color: "var(--theme-text)" }}
                  className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight"
                >
                  {aboutTitle}
                </h3>
                {aboutDescription && (
                  <p
                    style={{ color: "var(--theme-text-muted)" }}
                    className="text-sm sm:text-base leading-relaxed whitespace-pre-line"
                  >
                    {aboutDescription}
                  </p>
                )}
              </div>

              {aboutImage && (
                <div className="relative">
                  <div
                    style={{
                      borderColor: "var(--theme-border)",
                      backgroundColor: "var(--theme-surface)",
                    }}
                    className="relative aspect-[4/3] rounded-3xl overflow-hidden border shadow-lg"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        aboutImage.startsWith("http")
                          ? aboutImage
                          : `http://localhost:5000${aboutImage}`
                      }
                      alt={aboutTitle}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── 3. POPULAR MENU SECTION (Only if enabled) ───────────────── */}
      {isSectionEnabled("menu") && (
        <section
          id="menu"
          style={{ borderColor: "var(--theme-border)" }}
          className="py-16 border-t"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span
                  style={{
                    backgroundColor: "var(--theme-primary-soft)",
                    color: "var(--theme-primary)",
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Chef's Recommendations</span>
                </span>
                <h3
                  style={{ color: "var(--theme-text)" }}
                  className="text-2xl font-bold"
                >
                  {menuSection?.content?.title || "Popular Dishes"}
                </h3>
                <p
                  style={{ color: "var(--theme-text-muted)" }}
                  className="text-xs sm:text-sm mt-1"
                >
                  {menuSection?.content?.description || "Our most loved dishes, picked by our guests"}
                </p>
              </div>

              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border shrink-0"
                style={{
                  backgroundColor: "var(--theme-surface)",
                  borderColor: "var(--theme-border)",
                  color: "var(--theme-text-muted)",
                }}
              >
                <span>Scan table QR to order</span>
              </div>
            </div>

            {popularItems && popularItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {popularItems.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      backgroundColor: "var(--theme-surface)",
                      borderColor: "var(--theme-border)",
                    }}
                    className="rounded-2xl border overflow-hidden shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-1 duration-200"
                  >
                    <div>
                      <div className="relative aspect-[4/3] w-full bg-black/5 overflow-hidden">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image.startsWith("http") ? item.image : `http://localhost:5000${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Utensils className="w-10 h-10 opacity-30" />
                          </div>
                        )}
                        {item.foodType && (
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-1 rounded-md shadow-sm">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                item.foodType === "veg"
                                  ? "bg-green-600"
                                  : item.foodType === "egg"
                                  ? "bg-amber-500"
                                  : "bg-red-600"
                              }`}
                            />
                          </div>
                        )}
                        {(item.isBestseller || item.isPopular) && (
                          <span
                            style={{
                              backgroundColor: "var(--theme-primary)",
                              color: "var(--theme-primary-text)",
                            }}
                            className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
                          >
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <h4
                          style={{ color: "var(--theme-text)" }}
                          className="font-bold text-sm sm:text-base line-clamp-1"
                        >
                          {item.name}
                        </h4>
                        {item.description && (
                          <p
                            style={{ color: "var(--theme-text-muted)" }}
                            className="text-xs mt-1 line-clamp-2 leading-relaxed"
                          >
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div
                        className="pt-3 border-t flex items-center justify-between"
                        style={{ borderColor: "var(--theme-border-subtle)" }}
                      >
                        <div className="flex items-baseline gap-1.5">
                          <span
                            style={{ color: "var(--theme-primary)" }}
                            className="text-base sm:text-lg font-bold"
                          >
                            ₹{item.price}
                          </span>
                          {item.mrp && item.mrp > item.price && (
                            <span className="text-xs line-through" style={{ color: "var(--theme-text-faint)" }}>
                              ₹{item.mrp}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "var(--theme-surface)",
                  borderColor: "var(--theme-border)",
                }}
                className="p-8 rounded-2xl border text-center space-y-3"
              >
                <p style={{ color: "var(--theme-text-muted)" }} className="text-sm">
                  Explore our dishes and drinks by scanning the QR code at your table.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ───────────────── 4. SPECIAL OFFERS SECTION (Only if enabled) ───────────────── */}
      {isSectionEnabled("offers") && (
        <section
          id="offers"
          style={{
            backgroundColor: "var(--theme-surface-soft)",
            borderColor: "var(--theme-border)",
          }}
          className="py-16 border-t"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="mb-8">
              <span
                style={{
                  backgroundColor: "var(--theme-primary-soft)",
                  color: "var(--theme-primary)",
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Exclusive Deals</span>
              </span>
              <h3
                style={{ color: "var(--theme-text)" }}
                className="text-2xl font-bold"
              >
                {offersSection?.content?.title || "Special Offers & Deals"}
              </h3>
              <p
                style={{ color: "var(--theme-text-muted)" }}
                className="text-xs sm:text-sm mt-1"
              >
                {offersSection?.content?.description || "Check out our latest deals and promotions"}
              </p>
            </div>

            {activeOffers && activeOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeOffers.map((offer) => (
                  <div
                    key={offer._id}
                    style={{
                      backgroundColor: "var(--theme-surface)",
                      borderColor: "var(--theme-border)",
                    }}
                    className="p-6 rounded-2xl border shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-primary transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            backgroundColor: "var(--theme-primary)",
                            color: "var(--theme-primary-text)",
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg"
                        >
                          <Percent className="w-3 h-3" />
                          <span>
                            {offer.benefit?.type === "percentage"
                              ? `${offer.benefit.value}% OFF`
                              : `₹${offer.benefit?.value || 0} FLAT OFF`}
                          </span>
                        </span>

                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/5 dark:bg-white/10" style={{ color: "var(--theme-text-muted)" }}>
                          {offer.type?.replace("_", " ")}
                        </span>
                      </div>

                      <h4
                        style={{ color: "var(--theme-text)" }}
                        className="font-bold text-base sm:text-lg"
                      >
                        {offer.name}
                      </h4>

                      {offer.terms && (
                        <p
                          style={{ color: "var(--theme-text-muted)" }}
                          className="text-xs leading-relaxed line-clamp-2"
                        >
                          {offer.terms}
                        </p>
                      )}

                      {offer.minimumOrderAmount > 0 && (
                        <p className="text-[11px]" style={{ color: "var(--theme-text-faint)" }}>
                          Min Order Amount: ₹{offer.minimumOrderAmount}
                        </p>
                      )}
                    </div>

                    <div
                      className="pt-4 mt-4 border-t flex items-center justify-between"
                      style={{ borderColor: "var(--theme-border-subtle)" }}
                    >
                      <span className="text-xs font-semibold" style={{ color: "var(--theme-primary)" }}>
                        Dine-in Offer
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>
                        Applied on Table QR
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "var(--theme-surface)",
                  borderColor: "var(--theme-border)",
                }}
                className="p-8 rounded-2xl border text-center space-y-3"
              >
                <p style={{ color: "var(--theme-text-muted)" }} className="text-sm">
                  Special offers and discounts will appear here. Dine in and scan your table QR code to unlock exclusive promotions!
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ───────────────── 5. GALLERY SECTION (Only if enabled) ───────────────── */}
      {isSectionEnabled("gallery") && gallerySection?.content?.images?.length > 0 && (
        <section
          id="gallery"
          style={{ borderColor: "var(--theme-border)" }}
          className="py-16 border-t"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h3
              style={{ color: "var(--theme-text)" }}
              className="text-2xl font-bold mb-6"
            >
              {gallerySection.content.title || "Photo Gallery"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {gallerySection.content.images.slice(0, 8).map((img, idx) => (
                <div
                  key={idx}
                  style={{ borderColor: "var(--theme-border)" }}
                  className="rounded-xl overflow-hidden border aspect-square bg-black/5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url?.startsWith("http") ? img.url : `http://localhost:5000${img.url}`}
                    alt={img.caption || `Gallery ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── 6. MAP & LOCATION SECTION (Only if enabled) ───────────────── */}
      {isSectionEnabled("map") && (
        <section
          id="map"
          style={{
            backgroundColor: "var(--theme-surface-soft)",
            borderColor: "var(--theme-border)",
          }}
          className="py-16 border-t"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="mb-6">
              <h3
                style={{ color: "var(--theme-text)" }}
                className="text-2xl font-bold"
              >
                {mapSection?.content?.title || "Find Us"}
              </h3>
              {mapSection?.content?.description && (
                <p
                  style={{ color: "var(--theme-text-muted)" }}
                  className="text-xs sm:text-sm mt-1"
                >
                  {mapSection.content.description}
                </p>
              )}
            </div>

            <PublicMapView
              latitude={mapSection?.content?.location?.latitude}
              longitude={mapSection?.content?.location?.longitude}
              address={[
                mapSection?.content?.location?.addressLine,
                mapSection?.content?.location?.city,
                mapSection?.content?.location?.state,
                mapSection?.content?.location?.pincode,
              ].filter(Boolean).join(", ") || displayAddress}
              restaurantName={name}
              showDirections={mapSection?.content?.showDirections !== false}
            />
          </div>
        </section>
      )}

      {/* ───────────────── 7. CONTACT / INQUIRY FORM SECTION (Only if enabled) ───────────────── */}
      {isSectionEnabled("inquiry") && (
        <section
          id="inquiry"
          style={{ borderColor: "var(--theme-border)" }}
          className="py-16 border-t"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <InquiryForm
              subdomain={subdomain}
              content={inquirySection?.content}
              restaurantName={name}
              contactInfo={{
                phone: contact?.primaryPhone,
                email: contact?.email,
                address: displayAddress,
              }}
            />
          </div>
        </section>
      )}

      {/* ───────────────── 8. BUSINESS HOURS (If configured) ───────────────── */}
      {businessHours && businessHours.length > 0 && (
        <section
          id="hours"
          style={{
            backgroundColor: "var(--theme-surface-soft)",
            borderColor: "var(--theme-border)",
          }}
          className="py-12 border-t"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h3
              style={{ color: "var(--theme-text)" }}
              className="text-xl font-bold mb-6 flex items-center gap-2"
            >
              <Clock className="w-5 h-5" style={{ color: "var(--theme-primary)" }} />
              Opening Hours
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {businessHours.map((slot, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: slot.isOpen ? "var(--theme-surface)" : "var(--theme-surface-soft)",
                    borderColor: slot.isOpen ? "var(--theme-border)" : "var(--theme-border-subtle)",
                    opacity: slot.isOpen ? 1 : 0.65,
                  }}
                  className="p-3.5 rounded-xl border text-center shadow-sm transition-all"
                >
                  <div
                    style={{ color: slot.isOpen ? "var(--theme-text)" : "var(--theme-text-muted)" }}
                    className="text-xs font-bold"
                  >
                    {slot.day.slice(0, 3)}
                  </div>
                  <div className="mt-1">
                    {slot.isOpen ? (
                      <span
                        style={{ color: "var(--theme-primary)" }}
                        className="text-[11px] font-semibold block"
                      >
                        {slot.slots?.[0]
                          ? `${slot.slots[0].open} - ${slot.slots[0].close}`
                          : "Open"}
                      </span>
                    ) : (
                      <span
                        style={{ color: "var(--theme-text-faint)" }}
                        className="text-[11px] font-medium block"
                      >
                        Closed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── 9. FOOTER ───────────────── */}
      <PublicFooter
        footerSection={footerSection}
        restaurantName={name}
        restaurantTagline={tagline}
        restaurantDescription={shortDescription || fullDescription}
        logo={logo}
        address={displayAddress}
        city={displayCity}
        contact={contact}
        businessHours={businessHours}
      />
    </div>
  );
}
