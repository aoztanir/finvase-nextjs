import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { seed_deal_requirements } from "@/lib/db/seed-requirements";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "bank") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deal_id = params.id;
    const requirements = await seed_deal_requirements(deal_id);

    return NextResponse.json({ 
      message: "Requirements seeded successfully",
      count: requirements.length,
      requirements
    });
  } catch (error) {
    console.error("Error seeding requirements:", error);
    return NextResponse.json(
      { error: "Failed to seed requirements" },
      { status: 500 }
    );
  }
}