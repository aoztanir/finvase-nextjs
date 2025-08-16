import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { get_deal_documents } from "@/lib/queries/document";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "bank") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deal_id = params.id;
    const { searchParams } = new URL(request.url);
    const parent_id = searchParams.get("parent_id");

    const documents = await get_deal_documents(
      deal_id,
      parent_id || undefined
    );

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}