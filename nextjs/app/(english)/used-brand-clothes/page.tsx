import Page, { getPageMetadata } from '@/components/pages/used-brand-clothes';
export const metadata = getPageMetadata();
export const revalidate = 86400;
export default function EnglishPage() { return <Page />; }
