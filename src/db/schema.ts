import {
  pgTable,
  uuid,
  text,
  timestamp
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/* ================= USERS ================= */

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow()
})

/* ================= PROJECTS ================= */

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subdomain: text('subdomain').notNull().unique(),
  productName: text('product_name').notNull(),
  headline: text('headline').notNull(),
  description: text('description').notNull(),
  theme: text('theme').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

/* ================= WAITLIST ================= */

export const waitlistSignups = pgTable('waitlist_signups', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

/* ================ Generations ================= */
export const generations = pgTable('generations', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  prompt: text('prompt').notNull(),
  response: text('response').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

/* ================= RELATIONS ================= */

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects)
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id]
  }),
  waitlist: many(waitlistSignups)
}))

export const waitlistRelations = relations(waitlistSignups, ({ one }) => ({
  project: one(projects, {
    fields: [waitlistSignups.projectId],
    references: [projects.id]
  })
}))

export const generationsRelations = relations(generations, ({ one }) => ({
  project: one(projects, {
    fields: [generations.projectId],
    references: [projects.id]
  })
}))
