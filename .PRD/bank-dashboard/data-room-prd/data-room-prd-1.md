# PRD: Data Room Route (`/dashboard/bank/deal/[deal-id]/data-room`)

## Overview

The Data Room route provides a secure, collaborative workspace for organizing, reviewing, and completing required deal documents. It combines a **file system dashboard** for file management with an **AI-assisted chat agent** for contextual guidance, ensuring users always know what’s required, what’s missing, and what’s helpful for investors and advisors.

This is the **central hub** where clients, bankers, and investors interact with data room materials.

---

## Objectives

- Provide an intuitive **file management UI** similar to Finder (macOS) or Google Drive.
- Enable **real-time AI chat assistance** that can:
  - Highlight missing required documents.
  - Suggest helpful supporting files.
  - Answer user questions about structure, compliance, or investor expectations.
- Support **secure uploads, versioning, and sharing**.

---

## Core Features

### 1. File System Dashboard

- **File list/table view** with the following columns:
  - File name
  - File type/extension icon
  - File size
  - Last modified/uploaded
  - Uploaded by (avatar + name)
- **Breadcrumb navigation** at the top (e.g., `Root / Financials / 2025 / Q2`).
- **Folders + files hierarchy**.
- **Quick actions (3-dot menu)**:
  - Rename
  - Move
  - Share permissions
  - Delete
  - Version history
- **Upload drag-and-drop area** (top center of file panel).

---

### 2. AI Chat Assistant (Left Panel)

- Classic AI chat UI with:
  - Message bubbles (user right, AI left).
  - AI avatar = branded assistant icon.
  - Context-aware suggestions (chips/buttons below input).
  - File mentions in responses (e.g., “Missing: `Cap Table.xlsx`”).
- AI Use Cases:
  - “What documents are missing for investor readiness?”
  - “Summarize the uploaded financials.”
  - “List required compliance docs not yet uploaded.”
- Chat input with **slash commands**: `/missing`, `/summary`, `/recommend`.

---

### 3. Files Tracker (Right Sidebar)

- Persistent sidebar showing **status of file requirements**:
  - ✅ Uploaded & complete
  - ⚠️ Missing/required
  - 💡 Recommended/optional
- Filter & search by document category (e.g., _Financials, Legal, HR, Market_).
- Progress tracker at top (e.g., `65% Complete – 13/20 Required Files Uploaded`).
- Action buttons:
  - “Upload Now” (direct to category folder).
  - “Request from Client” (email/invite).

---

### 4. Look & Feel

- **Design language**: clean, minimal, soft shadows, rounded corners (2xl), white/neutral base with accent highlights.
- **Finder-like structure** for file hierarchy.
- **Chat panel** styled like modern AI chat apps (Notion AI, ChatGPT, Linear Copilot).
- **Sidebar tracker** like Google Drive’s "details panel," but re-imagined for completeness.

---

## User Flows

### Uploading Files

1. User drags files into upload area.
2. Progress bar shows % uploaded.
3. File appears in folder with timestamp and uploader attribution.
4. AI automatically updates tracker: “1 new financial statement uploaded. 3 more required for this section.”

### AI Guidance

1. User types `/missing`.
2. AI responds: “You are missing: `Cap Table.xlsx`, `Shareholder Agreements.pdf`.”
3. User clicks “Upload Now” → directed to the correct folder.

### Navigation

1. User clicks `Financials > 2025 > Q2` in breadcrumbs.
2. File list updates with scoped view.
3. AI chat context updates automatically to that folder (“This folder contains quarterly reports. Missing: `Audit Report.pdf`”).

---

## Technical Notes

- **Route**: `/dashboard/bank/deal/[deal-id]/data-room`
- **Components**:
  - `<ChatPanel />` (left)
  - `<FileDashboard />` (center)
  - `<FilesTracker />` (right)
- **Integration**:
  - Backend: Prisma + Postgres (files metadata + permissions).
  - Storage: S3-compatible (file uploads).
  - AI: Agent connected to document schema + upload status.

---

## KPIs

- % of required files uploaded.
- Average time to data room completion.
- User satisfaction with AI guidance (thumbs up/down).
