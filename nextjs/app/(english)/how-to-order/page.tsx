import Page, { getPageMetadata } from '@/components/pages/how-to-order';
export const metadata = getPageMetadata();
export const revalidate = 86400;
export default function EnglishPage() { return <Page />; }
