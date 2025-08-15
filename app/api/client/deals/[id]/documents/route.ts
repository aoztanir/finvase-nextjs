import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { get_deal_documents, get_client_deal_details } from "@/lib/queries/client";

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
  const { searchParams } = new URL(req.url);
  const parent_id = searchParams.get("parent_id") || null;

  try {
    const deal = await get_client_deal_details(deal_id, session.user.id);
    if (!deal) {
      return NextResponse.json({ error: "Deal not found or access denied" }, { status: 404 });
    }

    const documents = await get_deal_documents(deal_id, parent_id);
    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching deal documents:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
