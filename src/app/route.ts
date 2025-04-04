import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Quiz Game API", status: "success", docs: '/docs' });
}
