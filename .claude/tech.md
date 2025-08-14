# **Finvase – Tech Stack & Development Guidelines (Next.js + NextAuth)**

---

## **Package Management**

- **PNPM** is the package manager for the project.
- **Use `pnpx`** for most CLI tasks.
- **Exception:** When using `drizzle-kit` CLI and Drizzle commands, **use `npx`** instead.

---

## **Frontend**

- **Framework:** [Next.js 14+ (App Router)](https://nextjs.org/docs)
- **Styling:** [TailwindCSS](https://tailwindcss.com/) for utility-first styling
- You should **not** modify anything in `/components/shadcn`.
- Make sure to use a clean UI that mimics a minimal kind of look without adding much crazy styles or colors. Think about Stripe as a reference, try to mimic their UI styling with the minimality that they use.
- **Components:** [shadcn/ui](https://ui.shadcn.com/) components (kept in `/components/shadcn`)
  - **Do not modify** anything in `/components/shadcn`.
  - Build additional custom components in `/components/<feature>` folders.
- **Icons:** Use inline **SVG paths**, not icon libraries.
- **State/Data Fetching:** [TanStack Query](https://tanstack.com/query/latest) for server data fetching & caching.
- **Animations & UX:** Keep UI modern, professional, and smooth.
- **Preventing Layout Nesting** use the parenthesis `()` to prevent layout nesting in the frontend through the filebased routing in Next.js.

---

## **Backend**

### **Core Stack**

- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) with Postgres
- **API Routes:** [Next.js API Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) in `/app/api/**`
- **Auth:** [NextAuth.js](https://next-auth.js.org/) with Drizzle adapter (Postgres-backed sessions)
- **Data Fetching:** TanStack Query → `/app/api/...` → Drizzle query layer

---

### **Database Rules**

- Use **UUID** as the default primary key type unless a different type makes more sense.
- All schema files live in `/lib/db/schema.ts`.
- Create database using **TypeScript + drizzle-kit**.
- DB connection handled in `/lib/db/client.ts`.
- **Table names:** Singular & snake case (e.g., `user`, `deal`, `cim`).

---

### **Backend Structure**

src/
lib/
auth/
next-auth.ts ← nextauth config & helpers
db/
schema.ts ← drizzle schema definitions
client.ts ← db connection
queries/ ← drizzle query functions, split by domain
deal.ts
user.ts
cim.ts
app/
api/ ← next.js api routes
auth/
[...nextauth]/route.ts
deal/
route.ts
[id]/route.ts
user/
route.ts
file/
route.ts
cim/
route.ts

pgsql
Copy
Edit

---

### **API & Query Guidelines**

- **Do not** put raw `db.select()` calls in API route handlers.
- Always create **query functions** in `/lib/queries` and import them in `route.ts`.

#### Example

```ts
// lib/queries/deal.ts
import { db } from "@/lib/db/client";
import { deal } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function get_all_deals() {
  return await db.select().from(deal).orderBy(desc(deal.created_at));
}
ts
Copy
Edit
// app/api/deal/route.ts
import { NextResponse } from "next/server";
import { get_all_deals } from "@/lib/queries/deal";
import { get_server_session } from "next-auth";
import { auth_options } from "@/lib/auth/next-auth";

export async function GET(req: Request) {
  const session = await get_server_session(auth_options);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "bank") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json(await get_all_deals());
}
NextAuth Integration
Stored in /lib/auth/next-auth.ts

Uses Postgres + Drizzle adapter

user table contains role field: "bank" | "client" | "investor"

Protect API routes by validating session inside API route handler:

ts
Copy
Edit
const session = await get_server_session(auth_options);
if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
if (session.user.role !== "bank") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
Route Security & Role Checks
Role	Accessible Routes
Bank	/dashboard/bank/**
Client	/dashboard/client/**
Investor	/dashboard/investor/**

All /api/** routes serving dashboard data must check:

Session validity

User role authorization

Data Fetching Flow
Frontend uses TanStack Query → fetch('/api/...')

API route validates session via NextAuth

API route calls Drizzle query function in /lib/queries

Query function hits Postgres and returns JSON

TanStack Query caches the result

This ensures:

Frontend stays clean & declarative

Backend has separation of concerns (Auth → Query → API)

Security is consistent across all routes

yaml
Copy
Edit

---

If you want, I can now **add a dashboard-to-API mapping** that lists **each dashboard page**, the **API route**, and the **Drizzle query function** so your devs have a 1:1 reference for building. That would make this doc *fully actionable*.

Do you want me to add that next?
```
