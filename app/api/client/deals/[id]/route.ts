import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { get_client_deal_details } from "@/lib/queries/client";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "client") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const deal_id = params.id;

  try {
    const deal = await get_client_deal_details(deal_id, session.user.id);
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }
    return NextResponse.json(deal);
  } catch (error) {
    console.error("Error fetching client deal details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
