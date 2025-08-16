import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { create_folder } from "@/lib/queries/document";

export async function POST(
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
    const body = await request.json();
    
    const { name, parent_id } = body;

    if (!name) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }

    const folder = await create_folder({
      name,
      deal_id,
      parent_id: parent_id || undefined,
      uploaded_by: session.user.id,
    });

    return NextResponse.json(folder[0]);
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}