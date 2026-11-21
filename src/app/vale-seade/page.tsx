import { cookies } from 'next/headers';
import WrongDevice from '@/app/components/WrongDevice';
import { DEVICE_BINDING_COOKIE, verifyDeviceBindingToken } from '@/lib/auth/deviceBinding';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// A phone bound to one child lands here from the other child's pages
// (middleware -> redirectForBoundDevice).
export default async function WrongDevicePage({ searchParams }: { searchParams: Promise<{ laps?: string }> }) {
  const { laps } = await searchParams;
  const token = await verifyDeviceBindingToken((await cookies()).get(DEVICE_BINDING_COOKIE)?.value);
  const owner = token?.binding === 'kiur' || token?.binding === 'kirsi' ? token.binding : null;
  const wanted = laps === 'kiur' || laps === 'kirsi' ? laps : null;
  return <WrongDevice owner={owner} wanted={wanted} />;
}
