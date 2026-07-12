import { redirect } from 'next/navigation';

// One-release compatibility bridge. New clients use the static result shell so
// arbitrary UUID paths do not need to be precached.
export default async function LegacyLocalResultPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  redirect(`/tulemus?clientId=${encodeURIComponent(clientId)}`);
}
