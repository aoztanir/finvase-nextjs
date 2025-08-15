import { db } from "@/lib/db/client";
import { deal, dealEvent, document, user } from "@/lib/db/schema";
import { and, eq, isNull, inArray } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

// --- Functions for Client Dashboard ---

export async function get_client_deals(client_id: string) {
  const deals = await db.select().from(deal).where(eq(deal.client_id, client_id));
  return deals;
}

export async function get_client_deal_details(deal_id: string, client_id: string) {
  const deal_details = await db.select().from(deal).where(and(eq(deal.id, deal_id), eq(deal.client_id, client_id)));
  return deal_details[0];
}

export async function get_deal_events(deal_id: string) {
  const events = await db.select().from(dealEvent).where(eq(dealEvent.deal_id, deal_id));
  return events;
}

export async function get_deal_documents(deal_id: string, parent_id: string | null = null) {
  const documents = await db.select().from(document).where(
    and(
      eq(document.deal_id, deal_id),
      parent_id ? eq(document.parent_id, parent_id) : isNull(document.parent_id)
    )
  );
  return documents;
}


// --- Functions for Bank Dashboard (Client Management) ---

export async function get_all_clients_for_bank(bank_id: string) {
    const client_ids_query = db.selectDistinct({ client_id: deal.client_id })
        .from(deal)
        .where(eq(deal.bank_id, bank_id));

    const client_ids = await client_ids_query;
    const client_user_ids = client_ids.map(c => c.client_id).filter((id): id is string => id !== null);

    if (client_user_ids.length === 0) {
        return [];
    }

    const clients = await db.select().from(user).where(inArray(user.id, client_user_ids));
    return clients;
}

export async function create_client(data: { name: string; email: string; password: string; bank_id: string }) {
    const hashed_password = await bcrypt.hash(data.password, 10);
    
    const new_user = await db.insert(user).values({
        name: data.name,
        email: data.email,
        password: hashed_password,
        role: 'client',
    }).returning();
    
    return new_user[0];
}

export async function update_client(client_id: string, data: { name?: string; email?: string; }) {
    const updated_user = await db.update(user)
        .set(data)
        .where(eq(user.id, client_id))
        .returning();
    return updated_user[0];
}

export async function delete_client(client_id: string) {
    await db.delete(user).where(eq(user.id, client_id));
    return { success: true };
}