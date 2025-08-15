import { db } from "@/lib/db/client";
import { user, deal, investor, cim } from "@/lib/db/schema";
import { eq, count, sum, sql, gte, and } from "drizzle-orm";

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
      and(
        eq(deal.bank_id, bank_id),
        gte(deal.created_at, thirtyDaysAgo)
      )
    );

  // Get total deal value (if numeric)
  const totalDealValue = await db
    .select({
      total: sql<number>`COALESCE(SUM(CASE 
        WHEN ${deal.deal_value} IS NULL OR ${deal.deal_value} = '' THEN 0 
        ELSE CAST(REGEXP_REPLACE(${deal.deal_value}, '[^0-9.]', '', 'g') AS NUMERIC) 
      END), 0)`,
    })
    .from(deal)
    .where(eq(deal.bank_id, bank_id));

  // Get investor participation by deal
  const investorParticipation = await db
    .select({
      deal_id: investor.deal_id,
      investor_count: count(),
      total_investment: sql<number>`COALESCE(SUM(CASE 
        WHEN ${investor.investment_amount} IS NULL OR ${investor.investment_amount} = '' THEN 0 
        ELSE CAST(REGEXP_REPLACE(${investor.investment_amount}, '[^0-9.]', '', 'g') AS NUMERIC) 
      END), 0)`,
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