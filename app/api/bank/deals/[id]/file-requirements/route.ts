import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { get_deal_document_requirements, create_document_requirement } from "@/lib/queries/document";

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
    const requirements = await get_deal_document_requirements(deal_id);

    // Transform the data to match the frontend interface
    const transformed_requirements = requirements.map(req => ({
      id: req.id,
      name: req.name,
      category: req.category,
      status: req.status,
      description: req.description,
      uploaded_file_id: req.uploaded_document_id,
      upload_date: req.upload_date,
    }));

    return NextResponse.json(transformed_requirements);
  } catch (error) {
    console.error("Error fetching file requirements:", error);
    return NextResponse.json(
      { error: "Failed to fetch file requirements" },
      { status: 500 }
    );
  }
}

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
    
    const { name, description, category, is_required = true } = body;

    if (!name || !category) {
      return NextResponse.json({ 
        error: "Name and category are required" 
      }, { status: 400 });
    }

    const requirement = await create_document_requirement({
      deal_id,
      name,
      description,
      category,
      is_required,
    });

    return NextResponse.json(requirement[0]);
  } catch (error) {
    console.error("Error creating file requirement:", error);
    return NextResponse.json(
      { error: "Failed to create file requirement" },
      { status: 500 }
    );
  }
}