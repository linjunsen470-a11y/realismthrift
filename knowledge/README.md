# RealismThrift Inquiry QA Knowledge Base

This directory stores the human-reviewable gold-standard QA corpus for RealismThrift's future LLM inquiry assistant, RAG pipeline, and LangGraph customer-service workflow.

## Files

| QA IDs | Buyer questions |
| --- | --- |
| 001–100 | [Company, sourcing and contact](qa-01-company-general.md) |
| 101–200 | [Clothing grades, bales and packing](qa-02-used-brand-clothes.md) |
| 201–300 | [Shoe grading, pairs and sacks](qa-03-used-brand-shoes.md) |
| 301–400 | [Bags, hardware and packing](qa-04-used-brand-bags.md) |
| 401–500 | [Orders, shipping and after-sales support](qa-05-order-logistics-after-sales.md) |
| 501–524 | [Luxury bags and Indonesian freight](qa-06-luxury-bags-and-logistics-supplement.md) |
| 601–624 | [Global wholesale selection and shipping documents](qa-07-global-wholesale-and-shipping-supplement.md) |

## Usage Notes

- Treat these files as review drafts before production use.
- Keep answers conservative: used goods are not new goods, A-grade can still show light use, and first-pick sourcing does not guarantee every item is branded.
- Do not answer live stock, freight, bank-account, or final price questions from the corpus alone. Route those cases to sales confirmation.
- Recommended RAG chunking: one QA entry per chunk, keeping metadata fields with the answer.
- Recommended retrieval metadata: `qa_id`, `category`, `intent`, `product_line`, `risk_level`, and `source_file`.

## Contact Facts

- WhatsApp: `+86 17279444062`
- Email: `sales@realismthrift.com`
- Facility: RealismThrift (Baisha Alley Weilitang), County Road 193, Yuanzhou Town, Boluo County, Huizhou City, Guangdong Province, China
- Expected response: within 12 hours where possible
