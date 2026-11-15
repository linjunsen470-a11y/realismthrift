import Page, { getPageMetadata } from '@/components/pages/home';
export const metadata = getPageMetadata();
export const revalidate = 3600;
export default function EnglishPage() { return <Page />; }
