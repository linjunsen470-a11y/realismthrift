"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Full document navigation prevents carrying analytics into utility pages. */

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function isUtilityPath(path: string) {
  return path === "/email-preferences" || path.startsWith("/email-preferences/") || path.startsWith("/outreach/");
}

export default function SiteChrome({ children, header, footer, editing }: {
  children: ReactNode; header: ReactNode; footer: ReactNode; editing: ReactNode;
}) {
  const utility = isUtilityPath(usePathname());
  return (
    <>
      <div className={`flex min-h-screen flex-col ${utility ? "bg-[#fcfcf9]" : ""}`}>
        {utility ? (
          <header className="flex justify-center px-6 pb-4 pt-10 sm:pt-14">
            <a href="/" aria-label="RealismThrift home">
              <Image src="/img/logo.webp" alt="RealismThrift" width={160} height={54} className="h-12 w-auto object-contain" priority />
            </a>
          </header>
        ) : header}
        <main id="main-content" className={utility ? "flex grow items-start justify-center px-5 py-8 sm:py-12" : "flex-grow"}>{children}</main>
        {utility ? (
          <footer className="flex justify-center gap-6 px-5 pb-8 text-sm text-[#686862]">
            <a className="hover:underline" href="/privacy-policy">Privacy</a>
            <a className="hover:underline" href="mailto:sales@realismthrift.com">Contact us</a>
          </footer>
        ) : footer}
      </div>
      {utility ? null : editing}
    </>
  );
}
