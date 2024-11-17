"use server";

import { sendMail } from "~/lib/mail/mail";
import { getUser } from "~/lib/supabase/server";

export const sendOrder = async () => {
  const user = await getUser();

  if (!user.email) {
    throw new Error("User email not found");
  }

  await sendMail({
    to: user.email,
    name: "Vahid",
    subject: "Test Mail",
    body: "<h1>Test Mail</h1>",
  });
};
