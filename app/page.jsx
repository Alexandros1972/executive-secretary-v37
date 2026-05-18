"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const inputClass =
  "w-full bg-white text-slate-900 border border-slate-300 rounded-2xl p-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

const emptyForm = {
  interaction_type: "Phone Call",
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
  const [mode, setMode] = useState("manual");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    loadItems();

    if (typeof window !== "undefined") {
      const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  async function loadItems() {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    setItems(data || []);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function getWarmFemaleVoice() {
    const preferred = [
      "Microsoft Jenny",
      "Microsoft Aria",
      "Google US English",
      "Google UK English Female",
      "Samantha",
      "Karen",
      "Moira",
      "Tessa",
    ];

    return (
      voices.find((v) =>
        preferred.some((name) =>
          v.name.toLowerCase().includes(name.toLowerCase())
        )
      ) ||
      voices.find((v) => v.lang?.startsWith("en")) ||
      null
    );
  }

  function speakWarm(text) {
    if (typeof window === "undefined") return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getWarmFemaleVoice();

    if (voice) utterance.voice = voice;

    utterance.lang = "en-US";
    utterance.rate = 0.82;
    utterance.pitch = 1.08;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }

  function buildTitle(data) {
    return `${data.interaction_type}: ${data.contact_name || "Unknown"}${
      data.company_name ? " / " + data.company_name : ""
    }`;
  }

  function buildWhatsappMessage(data) {
    return `Hello ${
      data.contact_name || ""
    }, following our discussion about ${
      data.topic || "the matter we discussed"
    }, I wanted to check if there is any update from your side.`;
  }

  async function saveRecord() {
    setMessage("");

    const { error } = await supabase.from("tasks").insert([
      {
        title: buildTitle(form),
        task_type: form.interaction_type,
        interaction_type: form.interaction_type,
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
        whatsapp_message_template: buildWhatsappMessage(form),
        source: "manual_intake",
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
    speakWarm("Your intake has been saved successfully.");
  }

  function markDone(id) {
    supabase
      .from("tasks")
      .update({ status: "completed" })
      .eq("id", id)
      .then(loadItems);
  }

  const active = items.filter((i) => i.status !== "completed");
  const completed = items.filter((i) => i.status === "completed");
  const overdue = active.filter(
    (i) => i.follow_up_date && new Date(i.follow_up_date) < new Date()
  );

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900 pb-28">
      <div className="max-w-md mx-auto min-h-screen px-6 py-6">
        <p className="text-xs text-blue-600 font-black tracking-widest uppercase">
          V50 Executive Secretary
        </p>

        <h1 className="text-4xl font-black mt-2">
          {mode === "home" && "Daily Command Center"}
          {mode === "voice" && "Voice Intake"}
          {mode === "manual" && "Manual Intake"}
          {mode === "followups" && "Follow-ups"}
        </h1>

        <p className="text-slate-500 mt-3">
          Personal secretary for calls, meetings, pending items and reminders.
        </p>

        {mode === "home" && (
          <section className="mt-8">
            <div className="rounded-[2rem] bg-[#071a33] text-white p-6 shadow-xl">
              <p className="text-blue-300 text-xs font-black uppercase tracking-widest">
                Morning Briefing
              </p>

              <h2 className="text-2xl font-black mt-4">
                You have {active.length} active follow-ups.
              </h2>

              <p className="text-blue-100 mt-3">
                {overdue.length} overdue. {completed.length} completed.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <button
                  onClick={() => setMode("voice")}
                  className="bg-blue-600 text-white rounded-2xl p-4 font-black"
                >
                  Voice
                </button>

                <button
                  onClick={() => setMode("manual")}
                  className="bg-white text-[#071a33] rounded-2xl p-4 font-black"
                >
                  Manual
                </button>
              </div>
            </div>
          </section>
        )}

        {mode === "voice" && (
          <section className="mt-8 bg-white rounded-[2rem] p-6 shadow-xl text-center">
            <h2 className="text-3xl font-black">Touch-Free Secretary</h2>

            <p className="text-slate-500 mt-3">
              Press once and speak naturally.
            </p>

            <button
              onClick={() =>
                speakWarm(
                  "Hello. I am ready to help you record your meeting notes. What type of communication was it?"
                )
              }
              className="mt-8 w-40 h-40 rounded-full bg-blue-600 text-white text-5xl shadow-2xl"
            >
              🎙
            </button>
          </section>
        )}

        {mode === "manual" && (
          <section className="mt-8 bg-white rounded-[2rem] p-6 shadow-xl space-y-5">
            <Field label="Type">
              <select
                className={inputClass}
                value={form.interaction_type}
                onChange={(e) => updateField("interaction_type", e.target.value)}
              >
                <option>Phone Call</option>
                <option>Meeting</option>
                <option>WhatsApp</option>
                <option>Email</option>
                <option>Presentation</option>
                <option>Offer Follow-up</option>
                <option>Reminder</option>
              </select>
            </Field>

            <Input label="Contact Name" value={form.contact_name} onChange={(v) => updateField("contact_name", v)} />
            <Input label="Position" value={form.contact_position} onChange={(v) => updateField("contact_position", v)} />
            <Input label="Company" value={form.company_name} onChange={(v) => updateField("company_name", v)} />
            <Input label="Phone" value={form.phone} onChange={(v) => updateField("phone", v)} />
            <Input label="Email" value={form.email} onChange={(v) => updateField("email", v)} />
            <Input label="WhatsApp" value={form.whatsapp_number} onChange={(v) => updateField("whatsapp_number", v)} />
            <Input label="Topic" value={form.topic} onChange={(v) => updateField("topic", v)} />

            <Textarea label="What was discussed?" value={form.discussion_notes} onChange={(v) => updateField("discussion_notes", v)} />
            <Textarea label="What was agreed?" value={form.agreed_actions} onChange={(v) => updateField("agreed_actions", v)} />
            <Textarea label="What did we promise?" value={form.promised_by_us} onChange={(v) => updateField("promised_by_us", v)} />
            <Textarea label="What is pending from them?" value={form.pending_from_them} onChange={(v) => updateField("pending_from_them", v)} />

            <Input label="Follow-up Date" type="date" value={form.follow_up_date} onChange={(v) => updateField("follow_up_date", v)} />
            <Input label="Follow-up Time" type="time" value={form.follow_up_time} onChange={(v) => updateField("follow_up_time", v)} />

            <Field label="Priority">
              <select
                className={inputClass}
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </Field>

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

        {mode === "followups" && (
          <section className="mt-8 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 shadow">
                <p className="text-xs text-blue-600 font-black uppercase">
                  {item.interaction_type || "Follow-up"}
                </p>

                <h3 className="font-black text-lg mt-1">
                  {item.contact_name || item.title}
                </h3>

                <p className="text-slate-500">
                  {item.company_name || item.topic || ""}
                </p>

                {item.follow_up_date && (
                  <p className="mt-3 bg-blue-50 text-blue-700 rounded-xl p-3 font-black">
                    Follow-up: {item.follow_up_date} {item.follow_up_time || ""}
                  </p>
                )}

                <button
                  onClick={() => markDone(item.id)}
                  className="w-full mt-4 bg-blue-100 text-blue-700 rounded-2xl p-3 font-black"
                >
                  Done
                </button>
              </div>
            ))}
          </section>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
        <div className="max-w-md mx-auto grid grid-cols-4 text-center py-3">
          <button onClick={() => setMode("home")} className={mode === "home" ? "text-blue-600 font-black" : ""}>
            ⌂<br />Home
          </button>

          <button onClick={() => setMode("voice")} className={mode === "voice" ? "text-blue-600 font-black" : ""}>
            🎙<br />Voice
          </button>

          <button onClick={() => setMode("manual")} className={mode === "manual" ? "text-blue-600 font-black" : ""}>
            +<br />Intake
          </button>

          <button onClick={() => setMode("followups")} className={mode === "followups" ? "text-blue-600 font-black" : ""}>
            ✅<br />Follow-ups
          </button>
        </div>
      </nav>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block font-black text-slate-700 mb-2">{label}</label>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <Field label={label}>
      <input
        className={inputClass}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <Field label={label}>
      <textarea
        className={`${inputClass} min-h-28`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}
