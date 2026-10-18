import { NextRequest, NextResponse } from 'next/server';
import { publicErrorMessage } from '@/lib/server/http/requestValidation';
import { completeTaskAssignment, Learner } from '@/lib/tasks';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function parseLearner(value: unknown): Learner | null {
  return value === 'kiur' || value === 'kirsi' ? value : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const learner = parseLearner(body.learner);
    const assignmentId = Number(body.assignmentId);
    if (!learner || !Number.isInteger(assignmentId)) {
      return NextResponse.json({ message: 'Vale tegevus.' }, { status: 400 });
    }
    return NextResponse.json(completeTaskAssignment(assignmentId, learner));
  } catch (error) {
    return NextResponse.json({ message: publicErrorMessage(error, 'Tegevust ei saanud märkida.') }, { status: 409 });
  }
}
