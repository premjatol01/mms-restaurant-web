import Link from "next/link";
import { UtensilsCrossed, QrCode } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-text-on-primary shadow-md">
          <UtensilsCrossed size={28} />
        </div>

        <h1 className="text-2xl font-bold text-text-primary mb-2">
          The Green Table
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-8">
          Scan the QR code on your table to browse the menu, order, and track
          your table session.
        </p>

        <Link
          href="/menu/05"
          className="inline-flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-hover active:scale-[0.99] text-text-on-primary font-semibold rounded-xl py-3.5 px-6 transition-all shadow-sm"
        >
          <QrCode size={18} />
          View demo menu (Table 05)
        </Link>
      </div>
    </div>
  );
}
