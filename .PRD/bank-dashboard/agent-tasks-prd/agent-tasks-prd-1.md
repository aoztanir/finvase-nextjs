# PRD: Agent Tasks (`/dashboard/bank/deal/[deal_id]/agent-tasks`)

## Overview

The Agent Tasks route centralizes management of AI-driven and user-assigned tasks within a specific deal. It provides a **multi-view workspace** (Kanban, Timeline, List, Table) where bankers can track workflows, manage deadlines, assign responsibilities, and receive AI-powered task suggestions.

The UI should closely mirror modern project management tools (e.g., Linear, Notion Projects, Asana), but adapted to the bank’s deal workflow. All tasks live under a deal context (`deal_id`).

---

## Objectives

- Provide **Kanban board and alternative views** for flexible task management.
- Enable **AI-driven task creation and guidance** across the deal lifecycle.
- Support **collaboration and accountability** with assignments, comments, and progress tracking.
- Allow seamless navigation between tasks, deal-specific workflows, and the broader dashboard.
- Support **light mode and dark mode** for user preference.

---

## Core Features

### 1. Task Dashboard (Main Route)

- Route: `/dashboard/bank/deal/[deal_id]/agent-tasks`
- Views available via tabs:
  - **Board (Kanban)**: Columns → In Queue, On Progress, Blocked, Complete.
  - **Timeline (Gantt-style)**: Calendar visualization of tasks.
  - **List**: Table rows with filters, categories, and search.
  - **Table**: Spreadsheet-like, with editable inline cells.
- Global filters: by assignee, priority, due date, category.
- Toggle: light mode / dark mode.

---

### 2. Task Card

- Fields visible:
  - Title
  - Priority (Low / Normal / High / Urgent, with colored tags)
  - Due date
  - Assignees (avatars)
  - Status (column-driven)
  - Progress bar for subtasks
- Quick actions: comment count, attachments, open details.

---

### 3. Task Details Sheet

- Route: `/dashboard/bank/deal/[deal_id]/agent-tasks/[taskId]`
- Opens as a **sliding sheet/drawer** (light + dark mode).
- Sections:
  - **Header**: Title, status, label, priority, due date, assignees, created by.
  - **Tabs**: Description | Comments | Activities.
  - **Subtasks**: Checklist with progress.
  - **AI Suggestions panel** (contextual): _“Suggested next steps for this task.”_
  - **Attachments**: Inline previews (PDFs, images, spreadsheets).
- Actions: mark complete, reassign, edit, delete.

---

### 4. AI Task Suggestions

- Route: `/dashboard/bank/deal/[deal_id]/agent-tasks/ai-suggestions`
- Features:
  - Tasks generated from deal state (missing docs, modeling steps, investor Q&A).
  - Mark as **Accept → adds to backlog**, or **Dismiss**.
  - Categorization: Required | Recommended | Optional.
- Example:
  - _“Upload audited financials for FY2023.”_
  - _“Draft market overview for pitch deck.”_

---

### 5. Task Assignment

- Route: `/dashboard/bank/deal/[deal_id]/agent-tasks/assign`
- Features:
  - Assign to teammates, clients, or AI agent.
  - Set due date + priority.
  - Notifications sent to assignees.

---

### 6. Task History / Audit

- Route: `/dashboard/bank/deal/[deal_id]/agent-tasks/history`
- Timeline view of completed and archived tasks.
- Filters: by date range, assignee, category.
- Export options: CSV, PDF.
- Integrity: tamper-proof logs for compliance.

---

## Look & Feel

- **Board view**: modern Kanban (see screenshot reference).
- **Light + dark mode**: switchable in user settings.
- **Sheets/drawers** for task details instead of modals.
- **Minimal, rounded design** with accent highlights.
- **Animations**: smooth drag-and-drop on Kanban, progress bar transitions.

---

## User Flows

### AI Task Creation

1. AI detects missing compliance doc.
2. Suggests task in `ai-suggestions`.
3. Banker accepts → task appears in Kanban "In Queue".

### Task Assignment

1. Banker selects task.
2. Opens detail sheet.
3. Assigns teammates + sets due date.
4. Task moves to "On Progress" when accepted.

### Task Completion

1. Assignee marks subtask checklist complete.
2. Parent task progress updates.
3. Full task moved to "Complete".
4. Archived in Task History.

---

## Technical Notes

- **Routes**:
  - `/dashboard/bank/deal/[deal_id]/agent-tasks` (main views)
  - `/dashboard/bank/deal/[deal_id]/agent-tasks/[taskId]` (task details)
  - `/dashboard/bank/deal/[deal_id]/agent-tasks/ai-suggestions`
  - `/dashboard/bank/deal/[deal_id]/agent-tasks/assign`
  - `/dashboard/bank/deal/[deal_id]/agent-tasks/history`
- **Components**:
  - `<TaskBoard />` (Kanban)
  - `<TaskTimeline />` (Gantt/timeline view)
  - `<TaskList />`
  - `<TaskTable />`
  - `<TaskSheet />` (sliding drawer for details)
  - `<TaskSuggestions />`
  - `<TaskHistory />`
- **Backend**:
  - Prisma + Postgres for tasks (relations: `deal_id`, `user_id`).
  - Event-driven updates for real-time sync.
- **Theming**: Tailwind + design tokens for light/dark.

---

## KPIs

- AI-suggested tasks accepted vs dismissed.
- % of tasks completed by deadline.
- Avg. task completion time per deal.
- Engagement: # of comments per task.
