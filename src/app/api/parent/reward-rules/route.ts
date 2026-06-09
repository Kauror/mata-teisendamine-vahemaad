import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { createRewardRule, listRewardRules, RewardLearnerScope } from '@/lib/rewardRules';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function parseBody(body: Record<string, unknown>) {
  return {
    type: 'learning_streak' as const,
    thresholdDays: Number(body.thresholdDays),
    rewardStars: Number(body.rewardStars),
    learnerScope: (body.learnerScope as RewardLearnerScope) || 'both',
    enabled: body.enabled !== false
  };
}

export async function GET() {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  return NextResponse.json({ rules: listRewardRules() });
}

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  try {
    const id = createRewardRule(parseBody(await req.json()));
    return NextResponse.json({ id, rules: listRewardRules() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Auhinda ei saanud salvestada.' }, { status: 400 });
  }
}
