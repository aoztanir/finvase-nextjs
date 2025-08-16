import { db } from "@/lib/db/client";
import { document, documentRequirement, user } from "@/lib/db/schema";
import { desc, eq, and, isNull } from "drizzle-orm";

export async function get_deal_documents(deal_id: string, parent_id?: string) {
  const where_conditions = [
    eq(document.deal_id, deal_id),
  ];

  if (parent_id) {
    where_conditions.push(eq(document.parent_id, parent_id));
  } else {
    where_conditions.push(isNull(document.parent_id));
  }

  return await db
    .select({
      id: document.id,
      name: document.name,
      file_type: document.file_type,
      file_size: document.file_size,
      mime_type: document.mime_type,
      file_path: document.file_path,
      parent_id: document.parent_id,
      uploaded_by: document.uploaded_by,
      uploader_name: user.name,
      created_at: document.created_at,
      updated_at: document.updated_at,
    })
    .from(document)
    .leftJoin(user, eq(document.uploaded_by, user.id))
    .where(and(...where_conditions))
    .orderBy(desc(document.file_type), desc(document.updated_at)); // Folders first, then by date
}

export async function get_document_breadcrumb(document_id: string) {
  // This would recursively build the breadcrumb path
  // For now, returning a simple implementation
  const doc = await db
    .select({
      id: document.id,
      name: document.name,
      parent_id: document.parent_id,
    })
    .from(document)
    .where(eq(document.id, document_id))
    .limit(1);

  if (!doc.length) return [];

  const breadcrumb = [];
  let current = doc[0];

  while (current) {
    breadcrumb.unshift({
      id: current.id,
      name: current.name,
    });

    if (!current.parent_id) break;

    const parent = await db
      .select({
        id: document.id,
        name: document.name,
        parent_id: document.parent_id,
      })
      .from(document)
      .where(eq(document.id, current.parent_id))
      .limit(1);

    current = parent.length ? parent[0] : null;
  }

  return breadcrumb;
}

export async function create_document(data: {
  name: string;
  deal_id: string;
  parent_id?: string;
  file_type: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  uploaded_by: string;
}) {
  return await db
    .insert(document)
    .values({
      name: data.name,
      deal_id: data.deal_id,
      parent_id: data.parent_id,
      file_type: data.file_type,
      file_path: data.file_path,
      file_size: data.file_size,
      mime_type: data.mime_type,
      uploaded_by: data.uploaded_by,
    })
    .returning();
}

export async function create_folder(data: {
  name: string;
  deal_id: string;
  parent_id?: string;
  uploaded_by: string;
}) {
  return await db
    .insert(document)
    .values({
      name: data.name,
      deal_id: data.deal_id,
      parent_id: data.parent_id,
      file_type: 'folder',
      uploaded_by: data.uploaded_by,
    })
    .returning();
}

export async function delete_document(document_id: string) {
  return await db
    .delete(document)
    .where(eq(document.id, document_id))
    .returning();
}

export async function update_document_name(document_id: string, new_name: string) {
  return await db
    .update(document)
    .set({ 
      name: new_name,
      updated_at: new Date(),
    })
    .where(eq(document.id, document_id))
    .returning();
}

export async function get_deal_document_requirements(deal_id: string) {
  return await db
    .select({
      id: documentRequirement.id,
      name: documentRequirement.name,
      description: documentRequirement.description,
      category: documentRequirement.category,
      status: documentRequirement.status,
      is_required: documentRequirement.is_required,
      uploaded_document_id: documentRequirement.uploaded_document_id,
      upload_date: document.created_at,
      created_at: documentRequirement.created_at,
      updated_at: documentRequirement.updated_at,
    })
    .from(documentRequirement)
    .leftJoin(document, eq(documentRequirement.uploaded_document_id, document.id))
    .where(eq(documentRequirement.deal_id, deal_id))
    .orderBy(documentRequirement.category, documentRequirement.name);
}

export async function create_document_requirement(data: {
  deal_id: string;
  name: string;
  description?: string;
  category: string;
  is_required: boolean;
}) {
  return await db
    .insert(documentRequirement)
    .values({
      deal_id: data.deal_id,
      name: data.name,
      description: data.description,
      category: data.category,
      is_required: data.is_required,
      status: 'missing',
    })
    .returning();
}

export async function update_document_requirement_status(
  requirement_id: string, 
  status: 'uploaded' | 'missing' | 'recommended',
  uploaded_document_id?: string
) {
  return await db
    .update(documentRequirement)
    .set({ 
      status,
      uploaded_document_id,
      updated_at: new Date(),
    })
    .where(eq(documentRequirement.id, requirement_id))
    .returning();
}