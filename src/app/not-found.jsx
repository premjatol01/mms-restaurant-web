import Link from "next/link";
import { UtensilsCrossed, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#2b2118] flex flex-col justify-between p-6">
      <header className="max-w-6xl mx-auto w-full py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#d9480f] flex items-center justify-center text-white font-bold shadow-md shadow-[#d9480f]/20">
            <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg text-[#2b2118]">Tablly</span>
        </Link>
      </header>

      <main className="max-w-md mx-auto text-center space-y-6 py-16">
        <div className="w-20 h-20 rounded-2xl bg-white border border-[#ede4dc] flex items-center justify-center mx-auto text-[#d9480f] shadow-lg shadow-[#d9480f]/5">
          <Search className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#d9480f] bg-[#ffe8cc] px-3.5 py-1 rounded-full border border-[#d9480f]/20">
            Error 404
          </span>
          <h1 className="text-3xl font-extrabold text-[#2b2118] mt-3">Restaurant Not Found</h1>
          <p className="text-sm text-[#786154] leading-relaxed">
            The page or restaurant you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#d9480f] hover:bg-[#c93b07] text-white font-semibold text-sm transition-all shadow-lg shadow-[#d9480f]/25 hover:shadow-[#d9480f]/40 hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            <span>Return to Tablly Home</span>
          </Link>
        </div>
      </main>

      <footer className="text-center text-xs text-[#9c887e] py-4">
        &copy; {new Date().getFullYear()} Tablly Platform. All rights reserved.
      </footer>
    </div>
  );
}
