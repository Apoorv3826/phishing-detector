import { NextRequest, NextResponse } from "next/server";
import { checkPhishing } from "@/utils/checkPhishing";

export async function POST(req: NextRequest) {
  console.log("🚀 Received POST request");
  const body = await req.json();
  const { url } = body;

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const { isPhishing, confidence } = await checkPhishing(url);
    return NextResponse.json({ isPhishing, confidence });
  } catch (error: any) {
    console.error("❌ Internal error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
