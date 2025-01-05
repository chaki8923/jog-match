import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET() {
  const userRecord = await getAlluserRecord();
  return NextResponse.json(userRecord);
}

export async function POST(request: NextRequest) {
  const { userId,runTime,distance } = await request.json();
  console.log("userId", userId);
  console.log("runTime", runTime);
  console.log("distance", distance);
  
  await prisma.userRecord.create({
    data: {
      userId: userId,
      runTime: runTime,
      distance: distance
    },
  });

  const userRecord = await getAlluserRecord();
  return NextResponse.json(userRecord);
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')!;

  await prisma.userRecord.delete({
    where: {
      id: id,
    },
  });

  const userRecord = await getAlluserRecord();
  return NextResponse.json(userRecord);
}

async function getAlluserRecord() {
  const userRecord = await prisma.userRecord.findMany();
  return userRecord;
}