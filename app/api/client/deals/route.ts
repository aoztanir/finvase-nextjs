import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Return mock data for now
    const deals = [
      {
        id: "client-deal-1",
        title: "Acquisition of TechStart Inc.",
        description: "Strategic acquisition to expand our AI capabilities",
        status: "active",
        deal_value: "$5,000,000",
        created_at: new Date().toISOString(),
        bank_name: "Goldman Sachs",
        completion_percentage: 65,
        investor_count: 8,
        documents_count: 12,
        recent_activity: "Due diligence documents uploaded"
      },
      {
        id: "client-deal-2", 
        title: "Series B Funding Round",
        description: "Raising capital for international expansion",
        status: "pending",
        deal_value: "$3,500,000",
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        bank_name: "Morgan Stanley",
        completion_percentage: 30,
        investor_count: 5,
        documents_count: 8,
        recent_activity: "Investor presentations scheduled"
      },
      {
        id: "client-deal-3",
        title: "IPO Preparation",
        description: "Preparing for initial public offering",
        status: "draft",
        deal_value: "$50,000,000",
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        bank_name: "JPMorgan Chase", 
        completion_percentage: 15,
        investor_count: 0,
        documents_count: 3,
        recent_activity: "Initial documentation review"
      },
      {
        id: "client-deal-4",
        title: "Merger with CompetitorCorp",
        description: "Strategic merger to consolidate market position",
        status: "closed",
        deal_value: "$4,000,000",
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        bank_name: "Deutsche Bank",
        completion_percentage: 100,
        investor_count: 12,
        documents_count: 25,
        recent_activity: "Deal successfully closed"
      }
    ];
    
    return NextResponse.json(deals);
  } catch (error) {
    console.error("Error fetching client deals:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
