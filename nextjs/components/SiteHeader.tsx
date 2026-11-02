import { SiteHeader as SiteHeaderType } from "@/types";
import { HeaderClient } from "@/components/HeaderClient";
import { type Locale } from "@/lib/i18n/routing";
import { getTranslator, getClientMessages } from "@/lib/i18n/server";

interface SiteHeaderProps {
  locale?: Locale;
  data: SiteHeaderType;
}

export function SiteHeader({ locale = "en", data }: SiteHeaderProps) {
  const t = getTranslator(locale);
  return (
    <header>
      <div className="rt-topbar">
        <div className="rt-container">
          <span className="rt-topbar-brand">
            {t("USED CLOTHES, SHOES & BAGS WHOLESALE FROM CHINA")}
          </span>

          <div className="rt-topbar-ticker" aria-hidden="true">
            <span
              className="rt-topbar-ticker-text"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              {t(
                "Wholesale Used Clothes | Wholesale Used Shoes | Wholesale Used Bags | Brand Clothes Wholesale | Second Hand Shoes Export | Used Bags Wholesale China |",
              )}
            </span>
          </div>
        </div>
      </div>
      <HeaderClient
        locale={locale}
        messages={getClientMessages(locale, "header")}
        data={data}
      />
    </header>
  );
}
