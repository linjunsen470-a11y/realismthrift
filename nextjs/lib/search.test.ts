import { describe, expect, it } from "vitest";
import { searchStaticEntries } from "./search";

describe("existing static catalog search", () => {
  it("finds the correct products using the five supported languages", () => {
    for (const [product, queries] of [
      ["clothes", ["clothes", "ropa", "vêtements", "ملابس", "quần áo"]],
      ["shoes", ["shoes", "zapatos", "chaussures", "أحذية", "giày"]],
      ["bags", ["bags", "bolsos", "sacs", "حقائب", "túi xách"]],
    ] as const) {
      for (const query of queries)
        expect(searchStaticEntries(query)[0]?.id, query).toBe(
          `product-${product}`,
        );
    }
  });
  it("matches unaccented input without matching unrelated or empty queries", () => {
    expect(searchStaticEntries("giay")[0]?.id).toBe("product-shoes");
    expect(searchStaticEntries("vetements")[0]?.id).toBe("product-clothes");
    expect(searchStaticEntries("!!!")).toEqual([]);
    expect(searchStaticEntries("unrelatedproductxyz")).toEqual([]);
  });
  it("finds shipping, payment, MOQ and contact guidance in each buyer language", () => {
    for (const [id, queries] of [
      ["faq-shipping", ["envíos", "expédition", "الشحن", "vận chuyển"]],
      ["faq-payment", ["pago", "paiement", "الدفع", "thanh toán"]],
      [
        "faq-moq",
        [
          "cantidad mínima",
          "quantité minimale",
          "الحد الأدنى للطلب",
          "số lượng tối thiểu",
        ],
      ],
      ["page-contact", ["contacto", "contacter", "اتصال", "liên hệ"]],
    ] as const) {
      for (const query of queries)
        expect(
          searchStaticEntries(query).map((result) => result.id),
          query,
        ).toContain(id);
    }
  });
});
