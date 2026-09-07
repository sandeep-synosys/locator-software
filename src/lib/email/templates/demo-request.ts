import { baseLayout } from "./base-layout";

export type DemoRequestData = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  vehicles?: string;
  message?: string;
  date: string;   // e.g. "2026-09-12"
  time: string;   // e.g. "10:30 AM"
  timezone: string;
};

export function demoRequestTemplate(data: DemoRequestData) {
  return baseLayout({
    heading: "New Demo Request",
    rows: [
      { label: "Name", value: data.name },
      { label: "Email", value: data.email },
      { label: "Phone", value: data.phone || "—" },
      { label: "Company", value: data.company || "—" },
      { label: "Vehicles", value: data.vehicles || "—" },
      { label: "Requested Slot", value: `${data.time} on ${data.date} (${data.timezone})` },
      { label: "Message", value: data.message || "—" },
    ],
  });
}