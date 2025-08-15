import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { get_client_deals } from "@/lib/queries/client";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "client") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const deals = await get_client_deals(session.user.id);
    return NextResponse.json(deals);
  } catch (error) {
    console.error("Error fetching client deals:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
