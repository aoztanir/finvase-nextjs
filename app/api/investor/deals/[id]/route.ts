import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dealId = params.id

    // Mock deal data
    const deal = {
      id: dealId,
      title: "TechCorp Series A",
      description: "Series A funding round for AI startup focused on machine learning applications in healthcare. The company has shown strong growth potential with innovative solutions.",
      bank_name: "Goldman Sachs",
      deal_value: "$2,000,000",
      status: "active",
      created_at: new Date().toISOString(),
      target_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      min_investment: "$10,000",
      max_investment: "$500,000",
      investor_count: 12,
      sector: "Healthcare Technology",
      location: "San Francisco, CA",
      is_interested: true,
      my_investment: {
        amount: "$50,000",
        status: "interested",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Interested in the healthcare AI applications"
      }
    }

    return NextResponse.json(deal)
  } catch (error) {
    console.error("Error fetching deal:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}