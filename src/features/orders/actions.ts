"use server";

import SMTPTransport from "nodemailer/lib/smtp-transport";
import { sendMail } from "~/lib/mail/mail";
import { getUser } from "~/lib/supabase/server";
import { orderQueries } from "~/server/db/queries";
import { generateOrderExcel } from "./excel";
import { actionClient } from "~/lib/safe-action";
import { getCart } from "../cart/actions";
import { orderMutations } from "~/server/db/mutations";
import { getUser as getUserSupabase } from "~/lib/supabase/server";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "~/lib/constants";
import { createOrderSchema } from "./schema";

const formatOrderDetails = async (orderId: number, userId: string) => {
  const order = await orderQueries.getOrderByIdAndUserId(orderId, userId);

  if (!order) {
    throw new Error("Order not found");
  }

  return `
    <h1>Order #${order.id} Confirmation</h1>
    <p>Thank you for your order!</p>
    <ul>
      ${order.items
        .map(
          (item) => `
        <li>
          ${item.productSize.color.product.name} / ${item.productSize.color.color} / ${item.productSize.size} / ${item.quantity}
        </li>
      `,
        )
        .join("")}
    </ul>
    ${order.note ? `<p>Note: ${order.note}</p>` : ""}
    <p>If you have any questions, please contact our support team.</p>
  `;
};

export const sendOrder = async (
  orderId: number,
): Promise<SMTPTransport.SentMessageInfo> => {
  const user = await getUser();

  if (!user?.email) {
    throw new Error("User email not found");
  }

  const order = await orderQueries.getOrderByIdAndUserId(orderId, user.id);
  if (!order) {
    throw new Error("Order not found");
  }

  const emailBody = await formatOrderDetails(orderId, user.id);
  const excelBuffer = await generateOrderExcel(order);

  const dataResult = await sendMail({
    to: user.email,
    subject: `L&L Bathrobe #${orderId}`,
    body: emailBody,
    attachments: [
      {
        filename: `order-${orderId}.xlsx`,
        content: excelBuffer,
      },
    ],
  });

  if (!dataResult) {
    throw new Error("Failed to send email");
  }

  return dataResult;
};

export const checkoutAction = actionClient
  .schema(createOrderSchema)
  .action(async ({ parsedInput: { note } }) => {
    try {
      const user = await getUserSupabase();
      if (!user) throw new Error("Not authenticated");

      const cart = await getCart(user.id);

      if (!cart || cart.items.length === 0) {
        return { error: "Cannot create order with empty basket" };
      }

      const order = await orderMutations.create(user.id, note);

      if (!order) {
        return { error: "Failed to create order" };
      }

      let emailSent = true;
      try {
        await sendOrder(order.id);
      } catch (mailError) {
        console.error("Failed to send order email:", mailError);
        emailSent = false;
      }

      revalidateTag(CACHE_TAGS.cart);
      revalidateTag(CACHE_TAGS.orders);

      return {
        success: true,
        orderId: order.id,
        emailSent,
      };
    } catch (e: any) {
      console.error("Checkout error:", e);
      return { error: e.message || "Error checking out" };
    }
  });
