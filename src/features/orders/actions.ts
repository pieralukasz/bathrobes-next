"use server";

import SMTPTransport from "nodemailer/lib/smtp-transport";
import { sendMail } from "~/lib/mail/mail";
import { getUser } from "~/lib/supabase/server";
import { orderQueries } from "~/server/db/queries";
import { generateOrderExcel } from "./excel";

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
          ${item.productSize.color.product.name} - ${item.productSize.color.color} - Size: ${item.productSize.size}
          <br/>
          Quantity: ${item.quantity}
        </li>
      `,
        )
        .join("")}
    </ul>
    
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
