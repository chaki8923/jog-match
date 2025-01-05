import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (email) {
    // クエリパラメータに `email` がある場合、FIND を実行
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  }

  // `email` がない場合、全ユーザーを取得
  console.log("全ユーザー取得");
  const users = await getAllUser();
  return NextResponse.json(users);
}


export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')!;

  await prisma.user.delete({
    where: {
      id: id,
    },
  });

  const user = await getAllUser();
  return NextResponse.json(user);
}

async function getAllUser() {
  const user = await prisma.user.findMany();
  return user;
}