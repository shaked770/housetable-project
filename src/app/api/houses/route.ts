import { createHouse } from '@/app/models/house';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  address: z.string().min(1).max(100),
  currentValue: z.number().min(0),
  loanAmount: z.number().min(0),
  risk: z.number().min(0).max(1).optional(),
});

export async function POST(request: NextRequest) {
  const newHouse = await request.json();
  try {
    schema.parse(newHouse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error' }, { status: 400 });
    }
  }
  const house = await createHouse(newHouse);
  return NextResponse.json({ house });
}
