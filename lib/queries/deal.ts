import { db } from "@/lib/db/client";
import { deal, user, cim, investor } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function get_all_deals_for_bank(bank_id: string) {
  return await db
    .select({
      id: deal.id,
      title: deal.title,
      description: deal.description,
      deal_value: deal.deal_value,
      status: deal.status,
      client_name: user.name,
      created_at: deal.created_at,
      updated_at: deal.updated_at,
    })
    .from(deal)
    .leftJoin(user, eq(deal.client_id, user.id))
    .where(eq(deal.bank_id, bank_id))
    .orderBy(desc(deal.created_at));
}

export async function get_deal_by_id(deal_id: string, bank_id: string) {
  const result = await db
    .select({
      id: deal.id,
      title: deal.title,
      description: deal.description,
      deal_value: deal.deal_value,
      status: deal.status,
      client_name: user.name,
      client_email: user.email,
      created_at: deal.created_at,
      updated_at: deal.updated_at,
    })
    .from(deal)
    .leftJoin(user, eq(deal.client_id, user.id))
    .where(eq(deal.id, deal_id) && eq(deal.bank_id, bank_id));
  
  return result[0] || null;
}

export async function get_deal_cims(deal_id: string) {
  return await db
    .select({
      id: cim.id,
      title: cim.title,
      file_url: cim.file_url,
      file_size: cim.file_size,
      uploaded_by_name: user.name,
      created_at: cim.created_at,
    })
    .from(cim)
    .leftJoin(user, eq(cim.uploaded_by, user.id))
    .where(eq(cim.deal_id, deal_id))
    .orderBy(desc(cim.created_at));
}

export async function get_deal_investors(deal_id: string) {
  return await db
    .select({
      id: investor.id,
      investor_name: user.name,
      investor_email: user.email,
      investment_amount: investor.investment_amount,
      status: investor.status,
      created_at: investor.created_at,
    })
    .from(investor)
    .leftJoin(user, eq(investor.user_id, user.id))
    .where(eq(investor.deal_id, deal_id))
    .orderBy(desc(investor.created_at));
}