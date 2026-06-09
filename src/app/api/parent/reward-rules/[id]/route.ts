import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { deleteRewardRule, listRewardRules, RewardLearnerScope, updateRewardRule } from '@/lib/rewardRules';

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

async function ruleId(params: Promise<{ id: string }>) {
  const { id } = await params;
  const value = Number(id);
  return Number.isInteger(value) ? value : null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const id = await ruleId(params);
  if (!id) return NextResponse.json({ message: 'Vale auhind.' }, { status: 400 });
  try {
    updateRewardRule(id, parseBody(await req.json()));
    return NextResponse.json({ rules: listRewardRules() });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Auhinda ei saanud muuta.' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const id = await ruleId(params);
  if (!id) return NextResponse.json({ message: 'Vale auhind.' }, { status: 400 });
  deleteRewardRule(id);
  return NextResponse.json({ rules: listRewardRules() });
}
