import { NextRequest, NextResponse } from "next/server";

console.log(1);
export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  console.log(name, email);

  return NextResponse.json({ msg: "done" }, { status: 200 });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ msg: "done" }, { status: 200 });
}
