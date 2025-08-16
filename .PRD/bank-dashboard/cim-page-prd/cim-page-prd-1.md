# PRD: CIM Management (`/dashboard/bank/deals/[deal_id]/cim-management`)

## Overview

The **CIM Management route** enables banks to generate, edit, and manage **Confidential Investment Materials (CIMs)** such as teasers, pitch decks, financial models, and market research reports.  
This is the **core differentiator** of the platform, designed to replace analysts’ manual CIM creation with AI-assisted workflows while maintaining full human oversight and compliance.

---

## Objectives

- Allow banks to **generate CIMs from scratch** using AI agents.
- Support **uploading/editing existing CIMs** (e.g., PPT, XLS, DOC).
- Provide **full version history** with rollback capabilities.
- Enable **collaborative iteration** with inline AI chat editing.
- Serve as a **standalone feature** (usable outside full deal workflows).

---

## User Personas

- **Investment Bank Analysts**: quickly generate first drafts of CIMs.
- **Associates/VPs**: review, edit, and finalize CIM deliverables.
- **MDs/Partners**: view polished CIM outputs for client/investor distribution.

---

## Layout

### Left Half → CIM Generator & AI Editor

- **Input Card**:
  - File upload (pptx, xlsx, docx, pdf).
  - Folder upload (bulk materials for AI context).
  - Text editor input (for scratch CIM prompts).
  - Tabs at top for **CIM Types**:
    - Teaser
    - Pitch Deck
    - Financial Model
    - Market Research Report
    - Custom
- **Controls**:

  - Dropdowns for tone (conservative / aggressive / neutral).
  - Style presets (bank-branded templates).
  - Checkboxes for compliance inclusions (disclaimers, disclosures).
  - Start/Generate button.

- **CIM Generation Flow**:

  1. User uploads or selects generation type.
  2. Clicks "Generate".
  3. AI progress displayed in a **sheet on the right** (real-time updates).
  4. Once complete, CIM appears in versioned list.

- **Inline Chat Editor**:
  - After generation, bottom section of sheet shows AI chat.
  - Users can request modifications (e.g., _"shorten executive summary"_, _"add peer comps to valuation section"_).
  - Changes applied in real-time.
  - All edits stored in **version history**.

---

### Right Half → CIM Library

- **List of all CIMs** (generated + uploaded).
- Each CIM card/row shows:

  - Title
  - Type (teaser, pitch deck, etc.)
  - Created by (user/AI)
  - Created date
  - Last updated
  - Version count
  - Status (Draft, Final, Archived)

- **Interactions**:

  - Click → open in **sheet/drawer** with details & inline editor.
  - Download as original format (pptx, xlsx, pdf).
  - Delete/archive CIMs.
  - Compare versions (diff viewer).

- **Version History**:
  - Each CIM has expandable version history.
  - Metadata per version: who edited, when, summary of changes.
  - Rollback option.

---

## Routes

- `/dashboard/bank/deals/[deal_id]/cim-management` (main CIM workspace)
- `/dashboard/bank/deals/[deal_id]/cim-management/[cim_id]` (specific CIM sheet/drawer)
- `/dashboard/bank/deals/[deal_id]/cim-management/history/[cim_id]` (version history view)

---

## User Flows

### Generate a CIM from Scratch

1. User selects “Pitch Deck” tab.
2. Uploads financial model + market data.
3. Chooses tone/style.
4. Clicks **Generate**.
5. AI creates pitch deck, progress shown in right sheet.
6. CIM saved in library with “Draft” status.
7. User refines with inline AI chat → version history updated.

### Upload + Edit Existing CIM

1. User uploads old pitch deck.
2. AI parses content and displays in editor sheet.
3. User requests: _“Update valuation with FY23 numbers.”_
4. AI modifies slides accordingly, saves new version.

### Version Management

1. User clicks CIM in library.
2. Expands version history.
3. Previews v3 vs v7 changes.
4. Rolls back to v5.

---

## Technical Notes

- **Frontend**:
  - React (Next.js) + Tailwind.
  - Split-pane layout (drag-resizable).
  - ShadCN sheets/drawers for CIM details.
- **Backend**:
  - File storage (S3 or GCS).
  - PostgreSQL for CIM metadata + version history.
  - AI pipeline: OpenAI GPT + fine-tuned financial templates.
- **Formats Supported**: pptx, xlsx, docx, pdf.
- **Compliance**:
  - All CIM versions logged immutably.
  - Exported CIMs must embed compliance disclaimers.

---

## KPIs

- Time saved per CIM vs analyst baseline.
- % of CIMs generated fully by AI vs uploaded/edited.
- Avg. number of AI edit iterations per CIM.
- Adoption: # of CIMs per deal created via platform.
- Quality feedback (analyst survey ratings).

---
