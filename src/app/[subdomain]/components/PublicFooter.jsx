import React from "react";
import Link from "next/link";
import {
  Utensils,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  MessageCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";

// Social SVG Icons
const SocialIcons = {
  instagram: ({ size = 18, className = "" }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  ),
  facebook: ({ size = 18, className = "" }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  twitter: ({ size = 18, className = "" }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
    </svg>
  ),
  youtube: ({ size = 18, className = "" }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <polygon points="10 15 15 12 10 9 10 15"/>
    </svg>
  ),
  linkedin: ({ size = 18, className = "" }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  whatsapp: ({ size = 18, className = "" }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/>
    </svg>
  )
};

const SOCIAL_CONFIGS = [
  { key: "instagram", name: "Instagram", icon: SocialIcons.instagram, prefix: "https://instagram.com/" },
  { key: "facebook", name: "Facebook", icon: SocialIcons.facebook, prefix: "https://facebook.com/" },
  { key: "twitter", name: "X / Twitter", icon: SocialIcons.twitter, prefix: "https://x.com/" },
  { key: "youtube", name: "YouTube", icon: SocialIcons.youtube, prefix: "https://youtube.com/" },
  { key: "linkedin", name: "LinkedIn", icon: SocialIcons.linkedin, prefix: "https://linkedin.com/" },
  { key: "whatsapp", name: "WhatsApp", icon: SocialIcons.whatsapp, isWhatsapp: true }
];

function formatSocialUrl(key, rawValue) {
  if (!rawValue) return null;
  const val = String(rawValue).trim();
  if (!val) return null;

  if (key === "whatsapp") {
    if (val.startsWith("http://") || val.startsWith("https://")) return val;
    const cleanNumber = val.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanNumber}`;
  }

  if (val.startsWith("http://") || val.startsWith("https://")) {
    return val;
  }
  // If user only wrote handle like "@restaurant" or "restaurant"
  const cleanHandle = val.replace(/^@/, "");
  const conf = SOCIAL_CONFIGS.find((c) => c.key === key);
  return conf ? `${conf.prefix}${cleanHandle}` : `https://${val}`;
}

export default function PublicFooter({
  footerSection,
  restaurantName = "Restaurant",
  restaurantTagline,
  restaurantDescription,
  logo,
  address,
  city,
  contact = {},
  businessHours = []
}) {
  // Resolve content object safely whether footerSection is the section wrapper or content itself
  const content = footerSection?.content
    ? footerSection.content
    : (footerSection && (footerSection.title || footerSection.sectionLinks || footerSection.socialLinks))
      ? footerSection
      : {};

  const isEnabled = footerSection ? footerSection.enabled !== false : true;

  if (!isEnabled) {
    return null;
  }

  // Resolve title cleanly: prefer customized title, fallback to restaurantName or "Restaurant"
  const rawTitle = content?.title?.trim();
  const title = (rawTitle && rawTitle !== "Restaurant Name" && rawTitle !== "Tasty Bites")
    ? rawTitle
    : (restaurantName || "Restaurant");

  // Resolve dynamic subtitle
  const subtitle = (content?.subtitle !== undefined && content?.subtitle !== null)
    ? content.subtitle
    : (restaurantTagline || "Authentic Indian Flavors");

  // Resolve description
  const rawDescription = content?.description?.trim();
  const description = (rawDescription && rawDescription.toLowerCase() !== "description")
    ? rawDescription
    : (restaurantDescription || restaurantTagline || "Serving delicious food crafted with passion and fresh ingredients. Join us for a memorable dining experience.");

  // Social Links
  const socialLinksData = content.socialLinks || {};
  const activeSocials = SOCIAL_CONFIGS.map((conf) => {
    const rawVal = socialLinksData[conf.key] || (conf.key === "whatsapp" ? contact?.whatsapp : null);
    const url = formatSocialUrl(conf.key, rawVal);
    return {
      ...conf,
      url
    };
  }).filter((item) => Boolean(item.url));

  // Section Navigation Links
  const defaultSectionLinks = [
    { id: "hero", label: "Home", href: "#hero", enabled: true },
    { id: "about", label: "About Us", href: "#about", enabled: true },
    { id: "menu", label: "Menu", href: "#menu", enabled: true },
    { id: "offers", label: "Offers", href: "#offers", enabled: true },
    { id: "gallery", label: "Gallery", href: "#gallery", enabled: true },
    { id: "map", label: "Location", href: "#map", enabled: true },
    { id: "inquiry", label: "Contact Us", href: "#inquiry", enabled: true }
  ];

  const rawSectionLinks = (content.sectionLinks && Array.isArray(content.sectionLinks) && content.sectionLinks.length > 0)
    ? content.sectionLinks
    : defaultSectionLinks;

  // Filter only enabled section links
  const visibleSectionLinks = rawSectionLinks.filter((link) => link && link.enabled !== false);

  const displayPhone = contact?.primaryPhone || contact?.phone;
  const displayEmail = contact?.email;
  const displayWhatsapp = contact?.whatsapp || socialLinksData?.whatsapp;

  return (
    <footer
      style={{
        backgroundColor: "var(--theme-surface)",
        borderColor: "var(--theme-border)",
        color: "var(--theme-text)"
      }}
      className="border-t transition-colors duration-200 mt-auto"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* Brand & Bio (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo.startsWith("http") ? logo : `http://localhost:5000${logo}`}
                  alt={title}
                  className="w-12 h-12 rounded-2xl object-cover border shadow-sm shrink-0"
                  style={{ borderColor: "var(--theme-border)" }}
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-2xl border flex items-center justify-center font-bold shadow-sm shrink-0"
                  style={{
                    backgroundColor: "var(--theme-primary-soft)",
                    borderColor: "color-mix(in srgb, var(--theme-primary) 30%, transparent)",
                    color: "var(--theme-primary)"
                  }}
                >
                  <Utensils className="w-6 h-6" />
                </div>
              )}
              <div className="min-w-0">
                <h3
                  className="text-xl sm:text-2xl font-black tracking-tight leading-snug truncate"
                  style={{ color: "var(--theme-text)" }}
                >
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs font-medium truncate" style={{ color: "var(--theme-text-muted)" }}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <p
              className="text-xs sm:text-sm leading-relaxed max-w-sm"
              style={{ color: "var(--theme-text-muted)" }}
            >
              {description}
            </p>

            {/* Social media links */}
            {activeSocials.length > 0 && (
              <div className="pt-2 space-y-2">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider block"
                  style={{ color: "var(--theme-text-muted)" }}
                >
                  Connect With Us
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {activeSocials.map(({ key, name, icon: Icon, url }) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={name}
                      style={{
                        backgroundColor: "var(--theme-surface-soft)",
                        borderColor: "var(--theme-border)",
                        color: "var(--theme-text)"
                      }}
                      className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 hover:scale-110 hover:border-primary shadow-sm"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Section Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4
              className="text-sm font-bold uppercase tracking-wider flex items-center gap-2"
              style={{ color: "var(--theme-text)" }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: "var(--theme-primary)" }}
              />
              <span>Quick Links</span>
            </h4>

            {visibleSectionLinks.length > 0 ? (
              <ul className="space-y-2.5">
                {visibleSectionLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      style={{ color: "var(--theme-text)" }}
                      className="group flex items-center gap-2 text-xs sm:text-sm font-medium transition-all duration-150 hover:translate-x-1"
                    >
                      <span
                        className="text-xs opacity-60 group-hover:opacity-100 transition-all duration-150 shrink-0"
                        style={{ color: "var(--theme-primary)" }}
                      >
                        ›
                      </span>
                      <span className="opacity-80 group-hover:opacity-100 group-hover:underline underline-offset-4">
                        {link.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs" style={{ color: "var(--theme-text-muted)" }}>
                No navigation links configured.
              </p>
            )}
          </div>

          {/* Contact & Location Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4
              className="text-sm font-bold uppercase tracking-wider flex items-center gap-2"
              style={{ color: "var(--theme-text)" }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: "var(--theme-primary)" }}
              />
              <span>Contact Us</span>
            </h4>

            <div className="space-y-3 text-xs sm:text-sm" style={{ color: "var(--theme-text-muted)" }}>
              {address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--theme-primary)" }} />
                  <span className="leading-relaxed" style={{ color: "var(--theme-text)" }}>
                    {address}
                  </span>
                </div>
              )}

              {displayPhone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 shrink-0" style={{ color: "var(--theme-primary)" }} />
                  <a
                    href={`tel:${displayPhone.replace(/[^0-9+]/g, "")}`}
                    className="hover:underline font-medium"
                    style={{ color: "var(--theme-text)" }}
                  >
                    {displayPhone}
                  </a>
                </div>
              )}

              {displayWhatsapp && (
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 shrink-0" style={{ color: "var(--theme-primary)" }} />
                  <a
                    href={`https://wa.me/${displayWhatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline font-medium"
                    style={{ color: "var(--theme-primary)" }}
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              )}

              {displayEmail && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 shrink-0" style={{ color: "var(--theme-primary)" }} />
                  <a
                    href={`mailto:${displayEmail}`}
                    className="hover:underline font-medium truncate"
                    style={{ color: "var(--theme-text)" }}
                  >
                    {displayEmail}
                  </a>
                </div>
              )}

              {businessHours && businessHours.length > 0 && (
                <div className="pt-3 border-t" style={{ borderColor: "var(--theme-border-subtle)" }}>
                  <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--theme-text)" }}>
                    <Clock className="w-4 h-4" style={{ color: "var(--theme-primary)" }} />
                    <span>Open for Dine-in & Takeaway</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Tablly branding */}
        <div
          className="mt-14 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{
            borderColor: "var(--theme-border)",
            color: "var(--theme-text-muted)"
          }}
        >
          <p>&copy; {new Date().getFullYear()} <strong style={{ color: "var(--theme-text)" }}>{title}</strong>. All rights reserved.</p>

          <p className="flex items-center gap-1.5">
            <span>Powered by</span>
            <Link
              href="/"
              style={{ color: "var(--theme-primary)" }}
              className="font-bold hover:underline inline-flex items-center gap-0.5"
            >
              <span>Tablly</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
