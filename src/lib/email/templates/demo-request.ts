import { baseLayout } from "./base-layout";

export type DemoRequestData = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  preferredDate?: string;
  notes?: string;
};

export function demoRequestTemplate(data: DemoRequestData) {
  return baseLayout({
    heading: "New Demo Request",
    rows: [
      { label: "Name", value: data.name },
      { label: "Email", value: data.email },
      { label: "Phone", value: data.phone || "—" },
      { label: "Company", value: data.company || "—" },
      { label: "Preferred Date", value: data.preferredDate || "—" },
      { label: "Notes", value: data.notes || "—" },
    ],
  });
}