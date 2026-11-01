import RootShell, { baseMetadata } from "@/components/RootShell";
export const metadata = baseMetadata;
export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootShell>{children}</RootShell>;
}
