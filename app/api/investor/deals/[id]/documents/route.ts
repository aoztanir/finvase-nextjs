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

    // Mock documents data
    const documents = [
      {
        id: "doc-1",
        name: "Executive Summary.pdf",
        file_type: "PDF",
        created_at: new Date().toISOString(),
        file_size: "2.5 MB"
      },
      {
        id: "doc-2", 
        name: "Financial Projections.xlsx",
        file_type: "Excel",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        file_size: "1.8 MB"
      },
      {
        id: "doc-3",
        name: "Term Sheet.pdf", 
        file_type: "PDF",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        file_size: "890 KB"
      },
      {
        id: "doc-4",
        name: "Due Diligence Report.pdf",
        file_type: "PDF", 
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        file_size: "4.2 MB"
      }
    ]

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}