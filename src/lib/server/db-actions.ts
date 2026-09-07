import { desc, eq } from "drizzle-orm";
import { db } from "./db/client";
import { groceryItmes } from "./db/schema";

export const listGroceryItems = async () => {
  const rows = await db
    .select()
    .from(groceryItmes)
    .orderBy(desc(groceryItmes.updatedAt));
  return rows;
};

export const createGroceryItem = async (input: {
  name: string;
  category: string;
  quantity: number;
  priority: "low" | "medium" | "high";
}) => {
  const rows = await db
    .insert(groceryItmes)
    .values({
      id: crypto.randomUUID(),
      name: input.name,
      category: input.category,
      quantity: Math.max(1, input.quantity),
      purchased: false,
      priority: input.priority,
      updatedAt: Date.now(),
    })
    .returning();
  return rows[0] ?? null;
};

export const setGroceryItemPurchased = async (
  id: string,
  purchased: boolean,
) => {
  const rows = await db
    .update(groceryItmes)
    .set({
      purchased,
      updatedAt: Date.now(),
    })
    .where(eq(groceryItmes.id, id))
    .returning();

  if (!rows.length) return null;
  return rows[0];
};

export const updateGroceryItemQuantity = async (
  id: string,
  quantity: number,
) => {
  const rows = await db
    .update(groceryItmes)
    .set({
      quantity: Math.max(1, Math.floor(quantity)),
      updatedAt: Date.now(),
    })
    .where(eq(groceryItmes.id, id))
    .returning();

  if (!rows.length) return null;
  return rows[0];
};

export const deleteGroceryItem = async (id: string) => {
  await db.delete(groceryItmes).where(eq(groceryItmes.id, id));
};
export const clearPurchasedItems = async () => {
  await db.delete(groceryItmes).where(eq(groceryItmes.purchased, true));
};
