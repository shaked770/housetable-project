import { getHouse, updateHouse } from '@/app/models/house';
import { PrismaClient } from '@prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = +params.id;
  const house = await getHouse(id);
  return NextResponse.json({ house });
}

const schema = z.object({
  address: z.string().min(1).max(100).optional(),
  currentValue: z.number().min(0).optional(),
  loanAmount: z.number().min(0).optional(),
  risk: z.number().min(0).max(1).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const update = await request.json();
  const id = +params.id;
  try {
    schema.parse(update);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error' }, { status: 400 });
    }
  }
  const house = updateHouse(id, update);
  revalidatePath('/');
  revalidatePath(`/[id]`);
  revalidatePath(`/edit/[id]`);
  revalidateTag('house-tag');
  return NextResponse.json({ house });
}
