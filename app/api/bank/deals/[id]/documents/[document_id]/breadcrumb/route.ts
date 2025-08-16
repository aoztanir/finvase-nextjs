import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { get_document_breadcrumb } from "@/lib/queries/document";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; document_id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "bank") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const breadcrumb = await get_document_breadcrumb(params.document_id);

    return NextResponse.json(breadcrumb);
  } catch (error) {
    console.error("Error fetching breadcrumb:", error);
    return NextResponse.json(
      { error: "Failed to fetch breadcrumb" },
      { status: 500 }
    );
  }
}