import React from "react";
import Link from "next/link";
import {
  Utensils,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Globe,
  Share2,
  Search,
  Home,
  CheckCircle2,
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
    name,
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

  // Section overrides from website builder if configured
  const heroSection = sections?.find((s) => s.sectionId === "hero" || s.type === "hero");
  const aboutSection = sections?.find((s) => s.sectionId === "about" || s.type === "about");
  const gallerySection = sections?.find((s) => s.sectionId === "gallery" || s.type === "gallery");

  const heroHeading = heroSection?.content?.heading || name;
  const heroDescription =
    heroSection?.content?.description ||
    shortDescription ||
    fullDescription ||
    "Welcome to our restaurant! Explore our full digital menu and enjoy freshly prepared dishes at your table.";
  const heroButtonText = heroSection?.content?.buttonText || "Browse Digital Menu";
  const heroCover = heroSection?.content?.imageUrl || coverImage;

  const aboutTitle = aboutSection?.content?.title || "About Our Kitchen";
  const aboutDescription =
    aboutSection?.content?.description ||
    fullDescription ||
    shortDescription ||
    "We take pride in serving high-quality meals crafted with love and fresh ingredients. Point your phone camera at any table QR stand to browse photos, customize spices, and place orders directly to our chefs.";

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

          <div className="flex items-center gap-3">
            <Link
              href="/menu/1"
              style={{
                backgroundColor: "var(--theme-primary)",
                color: "var(--theme-primary-text)",
                boxShadow: "0 4px 14px 0 color-mix(in srgb, var(--theme-primary) 30%, transparent)",
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all hover:opacity-90 hover:scale-105"
            >
              <span>View Menu & Order</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ───────────────── HERO BANNER ───────────────── */}
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
                <MapPin className="w-3 h-3" style={{ color: "var(--theme-primary)" }} />
                {displayCity}
              </span>
            </div>

            <h2
              style={{ color: "var(--theme-text)" }}
              className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight"
            >
              {heroHeading}
            </h2>

            {tagline && (
              <p
                style={{ color: "var(--theme-primary)" }}
                className="text-base sm:text-xl font-medium"
              >
                {tagline}
              </p>
            )}

            <p
              style={{ color: "var(--theme-text-muted)" }}
              className="text-sm sm:text-base leading-relaxed max-w-2xl"
            >
              {heroDescription}
            </p>

            {cuisineTypes.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-2">
                {cuisineTypes.map((cuisine, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: "var(--theme-surface)",
                      color: "var(--theme-text)",
                      borderColor: "var(--theme-border)",
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg border font-medium"
                  >
                    • {cuisine}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/menu/1"
                style={{
                  backgroundColor: "var(--theme-primary)",
                  color: "var(--theme-primary-text)",
                  boxShadow: "0 10px 25px -5px color-mix(in srgb, var(--theme-primary) 35%, transparent)",
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
              >
                <span>{heroButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
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

      {/* ───────────────── ABOUT & HIGHLIGHTS ───────────────── */}
      <section
        style={{
          backgroundColor: "var(--theme-surface-soft)",
          borderColor: "var(--theme-border)",
        }}
        className="py-12 border-t"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Col 1: About */}
            <div className="md:col-span-2 space-y-4">
              <h3
                style={{ color: "var(--theme-text)" }}
                className="text-xl font-bold flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" style={{ color: "var(--theme-primary)" }} />
                {aboutTitle}
              </h3>
              <p
                style={{ color: "var(--theme-text-muted)" }}
                className="text-sm leading-relaxed whitespace-pre-line"
              >
                {aboutDescription}
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  style={{
                    backgroundColor: "var(--theme-surface)",
                    borderColor: "var(--theme-border)",
                  }}
                  className="p-4 rounded-xl border flex items-start gap-3 shadow-sm"
                >
                  <CheckCircle2
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: "var(--theme-primary)" }}
                  />
                  <div>
                    <h4
                      style={{ color: "var(--theme-text)" }}
                      className="text-sm font-semibold"
                    >
                      Instant QR Ordering
                    </h4>
                    <p
                      style={{ color: "var(--theme-text-muted)" }}
                      className="text-xs mt-0.5"
                    >
                      Order straight from your phone at your table.
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "var(--theme-surface)",
                    borderColor: "var(--theme-border)",
                  }}
                  className="p-4 rounded-xl border flex items-start gap-3 shadow-sm"
                >
                  <CheckCircle2
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: "var(--theme-primary)" }}
                  />
                  <div>
                    <h4
                      style={{ color: "var(--theme-text)" }}
                      className="text-sm font-semibold"
                    >
                      Fresh Daily Ingredients
                    </h4>
                    <p
                      style={{ color: "var(--theme-text-muted)" }}
                      className="text-xs mt-0.5"
                    >
                      Cooked hot and fresh on demand.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2: Quick Information Card */}
            <div
              style={{
                backgroundColor: "var(--theme-surface)",
                borderColor: "var(--theme-border)",
              }}
              className="p-6 rounded-2xl border space-y-5 shadow-sm"
            >
              <h4
                style={{
                  color: "var(--theme-text)",
                  borderColor: "var(--theme-border)",
                }}
                className="font-bold text-base border-b pb-3"
              >
                Contact & Location
              </h4>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3" style={{ color: "var(--theme-text)" }}>
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--theme-primary)" }} />
                  <span>{displayAddress}</span>
                </div>

                {contact?.primaryPhone && (
                  <div className="flex items-center gap-3" style={{ color: "var(--theme-text)" }}>
                    <Phone className="w-4 h-4 shrink-0" style={{ color: "var(--theme-primary)" }} />
                    <a
                      href={`tel:${contact.primaryPhone}`}
                      className="underline-offset-2 hover:underline"
                    >
                      {contact.primaryPhone}
                    </a>
                  </div>
                )}

                {contact?.email && (
                  <div className="flex items-center gap-3" style={{ color: "var(--theme-text)" }}>
                    <Mail className="w-4 h-4 shrink-0" style={{ color: "var(--theme-primary)" }} />
                    <a
                      href={`mailto:${contact.email}`}
                      className="underline-offset-2 hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}

                {googleReviewLink && (
                  <div className="pt-2">
                    <a
                      href={googleReviewLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--theme-primary)" }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                    >
                      <span>Leave a Google Review</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Social Icons */}
              {(socialLinks?.instagram || socialLinks?.facebook || socialLinks?.twitter || socialLinks?.other) && (
                <div
                  style={{ borderColor: "var(--theme-border)" }}
                  className="pt-3 border-t flex items-center gap-3"
                >
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        backgroundColor: "var(--theme-surface-soft)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-text-muted)",
                      }}
                      className="p-2 rounded-lg border transition-colors hover:opacity-80"
                      aria-label="Instagram"
                    >
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        backgroundColor: "var(--theme-surface-soft)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-text-muted)",
                      }}
                      className="p-2 rounded-lg border transition-colors hover:opacity-80"
                      aria-label="Facebook"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        backgroundColor: "var(--theme-surface-soft)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-text-muted)",
                      }}
                      className="p-2 rounded-lg border transition-colors hover:opacity-80"
                      aria-label="Twitter / X"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.other && (
                    <a
                      href={socialLinks.other}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        backgroundColor: "var(--theme-surface-soft)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-text-muted)",
                      }}
                      className="p-2 rounded-lg border transition-colors hover:opacity-80"
                      aria-label="Website"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── GALLERY SECTION (If configured) ───────────────── */}
      {gallerySection?.enabled && gallerySection?.content?.images?.length > 0 && (
        <section
          style={{ borderColor: "var(--theme-border)" }}
          className="py-12 border-t"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h3
              style={{ color: "var(--theme-text)" }}
              className="text-xl font-bold mb-6"
            >
              {gallerySection.content.title || "Photo Gallery"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {gallerySection.content.images.slice(0, 8).map((img, idx) => (
                <div
                  key={idx}
                  style={{ borderColor: "var(--theme-border)" }}
                  className="rounded-xl overflow-hidden border aspect-square"
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

      {/* ───────────────── BUSINESS HOURS ───────────────── */}
      {businessHours && businessHours.length > 0 && (
        <section
          style={{ borderColor: "var(--theme-border)" }}
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

      {/* ───────────────── FOOTER ───────────────── */}
      <footer
        style={{
          backgroundColor: "var(--theme-background)",
          borderColor: "var(--theme-border)",
          color: "var(--theme-text-faint)",
        }}
        className="py-8 border-t text-center text-xs space-y-2"
      >
        <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
        <p className="flex items-center justify-center gap-1">
          <span>Powered by</span>
          <Link
            href="/"
            style={{ color: "var(--theme-primary)" }}
            className="hover:underline font-semibold"
          >
            Tablly
          </Link>
        </p>
      </footer>
    </div>
  );
}
