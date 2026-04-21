"use client";

import React from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { siteHeader, siteFooter } from "@/data/siteData";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader data={siteHeader} />
      <main className="flex-grow">
        {children}
      </main>
      <SiteFooter data={siteFooter} />
    </div>
  );
};
