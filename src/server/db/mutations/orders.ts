import { db } from "..";
import { eq } from "drizzle-orm";
import { orderItems, orders } from "../schema";

export async function createOrder(userId: string) {
  return await db.insert(orders).values({ userId }).returning();
}
