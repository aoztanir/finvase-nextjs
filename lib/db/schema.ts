import { pgTable, text, timestamp, uuid, pgEnum, boolean } from "drizzle-orm/pg-core";

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
  file_type: text('file_type'),
  uploaded_by: uuid('uploaded_by').notNull().references(() => user.id),
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