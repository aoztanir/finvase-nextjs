import { db } from "./client";
import { documentRequirement } from "./schema";

const DEFAULT_REQUIREMENTS = [
  // Financials
  { name: "Annual Financial Statements (3 years)", category: "Financials", description: "Last 3 years of audited financial statements", is_required: true },
  { name: "Monthly Financial Reports (12 months)", category: "Financials", description: "Monthly P&L and cash flow statements", is_required: true },
  { name: "Cap Table", category: "Financials", description: "Current capitalization table with all equity holders", is_required: true },
  { name: "Budget & Projections", category: "Financials", description: "3-5 year financial projections", is_required: true },
  { name: "Audit Reports", category: "Financials", description: "External audit reports if available", is_required: false },
  
  // Legal
  { name: "Articles of Incorporation", category: "Legal", description: "Certificate of incorporation and amendments", is_required: true },
  { name: "Shareholder Agreements", category: "Legal", description: "All current shareholder agreements", is_required: true },
  { name: "Board Resolutions", category: "Legal", description: "Key board resolutions and meeting minutes", is_required: true },
  { name: "Material Contracts", category: "Legal", description: "Key customer, supplier, and partnership agreements", is_required: false },
  
  // HR
  { name: "Organizational Chart", category: "HR", description: "Current organizational structure", is_required: true },
  { name: "Key Employee Contracts", category: "HR", description: "Employment agreements for senior management", is_required: true },
  { name: "Stock Option Plans", category: "HR", description: "Employee equity compensation plans", is_required: false },
  
  // Market
  { name: "Market Research", category: "Market", description: "Industry analysis and competitive landscape", is_required: false },
  { name: "Customer References", category: "Market", description: "Case studies and customer testimonials", is_required: false },
];

export async function seed_deal_requirements(deal_id: string) {
  const requirements = DEFAULT_REQUIREMENTS.map(req => ({
    ...req,
    deal_id,
    status: 'missing' as const,
  }));

  return await db
    .insert(documentRequirement)
    .values(requirements)
    .returning();
}