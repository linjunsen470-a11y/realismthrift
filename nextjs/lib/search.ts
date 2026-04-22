import { staticSearchEntries, type SearchEntry } from "@/data/searchContent";
import type { BlogPostCard } from "@/types";

export interface SearchResult extends SearchEntry {
  score: number;
  source: "static" | "blog";
}

const TYPE_WEIGHTS: Record<SearchEntry["type"], number> = {
  product: 5,
  faq: 3,
  page: 2,
  contact: 4,
  blog: 1,
};

const SYNONYM_MAP: Record<string, string[]> = {
  clothes: ["garments", "apparel", "used clothes", "brand clothes"],
  shoes: ["sneakers", "boots", "footwear", "used shoes"],
  bags: ["handbags", "backpacks", "crossbody", "used bags", "luggage"],
  shipping: ["delivery", "logistics", "container", "port", "customs"],
  price: ["price list", "quotation", "quote", "cost"],
  sample: ["samples", "trial", "trial order"],
  moq: ["minimum order quantity", "minimum order"],
  quote: ["quotation", "price list", "wholesale price"],
  quotation: ["quote", "price list"],
  africa: ["african market", "nigeria", "ghana", "kenya", "tanzania"],
  container: ["shipping", "logistics", "20ft", "40ft", "40hq"],
  quality: ["grade", "a grade", "a-grade", "qc", "inspection"],
  whatsapp: ["chat", "message", "contact"],
  order: ["inquiry", "quotation", "payment", "shipment"],
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeQuery(query: string) {
  return normalizeText(query).split(" ").filter(Boolean);
}

function expandTerm(term: string) {
  const expanded = new Set<string>([term]);
  const synonyms = SYNONYM_MAP[term];

  if (synonyms) {
    for (const synonym of synonyms) {
      expanded.add(normalizeText(synonym));
    }
  }

  return [...expanded];
}

function getEntryFields(entry: SearchEntry) {
  return {
    title: normalizeText(entry.title),
    description: normalizeText(entry.description),
    keywords: entry.keywords.map(normalizeText),
  };
}

function fieldIncludesVariant(value: string, variants: string[]) {
  return variants.some((variant) => value.includes(variant));
}

function keywordIncludesVariant(keywords: string[], variants: string[]) {
  return keywords.some((keyword) => fieldIncludesVariant(keyword, variants));
}

function getMatchedTerms(entry: SearchEntry, query: string) {
  const terms = tokenizeQuery(query);
  const { title, description, keywords } = getEntryFields(entry);

  return terms.map((term) => {
    const variants = expandTerm(term);
    const matchesTitle = fieldIncludesVariant(title, variants);
    const matchesKeywords = keywordIncludesVariant(keywords, variants);
    const matchesDescription = fieldIncludesVariant(description, variants);

    return {
      term,
      matches: matchesTitle || matchesKeywords || matchesDescription,
      matchesTitle,
      matchesKeywords,
      matchesDescription,
    };
  });
}

function scoreEntry(entry: SearchEntry, rawQuery: string) {
  const query = normalizeText(rawQuery);
  if (!query) return 0;

  const { title, description, keywords } = getEntryFields(entry);
  const matchedTerms = getMatchedTerms(entry, query);

  if (!matchedTerms.length || matchedTerms.some((term) => !term.matches)) {
    return 0;
  }

  let score = 0;

  if (title.includes(query)) score += 12;
  if (keywords.some((keyword) => keyword.includes(query))) score += 10;
  if (description.includes(query)) score += 6;

  for (const term of matchedTerms) {
    if (term.matchesTitle) score += 4;
    if (term.matchesKeywords) score += 3;
    if (term.matchesDescription) score += 2;
  }

  return score + TYPE_WEIGHTS[entry.type];
}

function sortResults(results: SearchResult[]) {
  return results.toSorted((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    return left.title.localeCompare(right.title);
  });
}

export function buildBlogSearchEntries(posts: BlogPostCard[]): SearchEntry[] {
  return posts.map((post) => ({
    id: post._id,
    type: "blog",
    title: post.title,
    description: post.excerpt,
    href: `/blog/${post.slug}`,
    keywords: [post.category?.title, post.author?.name].filter(
      (value): value is string => Boolean(value)
    ),
  }));
}

export function searchStaticEntries(query: string): SearchResult[] {
  if (!normalizeText(query)) return [];

  const results = staticSearchEntries
    .map((entry) => ({
      ...entry,
      score: scoreEntry(entry, query),
      source: "static" as const,
    }))
    .filter((entry) => entry.score > 0);

  return sortResults(results);
}

export function searchAllContent(query: string, posts: BlogPostCard[]): SearchResult[] {
  if (!normalizeText(query)) return [];

  const blogEntries = buildBlogSearchEntries(posts);
  const results = [...staticSearchEntries, ...blogEntries]
    .map((entry) => ({
      ...entry,
      score: scoreEntry(entry, query),
      source: entry.type === "blog" ? ("blog" as const) : ("static" as const),
    }))
    .filter((entry) => entry.score > 0);

  return sortResults(results);
}
