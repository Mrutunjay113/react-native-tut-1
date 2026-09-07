import { createGroceryItem, listGroceryItems } from "@/lib/server/db-actions";

export async function GET() {
  try {
    const items = await listGroceryItems();
    return Response.json({ items });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch items";
    return Response.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, quantity, category, priority } = await request.json();
    if (!name || !category || !priority) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }
    const item = await createGroceryItem({
      name,
      quantity,
      category,
      priority,
    });
    return Response.json({ item });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create item";
    return Response.json({ message }, { status: 500 });
  }
}
