import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function POST(request: NextRequest) {
  const { name,postal_code,image,email, state, line1 } = await request.json();

  
  await prisma.user.update({
    where: {
      email: email, // 更新対象のユーザー ID を指定
    },
    data: {
      name: name, // 更新するデータ
      postal_code: postal_code,
      image: image,
      state: state,
      line1: line1
    },
  });

  const userRecord = await getAlluserRecord();
  return NextResponse.json(userRecord);
}

async function getAlluserRecord() {
  const userRecord = await prisma.userRecord.findMany();
  return userRecord;
}