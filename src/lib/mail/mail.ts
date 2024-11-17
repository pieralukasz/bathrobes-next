import nodemailer from "nodemailer";
import { env } from "~/env";

export async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const transport = nodemailer.createTransport({
    host: "mail.gmx.com",
    port: 465,
    secure: true,
    auth: {
      user: env.NEXT_PUBLIC_SMTP_EMAIL,
      pass: env.NEXT_PUBLIC_SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  await transport.verify();

  const sendResult = await transport.sendMail({
    from: env.NEXT_PUBLIC_SMTP_EMAIL,
    to,
    subject,
    html: body,
  });

  return sendResult;
}
