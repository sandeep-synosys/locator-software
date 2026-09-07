"use client";

import { DemoFormState, sendDemoEmail } from "@/app/actions/send-demo-email";
import { useActionState, useEffect, useMemo, useState } from "react";

const EASE = "cubic-bezier(.22,.61,.36,1)";

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKDAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const WEEKDAYS_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];

const FIELDS = [
  {
    name: "name",
    label: "Full name",
    type: "text",
    required: true,
    half: true,
    placeholder: "Full name",
  },
  {
    name: "email",
    label: "Email address",
    type: "email",
    required: true,
    half: true,
    placeholder: "Email address",
  },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    required: false,
    half: true,
    placeholder: "Phone number",
  },
  {
    name: "company",
    label: "Company",
    type: "text",
    required: false,
    half: true,
    placeholder: "Company",
  },
  {
    name: "vehicles",
    label: "Number of vehicles",
    type: "text",
    required: false,
    half: false,
    placeholder: "Number of vehicles",
  },
] as const;

const TRUST = [
  {
    title: "30–45 min demo",
    sub: "Personalized to your needs",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: "No obligation",
    sub: "Just expert guidance",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="17" rx="2.5" />
        <path d="M3 9h18M8 2v4M16 2v4" />
      </svg>
    ),
  },
  {
    title: "Secure & private",
    sub: "Your data is protected",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Expert support",
    sub: "We’re here to help",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <rect x="2.5" y="13" width="4" height="6" rx="1.5" />
        <rect x="17.5" y="13" width="4" height="6" rx="1.5" />
        <path d="M20 19a4 4 0 0 1-4 3h-2" />
      </svg>
    ),
  },
];

type Cell = { day: number; inMonth: boolean; date: Date };

function buildGrid(year: number, month: number): Cell[] {
  const startDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells: Cell[] = [];
  for (let i = startDow - 1; i >= 0; i--)
    cells.push({
      day: prevDays - i,
      inMonth: false,
      date: new Date(year, month - 1, prevDays - i),
    });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, inMonth: true, date: new Date(year, month, d) });
  let next = 1;
  while (cells.length < 42) {
    cells.push({
      day: next,
      inMonth: false,
      date: new Date(year, month + 1, next),
    });
    next++;
  }
  return cells;
}

function buildSlots(
  startHour: number,
  endHour: number,
  stepMin: number
): string[] {
  const out: string[] = [];
  for (let m = startHour * 60; m <= endHour * 60; m += stepMin) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const ampm = h >= 12 ? "PM" : "AM";
    const hh = ((h + 11) % 12) + 1;
    out.push(`${hh}:${String(min).padStart(2, "0")} ${ampm}`);
  }
  return out;
}

