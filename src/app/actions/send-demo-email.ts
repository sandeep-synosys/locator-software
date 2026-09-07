"use server";

import { sendMail } from "@/lib/email/send-mail";
import { demoRequestTemplate } from "@/lib/email/templates/demo-request";

export type DemoFormState = {
  success: boolean;
  error?: string;
  bookedDate?: string;
  bookedTime?: string;
};

export async function sendDemoEmail(
  _prevState: DemoFormState,
  formData: FormData
): Promise<DemoFormState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const date = formData.get("date")?.toString().trim();
  const time = formData.get("time")?.toString().trim();

  if (!name || !email) {
    return { success: false, error: "Name and email are required." };
  }
  if (!date || !time) {
    return { success: false, error: "Please pick a date and time first." };
  }

  try {
    await sendMail({
      to: process.env.QUOTE_RECIPIENT_EMAIL!,
      replyTo: email,
      subject: `New demo request from ${name}`,
      html: demoRequestTemplate({
        name,
        email,
        phone: formData.get("phone")?.toString(),
        company: formData.get("company")?.toString(),
        vehicles: formData.get("vehicles")?.toString(),
        message: formData.get("message")?.toString(),
        date,
        time,
        timezone: formData.get("timezone")?.toString() || "GMT+04:00",
      }),
    });
    return { success: true, bookedDate: date, bookedTime: time };
  } catch (err) {
    console.error("sendDemoEmail failed:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}