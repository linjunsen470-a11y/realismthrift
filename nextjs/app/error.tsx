"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rt-error bg-brand-light min-h-[70vh] flex items-center justify-center py-20">
      <div className="rt-container max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="p-6 bg-brand-gold/10 rounded-full border border-brand-gold/20">
            <AlertTriangle size={64} className="text-brand-gold animate-pulse" />
          </div>
        </div>

        <h1 className="rt-section-title mb-4">CONNECTION INTERRUPTED</h1>
        <div className="rt-section-divider center" />
        
        <p className="rt-section-copy mb-12">
          Our logistics pipeline encountered an unexpected delay while processing your request. 
          This might be a temporary connection issue.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="rt-btn-primary px-8 py-3 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={18} /> RETRY CONNECTION
          </button>
          
          <Link
            href="/"
            className="rt-btn-outline !text-brand-dark !border-brand-dark/20 hover:!bg-brand-dark hover:!text-white px-8 py-3 flex items-center gap-2"
          >
            <Home size={18} /> BACK TO HOME
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400 font-mono">
            Error ID: {error.digest || "Logistics-ERR-500"}
          </p>
        </div>
      </div>
    </div>
  );
}
