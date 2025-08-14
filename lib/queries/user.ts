import { db } from "@/lib/db/client";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function get_user_by_id(user_id: string) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.id, user_id));
  
  return result[0] || null;
}

export async function get_user_by_email(email: string) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.email, email));
  
  return result[0] || null;
}