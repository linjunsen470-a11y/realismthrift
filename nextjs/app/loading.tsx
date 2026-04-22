import Image from "next/image";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="rt-loading bg-white min-h-screen">
      {/* 1. Immediate Feedback: Top Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[9999] overflow-hidden">
        <div className="h-full bg-brand-red animate-[loading-bar_2s_infinite_linear]" />
      </div>

      <div className="rt-container py-20 flex flex-col items-center">
        {/* 2. Delayed & Optimized Content: 2s Delay */}
        <div className="w-full flex flex-col items-center opacity-0 animate-[delayed-fade-in_0.5s_ease-out_2s_both]">
          
          {/* Animated Logo Container with Soft Glow */}
          <div className="relative w-28 h-28 mb-10 group">
            <div className="absolute inset-0 bg-brand-red/5 rounded-full blur-2xl animate-pulse" />
            <div className="absolute inset-0 border-[3px] border-brand-red/5 rounded-full" />
            <div className="absolute inset-0 border-[3px] border-t-brand-red border-r-brand-red/40 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <Image
                src="/img/logo.png"
                alt="RealismThrift Logo"
                width={50}
                height={50}
                className="object-contain opacity-80"
              />
            </div>
          </div>

          {/* Premium Loading Text */}
          <div className="text-center mb-16">
            <h2 className="text-brand-dark font-montserrat font-black text-2xl tracking-[0.2em] uppercase mb-3">
              QC Sorting
              <span className="inline-flex w-8 ml-1">
                <span className="animate-[dot-pulse_1.5s_infinite_0s]">.</span>
                <span className="animate-[dot-pulse_1.5s_infinite_0.3s]">.</span>
                <span className="animate-[dot-pulse_1.5s_infinite_0.6s]">.</span>
              </span>
            </h2>
            <p className="text-gray-400 font-sans text-sm font-medium tracking-widest uppercase">
              Finalizing Export Documentation
            </p>
          </div>

          {/* High-Fidelity Skeleton Grid */}
          <div className="w-full space-y-16">
            {/* Header Section Skeleton */}
            <div className="flex flex-col items-center space-y-4">
              <Skeleton variant="text" className="h-6 w-32 bg-brand-red/5" />
              <Skeleton variant="rect" className="h-10 w-full max-w-lg rounded-md" />
              <div className="w-16 h-1.5 bg-brand-red/10 rounded-full" />
            </div>

            {/* Product Card Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-gray-50 border border-gray-100">
                    <Skeleton className="absolute inset-0" />
                    <div className="absolute top-3 left-3 w-16 h-5 bg-white/40 rounded-sm" />
                  </div>
                  <div className="space-y-2 px-1">
                    <Skeleton variant="text" className="h-5 w-3/4" />
                    <Skeleton variant="text" className="h-4 w-1/2 opacity-60" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes delayed-fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}} />
    </div>
  );
}
