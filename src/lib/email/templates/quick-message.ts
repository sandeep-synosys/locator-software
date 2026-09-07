import { baseLayout } from "./base-layout";

export type QuickMessageData = {
  name: string;
  phone?: string;
  email: string;
  message: string;
};

export function quickMessageTemplate(data: QuickMessageData) {
  return baseLayout({
    heading: "New Quick Contact",
    rows: [
      { label: "Name", value: data.name },
      { label: "Phone", value: data.phone || "_" },
      { label: "Email", value: data.email },
      { label: "Message", value: data.message },
    ],
  });
}