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
    const formattedStats = {
      total_deals: 4,
      active_deals: 2,
      total_deal_value: '$12,500,000',
      avg_completion: 75
    }

    return NextResponse.json(formattedStats)
  } catch (error) {
    console.error("Error fetching client stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}