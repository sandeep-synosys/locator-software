import { baseLayout } from "./base-layout";

export type QuickMessageData = {
  name: string;
  email: string;
  message: string;
};

export function quickMessageTemplate(data: QuickMessageData) {
  return baseLayout({
    heading: "New Message",
    rows: [
      { label: "Name", value: data.name },
      { label: "Email", value: data.email },
      { label: "Message", value: data.message },
    ],
  });
}