import { pgTable, text, timestamp, uuid, pgEnum, boolean, integer } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum('user_role', ['bank', 'client', 'investor']);

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: userRoleEnum('role').notNull(),
  password: text('password').notNull(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const account = pgTable('account', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: timestamp('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

export const session = pgTable('session', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionToken: text('session_token').notNull().unique(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

export const verificationToken = pgTable('verification_token', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull(),
});

export const deal = pgTable('deal', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  bank_id: uuid('bank_id').notNull().references(() => user.id),
  client_id: uuid('client_id').references(() => user.id),
  deal_value: text('deal_value'),
  status: text('status').notNull().default('draft'), // draft, active, pending, closed
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const dealEventStatusEnum = pgEnum('deal_event_status', ['completed', 'in-progress', 'pending', 'action-required']);

export const dealEvent = pgTable('deal_event', {
  id: uuid('id').defaultRandom().primaryKey(),
  deal_id: uuid('deal_id').notNull().references(() => deal.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: dealEventStatusEnum('status').notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const document = pgTable('document', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  deal_id: uuid('deal_id').notNull().references(() => deal.id, { onDelete: 'cascade' }),
  parent_id: uuid('parent_id').references(() => document.id),
  file_path: text('file_path'),
  file_type: text('file_type').notNull().default('file'), // 'file' or 'folder'
  file_size: integer('file_size'), // Size in bytes
  mime_type: text('mime_type'),
  uploaded_by: uuid('uploaded_by').notNull().references(() => user.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const documentRequirementStatusEnum = pgEnum('document_requirement_status', ['uploaded', 'missing', 'recommended']);

export const documentRequirement = pgTable('document_requirement', {
  id: uuid('id').defaultRandom().primaryKey(),
  deal_id: uuid('deal_id').notNull().references(() => deal.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(), // 'Financials', 'Legal', 'HR', 'Market'
  status: documentRequirementStatusEnum('status').notNull().default('missing'),
  is_required: boolean('is_required').notNull().default(true), // true for required, false for recommended
  uploaded_document_id: uuid('uploaded_document_id').references(() => document.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const cim = pgTable('cim', {
  id: uuid('id').defaultRandom().primaryKey(),
  deal_id: uuid('deal_id').notNull().references(() => deal.id),
  title: text('title').notNull(),
  file_url: text('file_url'),
  file_size: text('file_size'),
  uploaded_by: uuid('uploaded_by').notNull().references(() => user.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const investor = pgTable('investor', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => user.id),
  deal_id: uuid('deal_id').notNull().references(() => deal.id),
  investment_amount: text('investment_amount'),
  status: text('status').notNull().default('interested'), // interested, committed, declined
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const taskStatusEnum = pgEnum('task_status', ['in_queue', 'on_progress', 'blocked', 'complete']);
export const taskPriorityEnum = pgEnum('task_priority', ['low', 'normal', 'high', 'urgent']);
export const taskCategoryEnum = pgEnum('task_category', ['required', 'recommended', 'optional']);

export const task = pgTable('task', {
  id: uuid('id').defaultRandom().primaryKey(),
  deal_id: uuid('deal_id').notNull().references(() => deal.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: taskStatusEnum('status').notNull().default('in_queue'),
  priority: taskPriorityEnum('priority').notNull().default('normal'),
  category: taskCategoryEnum('category').notNull().default('required'),
  assignee_id: uuid('assignee_id').references(() => user.id),
  created_by: uuid('created_by').notNull().references(() => user.id),
  due_date: timestamp('due_date'),
  completed_at: timestamp('completed_at'),
  is_ai_generated: boolean('is_ai_generated').notNull().default(false),
  progress_percentage: integer('progress_percentage').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const subtask = pgTable('subtask', {
  id: uuid('id').defaultRandom().primaryKey(),
  task_id: uuid('task_id').notNull().references(() => task.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  is_completed: boolean('is_completed').notNull().default(false),
  completed_at: timestamp('completed_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const taskComment = pgTable('task_comment', {
  id: uuid('id').defaultRandom().primaryKey(),
  task_id: uuid('task_id').notNull().references(() => task.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id').notNull().references(() => user.id),
  content: text('content').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const taskActivity = pgTable('task_activity', {
  id: uuid('id').defaultRandom().primaryKey(),
  task_id: uuid('task_id').notNull().references(() => task.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id').notNull().references(() => user.id),
  action: text('action').notNull(), // created, updated, assigned, completed, commented, etc.
  description: text('description').notNull(),
  metadata: text('metadata'), // JSON string for additional data
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const taskAttachment = pgTable('task_attachment', {
  id: uuid('id').defaultRandom().primaryKey(),
  task_id: uuid('task_id').notNull().references(() => task.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  file_path: text('file_path').notNull(),
  file_size: integer('file_size'),
  mime_type: text('mime_type'),
  uploaded_by: uuid('uploaded_by').notNull().references(() => user.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const aiTaskSuggestion = pgTable('ai_task_suggestion', {
  id: uuid('id').defaultRandom().primaryKey(),
  deal_id: uuid('deal_id').notNull().references(() => deal.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  priority: taskPriorityEnum('priority').notNull().default('normal'),
  category: taskCategoryEnum('category').notNull().default('recommended'),
  is_accepted: boolean('is_accepted').notNull().default(false),
  is_dismissed: boolean('is_dismissed').notNull().default(false),
  accepted_at: timestamp('accepted_at'),
  dismissed_at: timestamp('dismissed_at'),
  suggested_assignee_id: uuid('suggested_assignee_id').references(() => user.id),
  created_task_id: uuid('created_task_id').references(() => task.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
});