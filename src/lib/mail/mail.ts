import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { env } from "~/env";

interface SendMailParams {
  to: string;
  subject: string;
  body: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
  }>;
}

export const sendMail = async ({
  to,
  subject,
  body,
  attachments,
}: SendMailParams): Promise<SMTPTransport.SentMessageInfo> => {
  const transport = createTransport({
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

  return transport.sendMail({
    from: env.NEXT_PUBLIC_SMTP_EMAIL,
    to,
    subject,
    html: body,
    attachments,
  });
};
