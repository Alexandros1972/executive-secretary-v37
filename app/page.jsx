"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const inputClass =
  "w-full bg-white text-slate-900 border border-slate-300 rounded-2xl p-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

const folders = [
  "General",
  "VITO",
  "Waveco",
  "Clients",
  "Offers",
  "Payments",
  "Suppliers",
  "Meetings",
  "Personal",
  "Legal",
];

const emptyForm = {
  interaction_type: "Phone Call",
  topic_folder: "General",
  contact_name: "",
  contact_position: "",
  company_name: "",
  phone: "",
  email: "",
  whatsapp_number: "",
  topic: "",
  discussion_notes: "",
  agreed_actions: "",
  promised_by_us: "",
  pending_from_them: "",
  follow_up_date: "",
  follow_up_time: "",
  priority: "Medium",
};

export default function Home() {
  const [mode, setMode] = useState("home");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [searchFolder, setSearchFolder] = useState("All");

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    setItems(data || []);
  }

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function buildTitle(data) {
    return `${data.interaction_type}: ${data.contact_name || "Unknown"}${
      data.company_name ? " / " + data.company_name : ""
    }${data.topic ? " - " + data.topic : ""}`;
  }

  async function saveRecord() {
    setMessage("");

    const { error } = await supabase.from("tasks").insert([
      {
        title: buildTitle(form),
        interaction_type: form.interaction_type,
        topic_folder: form.topic_folder,
        contact_name: form.contact_name,
        contact_position: form.contact_position,
        company_name: form.company_name,
        phone: form.phone,
        email: form.email,
        whatsapp_number: form.whatsapp_number,
        topic: form.topic,
        discussion_notes: form.discussion_notes,
        agreed_actions: form.agreed_actions,
        promised_by_us: form.promised_by_us,
        pending_from_them: form.pending_from_them,
        follow_up_date: form.follow_up_date || null,
        follow_up_time: form.follow_up_time || null,
        priority: form.priority,
        status: "active",
      },
    ]);

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setMessage("Saved successfully.");
    setForm(emptyForm);
    await loadItems();
    setMode("home");
  }

  function markDone(id) {
    supabase
      .from("tasks")
      .update({ status: "completed" })
      .eq("id", id)
      .then(loadItems);
  }

  function reopen(id) {
    supabase
      .from("tasks")
      .update({ status: "active" })
      .eq("id", id)
      .then(loadItems);
  }

  function openCalendar(item) {
    const title = encodeURIComponent(
      `Follow-up: ${item.contact_name || item.company_name || "Client"}`
    );

    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}`,
      "_blank"
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  const active = items.filter((i) => i.status !== "completed");

  const overdue = active.filter(
    (i) => i.follow_up_date && i.follow_up_date < today
  );

  const todayItems = active.filter(
    (i) => i.follow_up_date === today
  );

  const searchResults = items.filter((item) => {
    const folderMatch =
      searchFolder === "All" ||
      item.topic_folder === searchFolder;

    const text = `
      ${item.contact_name || ""}
      ${item.company_name || ""}
      ${item.topic || ""}
      ${item.discussion_notes || ""}
      ${item.agreed_actions || ""}
      ${item.pending_from_them || ""}
      ${item.promised_by_us || ""}
      ${item.phone || ""}
      ${item.email || ""}
      ${item.topic_folder || ""}
    `.toLowerCase();

    return (
      folderMatch &&
      text.includes(query.toLowerCase())
    );
  });

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900 pb-28">
      <div className="max-w-md mx-auto min-h-screen px-6 py-6">

        <p className="text-xs text-blue-600 font-black tracking-widest uppercase">
          Executive Secretary
        </p>

        <h1 className="text-4xl font-black mt-2">
          {mode === "home" && "Daily Command Center"}
          {mode === "manual" && "Manual Intake"}
          {mode === "search" && "Client Memory"}
          {mode === "followups" && "Follow-ups"}
        </h1>

        <p className="text-slate-500 mt-3">
          Calls, reminders, meetings, pending items and customer memory.
        </p>

        {mode === "home" && (
          <section className="mt-8 space-y-5">

            <div className="rounded-[2rem] bg-[#071a33] text-white p-6 shadow-xl">
              <p className="text-blue-300 text-xs font-black uppercase tracking-widest">
                Morning Briefing
              </p>

              <h2 className="text-2xl font-black mt-4">
                {todayItems.length} follow-ups today
              </h2>

              <p className="text-blue-100 mt-3">
                {overdue.length} overdue follow-ups
              </p>

              <div className="grid grid-cols-2 gap-3 mt-5">

                <button
                  onClick={() => setMode("manual")}
                  className="bg-white text-[#071a33] rounded-2xl p-4 font-black"
                >
                  New Intake
                </button>

                <button
                  onClick={() => setMode("search")}
                  className="bg-blue-600 text-white rounded-2xl p-4 font-black"
                >
                  Search Memory
                </button>

              </div>
            </div>

            <SectionTitle
              title="Today's Follow-ups"
              count={todayItems.length}
            />

            <Cards
              items={todayItems}
              markDone={markDone}
              reopen={reopen}
              openCalendar={openCalendar}
            />

          </section>
        )}

        {mode === "manual" && (
          <section className="mt-8 bg-white rounded-[2rem] p-6 shadow-xl space-y-5">

            <Field label="Topic / Folder">
              <select
                className={inputClass}
                value={form.topic_folder}
                onChange={(e) =>
                  updateField("topic_folder", e.target.value)
                }
              >
                {folders.map((folder) => (
                  <option key={folder}>
                    {folder}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Type">
              <select
                className={inputClass}
                value={form.interaction_type}
                onChange={(e) =>
                  updateField(
                    "interaction_type",
                    e.target.value
                  )
                }
              >
                <option>Phone Call</option>
                <option>Meeting</option>
                <option>WhatsApp</option>
                <option>Email</option>
                <option>Presentation</option>
                <option>Reminder</option>
              </select>
            </Field>

            <Input
              label="Contact Name"
              value={form.contact_name}
              onChange={(v) =>
                updateField("contact_name", v)
              }
            />

            <Input
              label="Position"
              value={form.contact_position}
              onChange={(v) =>
                updateField("contact_position", v)
              }
            />

            <Input
              label="Company"
              value={form.company_name}
              onChange={(v) =>
                updateField("company_name", v)
              }
            />

            <Input
              label="Phone"
              value={form.phone}
              onChange={(v) =>
                updateField("phone", v)
              }
            />

            <Input
              label="Email"
              value={form.email}
              onChange={(v) =>
                updateField("email", v)
              }
            />

            <Input
              label="Topic"
              value={form.topic}
              onChange={(v) =>
                updateField("topic", v)
              }
            />

            <Textarea
              label="What was discussed?"
              value={form.discussion_notes}
              onChange={(v) =>
                updateField(
                  "discussion_notes",
                  v
                )
              }
            />

            <Textarea
              label="What was agreed?"
              value={form.agreed_actions}
              onChange={(v) =>
                updateField(
                  "agreed_actions",
                  v
                )
              }
            />

            <Textarea
              label="Pending from them"
              value={form.pending_from_them}
              onChange={(v) =>
                updateField(
                  "pending_from_them",
                  v
                )
              }
            />

            <Input
              label="Follow-up Date"
              type="date"
              value={form.follow_up_date}
              onChange={(v) =>
                updateField(
                  "follow_up_date",
                  v
                )
              }
            />

            <Input
              label="Follow-up Time"
              type="time"
              value={form.follow_up_time}
              onChange={(v) =>
                updateField(
                  "follow_up_time",
                  v
                )
              }
            />

            {message && (
              <div className="bg-blue-50 text-blue-700 rounded-2xl p-4 font-black">
                {message}
              </div>
            )}

            <button
              onClick={saveRecord}
              className="w-full bg-blue-600 text-white rounded-2xl p-4 font-black"
            >
              Save Intake
            </button>

          </section>
        )}

        {mode === "search" && (
          <section className="mt-8 space-y-5">

            <select
              className={inputClass}
              value={searchFolder}
              onChange={(e) =>
                setSearchFolder(e.target.value)
              }
            >
              <option>All</option>

              {folders.map((folder) => (
                <option key={folder}>
                  {folder}
                </option>
              ))}
            </select>

            <input
              className={inputClass}
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search client, company, notes, pending..."
            />

            <div className="bg-blue-50 text-blue-700 rounded-2xl p-4 font-black">
              {searchResults.length} records found
            </div>

            <Cards
              items={
                query
                  ? searchResults
                  : items
              }
              markDone={markDone}
              reopen={reopen}
              openCalendar={openCalendar}
            />

          </section>
        )}

        {mode === "followups" && (
          <section className="mt-8">

            <SectionTitle
              title="All Follow-ups"
              count={active.length}
            />

            <Cards
              items={active}
              markDone={markDone}
              reopen={reopen}
              openCalendar={openCalendar}
            />

          </section>
        )}

      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
        <div className="max-w-md mx-auto grid grid-cols-4 text-center py-3 text-xs">

          <Nav
            label="Home"
            icon="⌂"
            active={mode === "home"}
            onClick={() => setMode("home")}
          />

          <Nav
            label="Intake"
            icon="+"
            active={mode === "manual"}
            onClick={() => setMode("manual")}
          />

          <Nav
            label="Search"
            icon="🔎"
            active={mode === "search"}
            onClick={() => setMode("search")}
          />

          <Nav
            label="Tasks"
            icon="✅"
            active={mode === "followups"}
            onClick={() => setMode("followups")}
          />

        </div>
      </nav>

    </main>
  );
}

function Nav({
  label,
  icon,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "text-blue-600 font-black"
          : "text-slate-500"
      }
    >
      {icon}
      <br />
      {label}
    </button>
  );
}

function SectionTitle({
  title,
  count,
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-black">
        {title}
      </h2>

      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-black">
        {count}
      </span>
    </div>
  );
}

function Cards({
  items,
  markDone,
  reopen,
  openCalendar,
}) {
  if (!items.length) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow text-slate-500">
        Nothing found.
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {items.map((item) => {
        const done =
          item.status === "completed";

        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 shadow"
          >

            <div className="flex justify-between items-start gap-3">

              <div>
                <p className="text-xs text-blue-600 font-black uppercase">
                  {item.topic_folder || "General"}
                </p>

                <h3 className="font-black text-lg mt-1">
                  {item.contact_name ||
                    item.title}
                </h3>
              </div>

              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-black">
                {item.priority || "Medium"}
              </span>

            </div>

            <p className="text-slate-500 mt-1">
              {item.company_name ||
                item.topic ||
                ""}
            </p>

            {item.discussion_notes && (
              <p className="mt-3 text-slate-700">
                <strong>Discussed:</strong>{" "}
                {item.discussion_notes}
              </p>
            )}

            {item.agreed_actions && (
              <p className="mt-3 text-slate-700">
                <strong>Agreed:</strong>{" "}
                {item.agreed_actions}
              </p>
            )}

            {item.pending_from_them && (
              <p className="mt-3 text-slate-700">
                <strong>Pending:</strong>{" "}
                {item.pending_from_them}
              </p>
            )}

            {item.follow_up_date && (
              <p className="mt-3 bg-blue-50 text-blue-700 rounded-xl p-3 font-black">
                Follow-up:{" "}
                {item.follow_up_date}{" "}
                {item.follow_up_time || ""}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4">

              <button
                onClick={() =>
                  openCalendar(item)
                }
                className="bg-[#071a33] text-white rounded-2xl p-3 font-black"
              >
                Calendar
              </button>

              <button
                onClick={() =>
                  done
                    ? reopen(item.id)
                    : markDone(item.id)
                }
                className={`rounded-2xl p-3 font-black ${
                  done
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {done ? "Reopen" : "Done"}
              </button>

            </div>

          </div>
        );
      })}

    </div>
  );
}

function Field({
  label,
  children,
}) {
  return (
    <div>
      <label className="block font-black text-slate-700 mb-2">
        {label}
      </label>

      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <Field label={label}>
      <input
        className={inputClass}
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </Field>
  );
}

function Textarea({
  label,
  value,
  onChange,
}) {
  return (
    <Field label={label}>
      <textarea
        className={`${inputClass} min-h-28`}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </Field>
  );
}
