import { createTransport, TransportOptions, SentMessageInfo } from "nodemailer";
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
}: SendMailParams): Promise<SentMessageInfo> => {
  const transport = createTransport({
    host: env.NEXT_PUBLIC_SMTP_HOST || "smtp.gmail.com",
    port: env.NEXT_PUBLIC_SMTP_PORT,
    secure: true,
    auth: {
      user: env.NEXT_PUBLIC_SMTP_EMAIL,
      pass: env.NEXT_PUBLIC_SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  } as TransportOptions);

  await transport.verify();

  return transport.sendMail({
    from: env.NEXT_PUBLIC_SMTP_EMAIL,
    to,
    subject,
    html: body,
    attachments,
  });
};