const SLOTS = buildSlots(9, 17, 30);

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const keyOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const longLabel = (d: Date) =>
  `${WEEKDAYS_LONG[d.getDay()]}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

export default function DemoBooking() {
  const [today, setToday] = useState<Date | null>(null);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [windowStart, setWindowStart] = useState<Date | null>(null);
  const [slot, setSlot] = useState<{ key: string; time: string } | null>(null);
  const [confirmed, setConfirmed] = useState<{
    date: string;
    time: string;
  } | null>(null);

  const initialState: DemoFormState = { success: false };
  const [state, formAction, isPending] = useActionState(
    sendDemoEmail,
    initialState
  );
  const [showSuccess, setShowSuccess] = useState(false);

  console.log({ showSuccess, state });

  useEffect(() => {
    if (state.success) setShowSuccess(true);
  }, [state]);

  useEffect(() => {
    const t = startOfDay(new Date());
    setToday(t);
    setView({ y: t.getFullYear(), m: t.getMonth() });
    setWindowStart(t);
  }, []);

  const grid = useMemo(() => (view ? buildGrid(view.y, view.m) : []), [view]);

  const atCurrentMonth =
    today && view
      ? view.y === today.getFullYear() && view.m === today.getMonth()
      : true;
  const atFirstDay = today && windowStart ? sameDay(windowStart, today) : true;

  const selectDay = (d: Date) => {
    setWindowStart(d);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };

  const goMonth = (delta: number) => {
    setView((v) => {
      if (!v) return v;
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  const days = windowStart ? [windowStart, addDays(windowStart, 1)] : [];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!slot) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      company: String(fd.get("company") || ""),
      vehicles: String(fd.get("vehicles") || ""),
      message: String(fd.get("message") || ""),
      date: slot.key,
      time: slot.time,
      timezone: "GMT+04:00",
    };
    setConfirmed({
      date: longLabel(new Date(`${payload.date}T00:00:00`)),
      time: payload.time,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="db-sec">
      <style>{`
        .db-sec { padding: clamp(16px,2.4vw,32px) 28px clamp(40px,5vw,64px); background: #fff; }
        .db-shell { max-width: var(--w-1180); margin: 0 auto; }
        .db-grid { display: grid; grid-template-columns: .82fr 1.18fr; gap: clamp(18px,2.2vw,28px); align-items: stretch; }
        @media (max-width: 1040px) { .db-grid { grid-template-columns: 1fr; } }

        .db-card { background: #fff; border: 1px solid #e7ebf3; border-radius: 22px; box-shadow: 0 30px 60px -38px rgba(20,40,90,.22); }

        .db-form-card { padding: clamp(22px,2.6vw,36px); }
        .db-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: var(--f-11); font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #1360ee; margin-bottom: 12px; }
        .db-eyebrow span { width: 22px; height: 2px; background: #1360ee; border-radius: 2px; }
        .db-title { margin: 0 0 6px; font-size: max(clamp(20px,2.3vw,27px), min(1.875vw, 39.15px)); font-weight: 800; letter-spacing: -.025em; color: #1d1d1f; }
        .db-sub { margin: 0 0 22px; font-size: var(--f-14); line-height: 1.6; color: #6e6e73; }

        .db-fgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .db-fgrid { grid-template-columns: 1fr; } }
        .db-field { display: flex; flex-direction: column; gap: 6px; }
        .db-field.full { grid-column: 1 / -1; }
        .db-label { font-size: var(--f-12); font-weight: 700; color: #52525e; }
        .db-label b { color: #e5484d; }
        .db-input, .db-textarea {
          font-family: inherit; font-size: var(--f-14); color: #1d1d1f; width: 100%;
          padding: 13px 15px; border-radius: 11px; border: 1.5px solid #e4e8f0; background: #fbfcfe;
          transition: border-color .18s ${EASE}, box-shadow .18s ${EASE}, background .18s ${EASE};
        }
        .db-input::placeholder, .db-textarea::placeholder { color: #aab0bd; }
        .db-input:focus, .db-textarea:focus { outline: none; border-color: #1360ee; background: #fff; box-shadow: 0 0 0 4px rgba(19,96,238,.12); }
        .db-textarea { resize: vertical; min-height: 92px; }

        .db-pick-hint { margin: 16px 0 0; font-size: var(--f-12-5); color: #8a92a3; display: flex; align-items: center; gap: 7px; }
        .db-pick-hint b { color: #1360ee; font-weight: 700; }

        .db-submit {
          margin-top: 16px; width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 16px 24px; border-radius: 12px; border: none; cursor: pointer;
          font-family: inherit; font-size: var(--f-15); font-weight: 700; color: #fff;
          background: #1360ee; box-shadow: 0 12px 26px -10px rgba(19,96,238,.6); transition: .18s ${EASE};
        }
        .db-submit:hover:not(:disabled) { background: #0d4fd4; transform: translateY(-1px); box-shadow: 0 16px 32px -10px rgba(19,96,238,.7); }
        .db-submit:disabled { background: #c3cede; cursor: not-allowed; box-shadow: none; }
        .db-submit svg { transition: transform .2s ${EASE}; }
        .db-submit:hover:not(:disabled) svg { transform: translateX(4px); }
        .db-safe { display: flex; align-items: center; justify-content: center; gap: 7px; margin: 14px 0 0; font-size: var(--f-12); color: #8a92a3; }
        .db-safe svg { color: #1360ee; }

        .db-success { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; min-height: 460px; }
        .db-check { width: 64px; height: 64px; border-radius: 50%; margin-bottom: 22px; background: rgba(19,146,63,.1); color: #13923f; display: grid; place-items: center; animation: dbPop .5s ${EASE} both; }
        @keyframes dbPop { 0% { transform: scale(.5); opacity: 0 } 60% { transform: scale(1.1) } 100% { transform: scale(1); opacity: 1 } }
        .db-confirm { margin: 8px 0 20px; padding: 14px 16px; border-radius: 12px; background: #f2f7ff; border: 1px solid #dbe6ff; font-size: var(--f-13-5); line-height: 1.6; color: #1d1d1f; }
        .db-confirm b { color: #1360ee; }

        .db-sched-card { padding: clamp(20px,2.4vw,30px); display: flex; flex-direction: column; }
        .db-sched-head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 18px; }
        .db-sched-ico { flex-shrink: 0; width: 40px; height: 40px; border-radius: 11px; background: #eaf1ff; color: #1360ee; display: grid; place-items: center; }
        .db-sched-ico svg { width: 20px; height: 20px; }
        .db-sched-h { margin: 0; font-size: max(clamp(16px,1.8vw,20px), min(1.389vw, 29px)); font-weight: 800; letter-spacing: -.02em; color: #1d1d1f; }
        .db-sched-p { margin: 3px 0 0; font-size: var(--f-13); color: #6e6e73; }

        .db-picker { border: 1px solid #eaedf4; border-radius: 16px; padding: clamp(16px,2vw,22px); background: linear-gradient(180deg, #ffffff, #fbfcff); display: grid; grid-template-columns: minmax(230px,280px) 1fr; gap: clamp(16px,2.2vw,28px); }
        @media (max-width: 720px) { .db-picker { grid-template-columns: 1fr; } }
        .db-cal-skel { grid-column: 1 / -1; min-height: 260px; display: grid; place-items: center; color: #a0a6b4; font-size: var(--f-13); }

        .db-cal-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .db-cal-month { font-size: var(--f-15); font-weight: 800; color: #1d1d1f; }
        .db-cal-navs { display: flex; gap: 6px; }
        .db-nav { width: 30px; height: 30px; border-radius: 8px; border: 1px solid #e4e8f0; background: #fff; color: #52525e; display: grid; place-items: center; cursor: pointer; transition: .16s ${EASE}; }
        .db-nav:hover:not(:disabled) { border-color: #1360ee; color: #1360ee; }
        .db-nav:disabled { opacity: .38; cursor: not-allowed; }

        .db-dow { display: grid; grid-template-columns: repeat(7,1fr); gap: 2px; margin-bottom: 6px; }
        .db-dow span { text-align: center; font-size: var(--f-11); font-weight: 700; color: #a0a6b4; padding: 4px 0; }
        .db-days { display: grid; grid-template-columns: repeat(7,1fr); gap: 4px; }
        .db-day {
          aspect-ratio: 1; border: none; background: transparent; border-radius: 999px; cursor: pointer;
          font-family: inherit; font-size: var(--f-13); font-weight: 600; color: #1d1d1f;
          display: grid; place-items: center; transition: background .15s ${EASE}, color .15s ${EASE}, transform .15s ${EASE};
        }
        .db-day.muted { color: #c4c9d4; cursor: default; }
        .db-day.past { color: #c4c9d4; cursor: not-allowed; }
        .db-day.avail { background: #eef4ff; color: #1360ee; }
        .db-day.avail:hover { background: #dbe7ff; transform: translateY(-1px); }
        .db-day.selected { background: #1360ee; color: #fff; box-shadow: 0 8px 18px -6px rgba(19,96,238,.6); }
        .db-legend { display: flex; align-items: center; gap: 8px; margin-top: 14px; font-size: var(--f-12); color: #8a92a3; }
        .db-legend i { width: 12px; height: 12px; border-radius: 50%; background: #eef4ff; box-shadow: inset 0 0 0 1px #cfe0ff; }

        .db-times { display: flex; flex-direction: column; min-width: 0; }
        .db-tz { margin: 0 0 12px; font-size: var(--f-12); color: #8a92a3; text-align: right; }
        @media (max-width: 720px) { .db-tz { text-align: left; } }
        .db-daynav { position: relative; padding: 0 36px; margin-bottom: 12px; }
        .db-daynav .db-nav { position: absolute; top: 50%; transform: translateY(-50%); }
        .db-daynav .prev { left: 0; }
        .db-daynav .next { right: 0; }
        .db-dayheads { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .db-dayhead { text-align: center; }
        .db-dayhead-wd { font-size: var(--f-11); font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #8a92a3; }
        .db-dayhead-d { font-size: var(--f-20); font-weight: 800; color: #1d1d1f; line-height: 1.2; }

        .db-slots-wrap { padding: 0 36px; max-height: 340px; overflow-y: auto; }
        .db-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .db-col { display: flex; flex-direction: column; gap: 8px; }
        .db-slot {
          padding: 11px 8px; border-radius: 999px; border: 1.5px solid #e4e8f0; background: #fff; cursor: pointer;
          font-family: inherit; font-size: var(--f-13); font-weight: 700; color: #1360ee; text-align: center;
          transition: .15s ${EASE};
        }
        .db-slot:hover { border-color: #9fbdf6; background: #f5f9ff; }
        .db-slot.active { background: #1360ee; border-color: #1360ee; color: #fff; box-shadow: 0 10px 20px -8px rgba(19,96,238,.55); }

        .db-trust {
          max-width: var(--w-1180); margin: clamp(18px,2.2vw,26px) auto 0;
          border: 1px solid #e7ebf3; border-radius: 18px; background: #fff;
          display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; padding: clamp(16px,2vw,22px) clamp(14px,2vw,24px);
        }
        @media (max-width: 780px) { .db-trust { grid-template-columns: repeat(2,1fr); gap: 18px; } }
        @media (max-width: 420px) { .db-trust { grid-template-columns: 1fr; } }
        .db-trust-item { display: flex; align-items: center; gap: 12px; }
        .db-trust-ico { flex-shrink: 0; width: 38px; height: 38px; border-radius: 10px; background: #eaf1ff; color: #1360ee; display: grid; place-items: center; }
        .db-trust-ico svg { width: 19px; height: 19px; }
        .db-trust-t { margin: 0; font-size: var(--f-13-5); font-weight: 800; color: #1d1d1f; line-height: 1.2; }
        .db-trust-s { margin: 2px 0 0; font-size: var(--f-12); color: #6e6e73; }
        .db-submit:disabled {
        cursor: not-allowed;
        }
        .db-spinner {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2.5px solid rgba(255,255,255,.35);
          border-top-color: #fff;
          animation: dbSpin 0.7s linear infinite;
        }
        @keyframes dbSpin {
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) { .db-check { animation: none; } }
      `}</style>

      <div className="db-shell">
        <div className="db-grid">
          <div className="db-card db-form-card">
            {showSuccess ? (
              <div className="db-success">
                <div className="db-check">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h2 className="db-title">Your demo is booked</h2>
                {confirmed && (
                  <div className="db-confirm">
                    We’ve reserved <b>{confirmed.time}</b> on{" "}
                    <b>{confirmed.date}</b>. Our team will email you a
                    confirmation and calendar invite shortly.
                  </div>
                )}
                <button
                  className="db-submit"
                  style={{ width: "auto", marginTop: 0 }}
                  onClick={() => {
                    setShowSuccess(false);
                    setSlot(null);
                  }}
                >
                  Book another
                </button>
              </div>
            ) : (
              <>
                <span className="db-eyebrow">
                  <span />
                  Request a free demo
                </span>
                <h2 className="db-title">Tell us about your fleet</h2>
                <p className="db-sub">
                  Share a few details and we’ll schedule a demo tailored to your
                  operation.
                </p>

                <form action={formAction}>
                  <div className="db-fgrid">
                    {FIELDS.map((f) => (
                      <div
                        key={f.name}
                        className={`db-field${f.half ? "" : " full"}`}
                      >
                        <label className="db-label" htmlFor={`db-${f.name}`}>
                          {f.label}
                          {f.required && <b> *</b>}
                        </label>
                        <input
                          id={`db-${f.name}`}
                          className="db-input"
                          type={f.type}
                          name={f.name}
                          required={f.required}
                          placeholder={f.placeholder}
                        />
                      </div>
                    ))}
                    <div className="db-field full">
                      <label className="db-label" htmlFor="db-message">
                        Message{" "}
                        <span style={{ color: "#aab0bd", fontWeight: 600 }}>
                          (optional)
                        </span>
                      </label>
                      <textarea
                        id="db-message"
                        className="db-textarea"
                        name="message"
                        placeholder="Anything specific we should know?"
                      />
                    </div>
                    <input type="hidden" name="date" value={slot?.key ?? ""} />
                    <input type="hidden" name="time" value={slot?.time ?? ""} />
                    <input type="hidden" name="timezone" value="GMT+04:00" />
                  </div>

                  <p className="db-pick-hint">
                    {slot ? (
                      <>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#1360ee"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        Selected <b>{slot.time}</b> on{" "}
                        <b>{longLabel(new Date(`${slot.key}T00:00:00`))}</b>
                      </>
                    ) : (
                      <>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 8v4l2.5 1.5" />
                        </svg>
                        Pick a date and time from the scheduler
                      </>
                    )}
                  </p>

                  <button
                    type="submit"
                    className="db-submit"
                    disabled={!slot || isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="db-spinner" aria-hidden="true" />
                        Booking…
                      </>
                    ) : (
                      <>
                        Get a Free Demo
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </>
                    )}
                  </button>
                  <p className="db-safe">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
                    </svg>
                    Your information is safe with us.
                  </p>
                </form>
              </>
            )}
          </div>

          <div className="db-card db-sched-card">
            <div className="db-sched-head">
              <span className="db-sched-ico">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="17" rx="2.5" />
                  <path d="M3 9h18M8 2v4M16 2v4" />
                </svg>
              </span>
              <div>
                <h2 className="db-sched-h">Schedule your demo</h2>
                <p className="db-sched-p">
                  Select a date and time that works for you.
                </p>
              </div>
            </div>

            <div className="db-picker">
              {!view || !today || !windowStart ? (
                <div className="db-cal-skel">Loading calendar…</div>
              ) : (
                <>
                  <div>
                    <div className="db-cal-top">
                      <span className="db-cal-month">
                        {MONTHS_LONG[view.m]} {view.y}
                      </span>
                      <div className="db-cal-navs">
                        <button
                          type="button"
                          className="db-nav"
                          onClick={() => goMonth(-1)}
                          disabled={atCurrentMonth}
                          aria-label="Previous month"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m15 6-6 6 6 6" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="db-nav"
                          onClick={() => goMonth(1)}
                          aria-label="Next month"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m9 6 6 6-6 6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="db-dow">
                      {DOW.map((d, i) => (
                        <span key={i}>{d}</span>
                      ))}
                    </div>
                    <div className="db-days">
                      {grid.map((c, i) => {
                        const past = c.date < today;
                        const avail = c.inMonth && !past;
                        const isSel = sameDay(c.date, windowStart);
                        const cls = [
                          "db-day",
                          !c.inMonth ? "muted" : "",
                          c.inMonth && past ? "past" : "",
                          avail && !isSel ? "avail" : "",
                          isSel ? "selected" : "",
                        ]
                          .filter(Boolean)
                          .join(" ");
                        return (
                          <button
                            key={i}
                            type="button"
                            className={cls}
                            disabled={!avail}
                            onClick={() => avail && selectDay(c.date)}
                          >
                            {c.day}
                          </button>
                        );
                      })}
                    </div>
                    <div className="db-legend">
                      <i />
                      Available dates
                    </div>
                  </div>

                  <div className="db-times">
                    <p className="db-tz">(GMT+04:00) Gulf Standard Time</p>
                    <div className="db-daynav">
                      <button
                        type="button"
                        className="db-nav prev"
                        onClick={() => selectDay(addDays(windowStart, -1))}
                        disabled={atFirstDay}
                        aria-label="Previous day"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m15 6-6 6 6 6" />
                        </svg>
                      </button>
                      <div className="db-dayheads">
                        {days.map((d) => (
                          <div className="db-dayhead" key={keyOf(d)}>
                            <div className="db-dayhead-wd">
                              {WEEKDAYS_SHORT[d.getDay()]}
                            </div>
                            <div className="db-dayhead-d">{d.getDate()}</div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="db-nav next"
                        onClick={() => selectDay(addDays(windowStart, 1))}
                        aria-label="Next day"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 6 6 6-6 6" />
                        </svg>
                      </button>
                    </div>
                    <div className="db-slots-wrap">
                      <div className="db-cols">
                        {days.map((d) => {
                          const k = keyOf(d);
                          return (
                            <div className="db-col" key={k}>
                              {SLOTS.map((t) => {
                                const active =
                                  slot && slot.key === k && slot.time === t;
                                return (
                                  <button
                                    key={t}
                                    type="button"
                                    className={`db-slot${active ? " active" : ""}`}
                                    onClick={() => setSlot({ key: k, time: t })}
                                  >
                                    {t}
                                  </button>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="db-trust">
          {TRUST.map((t) => (
            <div key={t.title} className="db-trust-item">
              <span className="db-trust-ico">{t.icon}</span>
              <div>
                <p className="db-trust-t">{t.title}</p>
                <p className="db-trust-s">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
