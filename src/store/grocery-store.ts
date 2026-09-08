import { create } from "zustand";

export enum GroceryCategory {
  Produce = "Produce",
  Dairy = "Dairy",
  Pantry = "Pantry",
  Bakery = "Bakery",
  Snacks = "Snacks",
}

export enum GroceryPriority {
  low = "low",
  medium = "medium",
  high = "high",
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  category: GroceryCategory;
  priority: GroceryPriority;
  purchased: boolean;
}

interface CreateItemInput {
  name: string;
  quantity: number;
  category: GroceryCategory;
  priority: GroceryPriority;
}

interface ItemsResponse {
  items: GroceryItem[];
}
interface ItemResponse {
  item: GroceryItem;
}

interface GroceryStore {
  items: GroceryItem[];
  isLoading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  addItem: (input: CreateItemInput) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  togglePurchased: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearPurchased: () => Promise<void>;
}

export const useGroceryStore = create<GroceryStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  loadItems: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch("/api/items");
      const payload = (await res.json()) as ItemsResponse;
      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
      }
      set({ items: payload.items });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load items",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  addItem: async (input: CreateItemInput) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch("/api/items", {
        method: "POST",
        body: JSON.stringify({
          name: input.name,
          quantity: Math.max(1, input.quantity || 1),
          category: input.category,
          priority: input.priority,
        }),
      });
      const payload = (await res.json()) as ItemResponse;
      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
      }
      set((state) => ({ items: [payload.item, ...state.items] }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add item",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  updateQuantity: async (id: string, quantity: number) => {
    const nextQuantity = Math.max(1, quantity || 1);
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity: nextQuantity }),
      });
      const payload = (await res.json()) as ItemResponse;
      if (!res.ok) {
        throw new Error(`Response status: ${res.status}`);
      }
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? payload.item : item,
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update quantity",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  togglePurchased: async (id) => {
    const currentItem = get().items.find((item) => item.id === id);
    if (!currentItem) return;

    const nextPurchased = !currentItem.purchased;
    set({ error: null });
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchased: nextPurchased }),
      });

      const payload = (await res.json()) as ItemResponse;
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? payload.item : item,
        ),
      }));
    } catch (error) {
      console.error("Error toggling purchased:", error);
      set({ error: "Something went wrong" });
    }
  },

  removeItem: async (id) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
    } catch (error) {
      console.error("Error removing item:", error);
      set({ error: "Something went wrong" });
    }
  },

  clearPurchased: async () => {
    set({ error: null });
    try {
      const res = await fetch("/api/items/clear-purchased", { method: "POST" });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const items = get().items.filter((item) => !item.purchased);
      set({ items });
    } catch (error) {
      console.error("Error clearing purchased:", error);
      set({ error: "Something went wrong" });
    }
  },
}));