import { PreferencesForm } from "@/components/PreferencesForm";

export default async function PreferencesPage({ searchParams }: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <PreferencesForm mode="unsubscribe" token={token || ""} />;
}
