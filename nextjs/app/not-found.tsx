import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, ShoppingBag, Shirt } from "lucide-react";

export default function NotFound() {
  return (
    <div className="rt-not-found">
      <section className="rt-hero min-h-[85vh]">
        <Image
          src="/images/about/sorting-process.webp"
          alt="RealismThrift Sorting Facility - High-Precision Wholesale Supply Center for Second Hand Branded Fashion in China"
          fill
          sizes="100vw"
          priority
          className="rt-hero-bg opacity-40"
        />
        <div className="rt-hero-overlay bg-black/60" />
        <div className="rt-container relative z-10 text-center flex flex-col items-center justify-center">
          <div className="mb-8 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-red/20 border border-brand-red/30 text-brand-gold font-montserrat text-sm font-bold uppercase tracking-widest rt-fade-in">
            <Package size={16} /> Page Not Found
          </div>
          
          <div className="mb-8 w-full rt-fade-in-delayed">
            <p aria-hidden="true" className="text-[clamp(5rem,20vw,9rem)] font-black text-white/30 leading-none font-montserrat select-none">
              404
            </p>
            <div className="flex flex-col items-center justify-center">
              <h1 className="rt-hero-title mb-4">Page Not Found</h1>
              <div className="rt-section-divider center w-20 h-1.5" />
            </div>
          </div>

          <p className="rt-hero-subtitle max-w-2xl mx-auto mb-12 text-white/80 rt-fade-in-delayed">
            This page may have moved or the link may be incorrect. Browse our product categories below or return to the homepage.
          </p>

          <div className="flex flex-col items-center gap-12 w-full rt-fade-in-delayed">
            <Link href="/" className="rt-btn-primary px-10 py-4 text-lg">
              RETURN TO HOME <ArrowRight size={20} />
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <Link href="/used-brand-clothes" className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-sm hover:bg-white/10 transition-all text-left">
                <Shirt className="text-brand-gold mb-4 group-hover:scale-110 transition-transform" size={28} />
                <h3 className="text-white font-extrabold mb-2 font-montserrat text-lg">USED CLOTHES</h3>
                <p className="text-white/60 text-sm">Sorted selection from major Chinese cities.</p>
              </Link>
              <Link href="/used-brand-shoes" className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-sm hover:bg-white/10 transition-all text-left">
                <ShoppingBag className="text-brand-gold mb-4 group-hover:scale-110 transition-transform" size={28} />
                <h3 className="text-white font-extrabold mb-2 font-montserrat text-lg">USED SHOES</h3>
                <p className="text-white/60 text-sm">Direct factory inventory, mixed and sorted.</p>
              </Link>
              <Link href="/used-brand-bag" className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-sm hover:bg-white/10 transition-all text-left">
                <Package className="text-brand-gold mb-4 group-hover:scale-110 transition-transform" size={28} />
                <h3 className="text-white font-extrabold mb-2 font-montserrat text-lg">USED BAGS</h3>
                <p className="text-white/60 text-sm">Global wholesale supply for handbags and more.</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
