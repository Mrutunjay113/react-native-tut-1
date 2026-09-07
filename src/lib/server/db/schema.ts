import { bigint, boolean, integer, pgTable, text } from "drizzle-orm/pg-core";

export const groceryItmes = pgTable("grocery_items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull(),
  purchased: boolean("purchased").notNull().default(false),
  priority: text("priority").notNull().default("medium"),
  updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
});
