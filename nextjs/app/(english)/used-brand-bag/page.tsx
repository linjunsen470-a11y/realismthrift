import Page, { getPageMetadata } from '@/components/pages/used-brand-bag';
export const metadata = getPageMetadata();
export const revalidate = 86400;
export default function EnglishPage() { return <Page />; }
