import { db } from "@/lib/db/client";
import { user, deal } from "@/lib/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function get_all_clients_for_bank(bank_id: string) {
  return await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      deal_count: count(deal.id),
    })
    .from(user)
    .leftJoin(deal, eq(deal.client_id, user.id))
    .where(eq(user.role, "client"))
    .groupBy(user.id, user.name, user.email, user.created_at)
    .orderBy(desc(user.created_at));
}

export async function get_client_by_id(client_id: string, bank_id: string) {
  const result = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    })
    .from(user)
    .where(and(eq(user.id, client_id), eq(user.role, "client")));
  
  return result[0] || null;
}

export async function create_client(data: {
  name: string;
  email: string;
  password: string;
  bank_id: string;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const result = await db
    .insert(user)
    .values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "client",
    })
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    });

  return result[0];
}

export async function update_client(
  client_id: string,
  data: { name?: string; email?: string },
  bank_id: string
) {
  const result = await db
    .update(user)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(and(eq(user.id, client_id), eq(user.role, "client")))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      updated_at: user.updated_at,
    });

  return result[0] || null;
}

export async function delete_client(client_id: string, bank_id: string) {
  const result = await db
    .delete(user)
    .where(and(eq(user.id, client_id), eq(user.role, "client")))
    .returning({ id: user.id });

  return result.length > 0;
}