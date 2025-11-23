import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createLinkSchema = z.object({
  targetUrl: z.string().url('Invalid URL format'),
  code: z.string()
    .regex(/^[A-Za-z0-9]{6,8}$/, 'Code must be 6-8 alphanumeric characters')
    .optional(),
});

function generateRandomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 6;
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET /api/links - List all links
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

// POST /api/links - Create a new link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createLinkSchema.parse(body);

    let code = validated.code;

    // Generate random code if not provided
    if (!code) {
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        code = generateRandomCode();
        const existing = await prisma.link.findUnique({
          where: { code },
        });
        
        if (!existing) break;
        attempts++;
      }

      if (attempts === maxAttempts) {
        return NextResponse.json(
          { error: 'Failed to generate unique code' },
          { status: 500 }
        );
      }
    } else {
      // Check if custom code already exists
      const existing = await prisma.link.findUnique({
        where: { code },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        );
      }
    }

    const link = await prisma.link.create({
      data: {
        code: code!,
        targetUrl: validated.targetUrl,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}
