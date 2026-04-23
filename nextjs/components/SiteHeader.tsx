import { SiteHeader as SiteHeaderType } from "@/types";
import { HeaderClient } from "@/components/HeaderClient";

interface SiteHeaderProps {
  data: SiteHeaderType;
}

export function SiteHeader({ data }: SiteHeaderProps) {
  return (
    <header>
      <div className="rt-topbar">
        <div className="rt-container">
          <span className="rt-topbar-brand">
            TOP SECOND HAND CLOTHES &amp; SHOES SUPPLIER IN CHINA
          </span>

          <div className="rt-topbar-ticker" aria-hidden="true">
            <span className="rt-topbar-ticker-text">
              Wholesale Used Clothes | Wholesale Used Shoes | Wholesale Used Bags |
              Brand Clothes Wholesale | Second Hand Shoes Export | Used Bags
              Wholesale China |
            </span>
          </div>
        </div>
      </div>
      <HeaderClient data={data} />
    </header>
  );
}
