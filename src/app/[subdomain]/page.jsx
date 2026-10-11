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
      return null;
    }

    const json = await res.json();
    return json?.success ? json.data : null;
  } catch (err) {
    // Backend may be offline or network unreachable
    return null;
  }
}

export default async function RestaurantPortfolioPage({ params }) {
  const { subdomain } = await params;
  const restaurant = await getRestaurantData(subdomain);

  // If no restaurant data is returned by the API, show the 404 page
  if (!restaurant) {
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
              404 • Not Found
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-3">
              Restaurant Not Found
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              We couldn&apos;t find an active restaurant portfolio for{" "}
              <span className="text-white font-mono bg-slate-800 px-2 py-0.5 rounded text-xs">
                {subdomain}
              </span>
              . The restaurant may not exist or its subdomain may have changed.
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
  } = restaurant;

  const displayCity = detailedAddress?.city || address?.city || "Local City";
  const displayAddress =
    detailedAddress?.line1 ||
    detailedAddress?.area ||
    address?.fullAddress ||
    `${displayCity}, ${detailedAddress?.state || address?.state || "India"}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* ───────────────── TOP NAV ───────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo.startsWith("http") ? logo : `http://localhost:5000${logo}`}
                alt={name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-800"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                <Utensils className="w-5 h-5" />
              </div>
            )}
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                {name}
              </h1>
              {tagline && (
                <p className="text-xs text-slate-400 hidden sm:block truncate max-w-xs">
                  {tagline}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/menu/1"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <span>View Menu & Order</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ───────────────── HERO BANNER ───────────────── */}
      <section className="relative overflow-hidden pt-8 pb-16">
        {coverImage && (
          <div className="absolute inset-0 z-0 opacity-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage.startsWith("http") ? coverImage : `http://localhost:5000${coverImage}`}
              alt={name}
              className="w-full h-full object-cover blur-sm"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950 z-0" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {restaurantType && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {restaurantType}
                </span>
              )}
              {establishmentYear && (
                <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                  Est. {establishmentYear}
                </span>
              )}
              <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {displayCity}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {name}
            </h2>

            {tagline && (
              <p className="text-base sm:text-xl text-emerald-400 font-medium">
                {tagline}
              </p>
            )}

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {shortDescription || fullDescription || "Welcome to our restaurant! Explore our full digital menu and enjoy freshly prepared dishes at your table."}
            </p>

            {cuisineTypes.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-2">
                {cuisineTypes.map((cuisine, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-900/90 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800"
                  >
                    • {cuisine}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/menu/1"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all"
              >
                <span>Browse Digital Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {contact?.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Us</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── ABOUT & HIGHLIGHTS ───────────────── */}
      <section className="py-12 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Col 1: About */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                About Our Kitchen
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {fullDescription ||
                  shortDescription ||
                  "We take pride in serving high-quality meals crafted with love and fresh ingredients. Point your phone camera at any table QR stand to browse photos, customize spices, and place orders directly to our chefs."}
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Instant QR Ordering</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Order straight from your phone at your table.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Fresh Daily Ingredients</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Cooked hot and fresh on demand.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 2: Quick Information Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <h4 className="font-bold text-white text-base border-b border-slate-800 pb-3">
                Contact & Location
              </h4>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{displayAddress}</span>
                </div>

                {contact?.primaryPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <a href={`tel:${contact.primaryPhone}`} className="hover:text-white underline-offset-2 hover:underline">
                      {contact.primaryPhone}
                    </a>
                  </div>
                )}

                {contact?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <a href={`mailto:${contact.email}`} className="hover:text-white underline-offset-2 hover:underline">
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
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      <span>Leave a Google Review</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Social Icons */}
              {(socialLinks?.instagram || socialLinks?.facebook || socialLinks?.twitter || socialLinks?.other) && (
                <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                    </a>
                  )}
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      aria-label="Facebook"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                      aria-label="Twitter / X"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                  {socialLinks.other && (
                    <a
                      href={socialLinks.other}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
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

      {/* ───────────────── BUSINESS HOURS ───────────────── */}
      {businessHours && businessHours.length > 0 && (
        <section className="py-12 border-t border-slate-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              Opening Hours
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {businessHours.map((slot, index) => (
                <div
                  key={index}
                  className={`p-3.5 rounded-xl border text-center ${
                    slot.isOpen
                      ? "bg-slate-900 border-slate-800"
                      : "bg-slate-950/60 border-slate-800/50 opacity-60"
                  }`}
                >
                  <div className="text-xs font-bold text-white">{slot.day.slice(0, 3)}</div>
                  <div className="mt-1">
                    {slot.isOpen ? (
                      <span className="text-[11px] text-emerald-400 font-medium block">
                        {slot.slots?.[0]
                          ? `${slot.slots[0].open} - ${slot.slots[0].close}`
                          : "Open"}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium block">Closed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── FOOTER ───────────────── */}
      <footer className="py-8 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-500 space-y-2">
        <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
        <p className="flex items-center justify-center gap-1">
          <span>Powered by</span>
          <Link href="/" className="text-emerald-400 hover:underline font-semibold">
            Tablly
          </Link>
        </p>
      </footer>
    </div>
  );
}
