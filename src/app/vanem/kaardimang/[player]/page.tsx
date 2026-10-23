import { notFound } from 'next/navigation';
import KaardimangApp from '@/app/components/kaardimang/KaardimangApp';
import PreviewGate from '@/app/components/textbook/PreviewGate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Kairi or Kaur playing the family competition, from the parent area (parent session).
export default async function ParentKaardimangPage({ params }: { params: Promise<{ player: string }> }) {
  const { player } = await params;
  if (player !== 'kairi' && player !== 'kaur') notFound();
  return <PreviewGate><KaardimangApp scope='parent' player={player} backHref='/vanem/halda?tab=sisu' backLabel='Vanema ala' /></PreviewGate>;
}
