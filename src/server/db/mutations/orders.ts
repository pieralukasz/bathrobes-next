import { db } from "..";
import { orders } from "../schema";

export async function createOrder(userId: string) {
  return await db.insert(orders).values({ userId }).returning();
}
