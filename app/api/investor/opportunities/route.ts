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
    const opportunities = [
      {
        id: "deal-4",
        title: "FinTech Revolution Fund",
        description: "Investment opportunity in next-generation financial technology companies",
        bank_name: "Goldman Sachs",
        deal_value: "$15,000,000",
        status: "active",
        created_at: new Date().toISOString(),
        investor_count: 12,
        is_interested: false,
        sector: "FinTech",
        min_investment: "$25,000",
        target_close_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "deal-5",
        title: "Sustainable Agriculture Initiative",
        description: "Supporting sustainable farming practices and food security",
        bank_name: "Morgan Stanley",
        deal_value: "$8,500,000",
        status: "active", 
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        investor_count: 8,
        is_interested: false,
        sector: "Agriculture",
        min_investment: "$15,000",
        target_close_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "deal-6",
        title: "EV Infrastructure Expansion",
        description: "Electric vehicle charging network expansion across major cities",
        bank_name: "JPMorgan Chase",
        deal_value: "$25,000,000",
        status: "active",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        investor_count: 15,
        is_interested: true,
        sector: "Clean Energy",
        min_investment: "$50,000",
        target_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    return NextResponse.json(opportunities)
  } catch (error) {
    console.error("Error fetching investor opportunities:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}