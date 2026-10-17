import KaardimangApp from '@/app/components/kaardimang/KaardimangApp';
import PreviewGate from '@/app/components/textbook/PreviewGate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Parent preview of the map game: the child's screens against the isolated
// preview learner. Nothing here touches Kiur's rounds or statistics.
export default async function KaardimangPreviewPage() {
  return <PreviewGate><KaardimangApp scope='preview' backHref='/vanem' backLabel='Vanema ala' /></PreviewGate>;
}
