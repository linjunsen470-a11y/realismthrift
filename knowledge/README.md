# RealismThrift Inquiry QA Knowledge Base

This directory stores the human-reviewable gold-standard QA corpus for RealismThrift's future LLM inquiry assistant, RAG pipeline, and LangGraph customer-service workflow.

## Files

- `qa-01-company-general.md`: company profile, trust, sourcing, contact, service regions, inquiry qualification.
- `qa-02-used-brand-clothes.md`: used brand clothes, bales, grades, MOQ, prices, packing, clothes QC.
- `qa-03-used-brand-shoes.md`: used brand shoes, pairs, sacks, brands, pairing, cleaning, packing, shoe QC.
- `qa-04-used-brand-bags.md`: used brand bags, pieces, sacks, categories, hardware checks, packing, bag QC.
- `qa-05-order-logistics-after-sales.md`: order flow, quotation, payment, shipping, documents, claims, handoff rules.

## Usage Notes

- Treat these files as review drafts before production use.
- Keep answers conservative: used goods are not new goods, A-grade can still show light use, and first-pick sourcing does not guarantee every item is branded.
- Do not answer live stock, freight, bank-account, or final price questions from the corpus alone. Route those cases to sales confirmation.
- Recommended RAG chunking: one QA entry per chunk, keeping metadata fields with the answer.
- Recommended retrieval metadata: `qa_id`, `category`, `intent`, `product_line`, `risk_level`, and `source_file`.

## Contact Facts

- WhatsApp: `+86 133 6748 1710`
- Email: `sales@realismthrift.com`
- Facility: Fuyida Industrial Park, No. 52 Yida Road, Boluo County, Huizhou City, Guangdong Province, China
- Expected response: within 12 hours where possible
