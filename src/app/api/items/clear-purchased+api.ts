import { clearPurchasedItems } from "@/lib/server/db-actions";

export async function POST(request: Request) {
  try {
    await clearPurchasedItems();
    return Response.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to clear purchased items";
    return Response.json({ message }, { status: 500 });
  }
}
