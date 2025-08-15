import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return mock data for now
    const investments = [
      {
        id: "1",
        deal_title: "TechCorp Series A",
        deal_id: "deal-1",
        investment_amount: "$50,000",
        status: "committed",
        created_at: new Date().toISOString(),
        deal_value: "$2,000,000",
        deal_status: "active",
        deal_description: "Series A funding round for AI startup",
        bank_name: "Goldman Sachs",
      },
      {
        id: "2", 
        deal_title: "GreenEnergy Expansion",
        deal_id: "deal-2",
        investment_amount: "$100,000",
        status: "interested",
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        deal_value: "$5,000,000",
        deal_status: "active",
        deal_description: "Renewable energy infrastructure project",
        bank_name: "Morgan Stanley",
      },
      {
        id: "3",
        deal_title: "HealthTech Merger",
        deal_id: "deal-3", 
        investment_amount: "$100,000",
        status: "committed",
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        deal_value: "$10,000,000",
        deal_status: "closed",
        deal_description: "Strategic merger in healthcare technology",
        bank_name: "JPMorgan Chase",
      }
    ]

    return NextResponse.json(investments)
  } catch (error) {
    console.error("Error fetching investor investments:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}