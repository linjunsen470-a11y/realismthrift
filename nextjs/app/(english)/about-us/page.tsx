import Page, { getPageMetadata } from '@/components/pages/about-us';
export const metadata = getPageMetadata();
export const revalidate = 86400;
export default function EnglishPage() { return <Page />; }
