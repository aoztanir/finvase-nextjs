import { db } from "@/lib/db/client";
import { user, deal, investor, cim } from "@/lib/db/schema";
import { eq, count, sum, sql } from "drizzle-orm";

export async function get_bank_analytics(bank_id: string) {
  // Get total counts
  const [clientCount] = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.role, "client"));

  const [investorCount] = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.role, "investor"));

  const [dealCount] = await db
    .select({ count: count() })
    .from(deal)
    .where(eq(deal.bank_id, bank_id));

  const [cimCount] = await db
    .select({ count: count() })
    .from(cim)
    .leftJoin(deal, eq(cim.deal_id, deal.id))
    .where(eq(deal.bank_id, bank_id));

  // Get deal status breakdown
  const dealsByStatus = await db
    .select({
      status: deal.status,
      count: count(),
    })
    .from(deal)
    .where(eq(deal.bank_id, bank_id))
    .groupBy(deal.status);

  // Get recent activity (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentDeals = await db
    .select({ count: count() })
    .from(deal)
    .where(
      sql`${deal.bank_id} = ${bank_id} AND ${deal.created_at} >= ${thirtyDaysAgo}`
    );

  // Get total deal value (if numeric)
  const totalDealValue = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${deal.deal_value} AS NUMERIC)), 0)`,
    })
    .from(deal)
    .where(eq(deal.bank_id, bank_id));

  // Get investor participation by deal
  const investorParticipation = await db
    .select({
      deal_id: investor.deal_id,
      investor_count: count(),
      total_investment: sql<number>`COALESCE(SUM(CAST(${investor.investment_amount} AS NUMERIC)), 0)`,
    })
    .from(investor)
    .leftJoin(deal, eq(investor.deal_id, deal.id))
    .where(eq(deal.bank_id, bank_id))
    .groupBy(investor.deal_id);

  return {
    totals: {
      clients: clientCount.count,
      investors: investorCount.count,
      deals: dealCount.count,
      documents: cimCount.count,
    },
    dealsByStatus: dealsByStatus.reduce((acc, item) => {
      acc[item.status] = item.count;
      return acc;
    }, {} as Record<string, number>),
    recentActivity: {
      newDealsLast30Days: recentDeals[0]?.count || 0,
    },
    financials: {
      totalDealValue: totalDealValue[0]?.total || 0,
      investorParticipation,
    },
  };
}