import Link from "next/link";
import { UtensilsCrossed, ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
      <header className="max-w-6xl mx-auto w-full py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
            <UtensilsCrossed className="w-5 h-5" />
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
            Error 404
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-3">Restaurant Not Found</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The page or restaurant you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Tablly Home</span>
          </Link>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-500 py-4">
        &copy; {new Date().getFullYear()} Tablly Platform. All rights reserved.
      </footer>
    </div>
  );
}
