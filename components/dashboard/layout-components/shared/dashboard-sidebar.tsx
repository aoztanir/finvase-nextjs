"use client"

import { useSession } from "next-auth/react"
import { BankSidebar } from "../bank/bank-sidebar"
import { ClientSidebar } from "../client/client-sidebar"
import { InvestorSidebar } from "../investor/investor-sidebar"

export function DashboardSidebar() {
  const { data: session } = useSession()

  if (!session?.user?.role) {
    return null
  }

  switch (session.user.role) {
    case "bank":
      return <BankSidebar />
    case "client":
      return <ClientSidebar />
    case "investor":
      return <InvestorSidebar />
    default:
      return null
  }
}