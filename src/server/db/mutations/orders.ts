import { db } from "..";
import { eq } from "drizzle-orm";
import { orderItems, orders } from "../schema";

// Create a new order
export async function createOrder(userId: string) {
  return await db.insert(orders).values({ userId }).returning();
}

// Add an item to an order
export async function addItemToOrder(orderId: number, productSizeId: number, quantity: number) {
  return await db.insert(orderItems).values({ orderId, productSizeId, quantity }).returning();
}

// Update the quantity of an item in an order
export async function updateOrderItem(orderItemId: number, quantity: number) {
  return await db.update(orderItems).set({ quantity }).where(eq(orderItems.id, orderItemId)).returning();
}

// Remove an item from an order
export async function removeItemFromOrder(orderItemId: number) {
  return await db.delete(orderItems).where(eq(orderItems.id, orderItemId));
}
