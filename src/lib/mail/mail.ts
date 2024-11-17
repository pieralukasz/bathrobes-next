import nodemailer from "nodemailer";
import { env } from "~/env";

export async function sendMail({
  to,
  name,
  subject,
  body,
}: {
  to: string;
  name: string;
  subject: string;
  body: string;
}) {
  const transport = nodemailer.createTransport({
    service: "mail.gmx.com",
    auth: {
      user: env.NEXT_PUBLIC_SMTP_EMAIL,
      pass: env.NEXT_PUBLIC_SMTP_PASSWORD,
    },
  });
  try {
    const testResult = await transport.verify();
    console.log(testResult);
  } catch (error) {
    console.error({ error });
    return;
  }

  try {
    const sendResult = await transport.sendMail({
      from: env.NEXT_PUBLIC_SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
    console.log(sendResult);
  } catch (error) {
    console.log(error);
  }
}
