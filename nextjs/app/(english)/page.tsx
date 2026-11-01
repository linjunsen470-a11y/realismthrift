import Page, { getPageMetadata } from '@/components/pages/home';
export const metadata = getPageMetadata();
export const revalidate = 300;
export default function EnglishPage() { return <Page />; }
