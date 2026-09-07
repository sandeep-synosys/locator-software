import { baseLayout } from "./base-layout";

export type QuoteRequestData = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  vehicles?: string;
  message?: string;
};

export function quoteRequestTemplate(data: QuoteRequestData) {
  return baseLayout({
    heading: "New Quote Request",
    rows: [
      { label: "Name", value: data.name },
      { label: "Email", value: data.email },
      { label: "Phone", value: data.phone || "—" },
      { label: "Company", value: data.company || "—" },
      { label: "Vehicles", value: data.vehicles || "—" },
      { label: "Message", value: data.message || "—" },
    ],
  });
}