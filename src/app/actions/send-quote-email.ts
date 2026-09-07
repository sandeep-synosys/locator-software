"use server";

import { sendMail } from "@/lib/email/send-mail";
import { quoteRequestTemplate } from "@/lib/email/templates/quote-request";

export type QuoteFormState = {
  success: boolean;
  error?: string;
};

export async function sendQuoteEmail(
  _prevState: QuoteFormState,
  formData: FormData
): Promise<QuoteFormState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();

  if (!name || !email) {
    return { success: false, error: "Name and email are required." };
  }

  try {
    await sendMail({
      to: process.env.QUOTE_RECIPIENT_EMAIL!,
      replyTo: email,
      subject: `New quote request from ${name}`,
      html: quoteRequestTemplate({
        name,
        email,
        phone: formData.get("phone")?.toString(),
        company: formData.get("company")?.toString(),
        vehicles: formData.get("vehicles")?.toString(),
        message: formData.get("message")?.toString(),
      }),
    });
    return { success: true };
  } catch (err) {
    console.error("sendQuoteEmail failed:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}