import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { create_document } from "@/lib/queries/document";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

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
    const form_data = await request.formData();
    
    const files = form_data.getAll("files") as File[];
    const parent_id = form_data.get("parent_id") as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploaded_documents = [];

    // Create upload directory if it doesn't exist
    const upload_dir = join(process.cwd(), "uploads", "documents", deal_id);
    await mkdir(upload_dir, { recursive: true });

    for (const file of files) {
      if (file.size === 0) continue;

      // Generate unique filename
      const file_extension = file.name.split('.').pop();
      const unique_filename = `${uuidv4()}.${file_extension}`;
      const file_path = join(upload_dir, unique_filename);
      const relative_path = join("uploads", "documents", deal_id, unique_filename);

      // Save file to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(file_path, buffer);

      // Save to database
      const document_record = await create_document({
        name: file.name,
        deal_id,
        parent_id: parent_id || undefined,
        file_type: "file",
        file_path: relative_path,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: session.user.id,
      });

      uploaded_documents.push(document_record[0]);
    }

    return NextResponse.json({ 
      message: "Files uploaded successfully",
      documents: uploaded_documents
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}