import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return new Response('Link not found', { status: 404 });
  }

  // Update click count and last clicked time asynchronously
  prisma.link.update({
    where: { code },
    data: {
      totalClicks: { increment: 1 },
      lastClicked: new Date(),
    },
  }).catch(err => console.error('Error updating click count:', err));

  // Perform 302 redirect using NextResponse
  return NextResponse.redirect(link.targetUrl, { status: 302 });
}
