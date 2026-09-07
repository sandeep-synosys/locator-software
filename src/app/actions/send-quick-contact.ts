"use server";

import { sendMail } from "@/lib/email/send-mail";
import { quickMessageTemplate } from "@/lib/email/templates/quick-message";

export type QuickMessageFormState = {
  success: boolean;
  error?: string;
};

export async function sendQuickContact(
  _prevState: QuickMessageFormState,
  formData: FormData
): Promise<QuickMessageFormState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();

  if (!name || !email || !message || !phone) {
    return { success: false, error: "Name, email, phone and message are required." };
  }

  try {
    await sendMail({
      to: process.env.QUOTE_RECIPIENT_EMAIL!,
      replyTo: email,
      subject: `New message from ${name}`,
      html: quickMessageTemplate({ name, phone, email, message }),
    });
    return { success: true };
  } catch (err) {
    console.error("sendQuickMessage failed:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}