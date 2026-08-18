// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const siteSettings=sqliteTable("site_settings",{id:integer("id").primaryKey(),data:text("data").notNull(),updatedAt:integer("updated_at").notNull()});
