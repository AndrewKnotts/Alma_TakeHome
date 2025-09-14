import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> } // Next 15 async params
) {
  const { id } = await ctx.params;
  const item = db.get(id);
  if (!item) return new NextResponse('Not Found', { status: 404 });
  return NextResponse.json(item);
}
