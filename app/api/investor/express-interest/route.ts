import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { deal_id, investment_amount, notes } = body

    if (!deal_id || !investment_amount) {
      return NextResponse.json(
        { error: "Deal ID and investment amount are required" },
        { status: 400 }
      )
    }

    // Mock successful response for now
    return NextResponse.json({ 
      message: "Interest expressed successfully",
      investment: {
        id: Math.random().toString(36).substr(2, 9),
        investment_amount: investment_amount,
        status: 'interested',
        created_at: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error("Error expressing interest:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}