import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import { PhishingHistory } from "@/models/PhishingHistory";

export async function POST(req: Request) {
  const { userId } = await auth();
  console.log("👤 userId:", userId);
  console.log("🌐 MONGODB_URI:", process.env.MONGODB_URI);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { url, isPhishing, confidence } = body;

  try {
    await connectToDB();
    const entry = await PhishingHistory.create({
      userId,
      url,
      isPhishing,
      confidence,
    });

    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save history" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDB();
    const data = await PhishingHistory.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
