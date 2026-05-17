"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const initialForm = {
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
  pipeline_stage: "Interested",
  calendar_event_required: false,
  whatsapp_followup_required: false,
};

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("intake");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    setTasks(data || []);
  }

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function nextStep() {
    setMessage("");
    setStep((prev) => Math.min(prev + 1, 5));
  }

  function previousStep() {
    setMessage("");
    setStep((prev) => Math.max(prev - 1, 1));
  }

  function buildTitle() {
    const person = form.contact_name || "Επαφή";
    const company = form.company_name ? ` / ${form.company_name}` : "";
    const topic = form.topic ? ` - ${form.topic}` : "";
    return `${form.interaction_type}: ${person}${company}${topic}`;
  }

  function buildWhatsappMessage() {
    const name = form.contact_name || "";
    const topic = form.topic || "το θέμα που συζητήσαμε";

    return `Καλημέρα ${name}, σε συνέχεια της επικοινωνίας μας σχετικά με ${topic}, ήθελα να δω αν υπάρχει κάποιο νεότερο από την πλευρά σας.`;
  }

  async function saveRecord() {
    setMessage("");

    if (!form.contact_name && !form.company_name && !form.topic) {
      setMessage("Συμπλήρωσε τουλάχιστον επαφή, εταιρεία ή θέμα.");
      return;
    }

    const title = buildTitle();
    const whatsappText = buildWhatsappMessage();

    const { error } = await supabase.from("tasks").insert([
      {
        title,
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
        pipeline_stage: form.pipeline_stage,
        calendar_event_required: form.calendar_event_required,
        whatsapp_followup_required: form.whatsapp_followup_required,
        whatsapp_message_template: whatsappText,
        source: "guided_intake",
        status: "active",
      },
    ]);

    if (error) {
      setMessage("Δεν αποθηκεύτηκε: " + error.message);
      return;
    }

    setMessage("Η καταχώρηση αποθηκεύτηκε σωστά.");
    setForm(initialForm);
    setStep(1);
    fetchTasks();
    setActiveTab("home");
  }

  function openWhatsapp(task) {
    const phone = task.whatsapp_number || task.phone || "";
    const text =
      task.whatsapp_message_template ||
      `Καλημέρα ${task.contact_name || ""}, σε συνέχεια της επικοινωνίας μας ήθελα να δω αν υπάρχει κάποιο νεότερο.`;

    const cleanPhone = phone.replace(/\D/g, "");
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");
  }

  function openCalendarDraft(task) {
    const title = encodeURIComponent(
      `Follow-up: ${task.contact_name || task.company_name || task.topic || "Client"}`
    );

    const details = encodeURIComponent(
      `Εταιρεία: ${task.company_name || ""}
Επαφή: ${task.contact_name || ""}
Θέση: ${task.contact_position || ""}
Θέμα: ${task.topic || ""}
Τι ειπώθηκε: ${task.discussion_notes || ""}
Τι συμφωνήθηκε: ${task.agreed_actions || ""}
Υποσχεθήκαμε: ${task.promised_by_us || ""}
Pending από αυτούς: ${task.pending_from_them || ""}`
    );

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;

    window.open(url, "_blank");
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#07111f]">
      <div className="max-w-md mx-auto min-h-screen bg-[#f7f9fd] pb-28">
        <header className="px-6 py-6">
          <p className="text-xs text-blue-600 font-bold tracking-widest uppercase">
            V45 Guided Secretary
          </p>

          <h1 className="text-3xl font-black mt-1">
            {activeTab === "home" && "Business Command Center"}
            {activeTab === "intake" && "Νέα Καταχώρηση"}
            {activeTab === "tasks" && "Follow-ups"}
          </h1>

          <p className="text-zinc-500 mt-1">
            {activeTab === "home" &&
              "Η γραμματέας σου οργανώνει επαφές, pending και follow-ups."}
            {activeTab === "intake" &&
              "Θα σε ρωτήσω βήμα-βήμα για να καταχωρηθεί σωστά."}
            {activeTab === "tasks" &&
              "Όλες οι εκκρεμότητες και οι επόμενες ενέργειες."}
          </p>
        </header>

        {activeTab === "home" && (
          <>
            <section className="px-6">
              <div className="rounded-[2rem] bg-[#071a33] text-white p-6 shadow-xl">
                <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">
                  Secretary Intelligence
                </p>

                <h2 className="text-2xl font-black mt-4 leading-tight">
                  Έχεις {tasks.length} καταχωρήσεις προς διαχείριση.
                </h2>

                <p className="text-blue-100 mt-3 text-sm">
                  Καταχώρησε τηλεφώνημα, ραντεβού ή follow-up με σωστή δομή.
                </p>

                <button
                  onClick={() => setActiveTab("intake")}
                  className="mt-5 bg-blue-600 text-white rounded-2xl px-5 py-3 font-bold"
                >
                  Νέα Καταχώρηση
                </button>
              </div>
            </section>

            <FollowUpList
              tasks={tasks.slice(0, 5)}
              openWhatsapp={openWhatsapp}
              openCalendarDraft={openCalendarDraft}
            />
          </>
        )}

        {activeTab === "intake" && (
          <section className="px-6">
            <div className="bg-white rounded-[1.5rem] p-5 shadow">
              <div className="flex justify-between items-center mb-5">
                <span className="text-sm font-bold text-blue-600">
                  Βήμα {step}/5
                </span>
                <span className="text-sm text-zinc-400">
                  Guided Intake
                </span>
              </div>

              {step === 1 && (
                <>
                  <h2 className="text-2xl font-black mb-4">
                    Τι θέλεις να καταχωρήσουμε;
                  </h2>

                  <label className="label">Είδος επικοινωνίας</label>
                  <select
                    className="input"
                    value={form.interaction_type}
                    onChange={(e) =>
                      updateField("interaction_type", e.target.value)
                    }
                  >
                    <option>Phone Call</option>
                    <option>Meeting</option>
                    <option>WhatsApp</option>
                    <option>Email</option>
                    <option>Presentation</option>
                    <option>Offer Follow-up</option>
                    <option>Reminder</option>
                  </select>

                  <label className="label">Θέμα</label>
                  <input
                    className="input"
                    placeholder="π.χ. VITO VM προσφορά, Waveco demo..."
                    value={form.topic}
                    onChange={(e) => updateField("topic", e.target.value)}
                  />

                  <label className="label">Προτεραιότητα</label>
                  <select
                    className="input"
                    value={form.priority}
                    onChange={(e) => updateField("priority", e.target.value)}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-2xl font-black mb-4">
                    Με ποιον μίλησες;
                  </h2>

                  <label className="label">Όνομα επαφής</label>
                  <input
                    className="input"
                    placeholder="π.χ. Fabio, Hector, Chef Suren..."
                    value={form.contact_name}
                    onChange={(e) =>
                      updateField("contact_name", e.target.value)
                    }
                  />

                  <label className="label">Θέση</label>
                  <input
                    className="input"
                    placeholder="Owner, Chef, Purchasing Manager..."
                    value={form.contact_position}
                    onChange={(e) =>
                      updateField("contact_position", e.target.value)
                    }
                  />

                  <label className="label">Εταιρεία</label>
                  <input
                    className="input"
                    placeholder="π.χ. Waveco, Burger Shop Nicosia..."
                    value={form.company_name}
                    onChange={(e) =>
                      updateField("company_name", e.target.value)
                    }
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-2xl font-black mb-4">
                    Στοιχεία επικοινωνίας
                  </h2>

                  <label className="label">Τηλέφωνο</label>
                  <input
                    className="input"
                    placeholder="+357..."
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />

                  <label className="label">WhatsApp</label>
                  <input
                    className="input"
                    placeholder="+357..."
                    value={form.whatsapp_number}
                    onChange={(e) =>
                      updateField("whatsapp_number", e.target.value)
                    }
                  />

                  <label className="label">Email</label>
                  <input
                    className="input"
                    placeholder="email@company.com"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="text-2xl font-black mb-4">
                    Τι έγινε στην επικοινωνία;
                  </h2>

                  <label className="label">Τι ειπώθηκε;</label>
                  <textarea
                    className="textarea"
                    placeholder="Γράψε ελεύθερα τι συζητήθηκε..."
                    value={form.discussion_notes}
                    onChange={(e) =>
                      updateField("discussion_notes", e.target.value)
                    }
                  />

                  <label className="label">Τι συμφωνήθηκε;</label>
                  <textarea
                    className="textarea"
                    placeholder="π.χ. Να στείλουμε προσφορά, να γίνει demo..."
                    value={form.agreed_actions}
                    onChange={(e) =>
                      updateField("agreed_actions", e.target.value)
                    }
                  />

                  <label className="label">Τι υποσχεθήκαμε εμείς;</label>
                  <textarea
                    className="textarea"
                    placeholder="π.χ. ROI, brochure, τεχνικά στοιχεία..."
                    value={form.promised_by_us}
                    onChange={(e) =>
                      updateField("promised_by_us", e.target.value)
                    }
                  />

                  <label className="label">Τι περιμένουμε από αυτούς;</label>
                  <textarea
                    className="textarea"
                    placeholder="π.χ. απάντηση, φωτογραφίες, στοιχεία λαδιού..."
                    value={form.pending_from_them}
                    onChange={(e) =>
                      updateField("pending_from_them", e.target.value)
                    }
                  />
                </>
              )}

              {step === 5 && (
                <>
                  <h2 className="text-2xl font-black mb-4">
                    Follow-up και υπενθύμιση
                  </h2>

                  <label className="label">Ημερομηνία follow-up</label>
                  <input
                    className="input"
                    type="date"
                    value={form.follow_up_date}
                    onChange={(e) =>
                      updateField("follow_up_date", e.target.value)
                    }
                  />

                  <label className="label">Ώρα follow-up</label>
                  <input
                    className="input"
                    type="time"
                    value={form.follow_up_time}
                    onChange={(e) =>
                      updateField("follow_up_time", e.target.value)
                    }
                  />

                  <label className="label">Στάδιο πώλησης</label>
                  <select
                    className="input"
                    value={form.pipeline_stage}
                    onChange={(e) =>
                      updateField("pipeline_stage", e.target.value)
                    }
                  >
                    <option>Lead</option>
                    <option>Interested</option>
                    <option>Offer Sent</option>
                    <option>Waiting Reply</option>
                    <option>Demo Needed</option>
                    <option>Negotiation</option>
                    <option>Won</option>
                    <option>Lost</option>
                  </select>

                  <div className="space-y-3 mt-4">
                    <label className="flex items-center gap-3 bg-[#f1f5fb] rounded-2xl p-4 font-bold">
                      <input
                        type="checkbox"
                        checked={form.calendar_event_required}
                        onChange={(e) =>
                          updateField(
                            "calendar_event_required",
                            e.target.checked
                          )
                        }
                      />
                      Να μπει στο Google Calendar
                    </label>

                    <label className="flex items-center gap-3 bg-[#f1f5fb] rounded-2xl p-4 font-bold">
                      <input
                        type="checkbox"
                        checked={form.whatsapp_followup_required}
                        onChange={(e) =>
                          updateField(
                            "whatsapp_followup_required",
                            e.target.checked
                          )
                        }
                      />
                      Να ετοιμαστεί WhatsApp follow-up
                    </label>
                  </div>
                </>
              )}

              {message && (
                <div className="mt-4 bg-blue-50 text-blue-700 rounded-2xl p-4 font-bold">
                  {message}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {step > 1 && (
                  <button
                    onClick={previousStep}
                    className="flex-1 bg-zinc-100 text-zinc-700 rounded-2xl p-4 font-bold"
                  >
                    Πίσω
                  </button>
                )}

                {step < 5 && (
                  <button
                    onClick={nextStep}
                    className="flex-1 bg-[#071a33] text-white rounded-2xl p-4 font-bold"
                  >
                    Επόμενο
                  </button>
                )}

                {step === 5 && (
                  <button
                    onClick={saveRecord}
                    className="flex-1 bg-blue-600 text-white rounded-2xl p-4 font-bold"
                  >
                    Αποθήκευση
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "tasks" && (
          <FollowUpList
            tasks={tasks}
            openWhatsapp={openWhatsapp}
            openCalendarDraft={openCalendarDraft}
          />
        )}

        <style jsx>{`
          .label {
            display: block;
            margin-top: 14px;
            margin-bottom: 6px;
            font-weight: 800;
            color: #334155;
          }

          .input {
            width: 100%;
            background: #f1f5fb;
            border-radius: 16px;
            padding: 14px;
            outline: none;
          }

          .textarea {
            width: 100%;
            background: #f1f5fb;
            border-radius: 16px;
            padding: 14px;
            outline: none;
            min-height: 90px;
          }
        `}</style>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200">
          <div className="max-w-md mx-auto grid grid-cols-3 text-center py-3">
            <button
              onClick={() => setActiveTab("home")}
              className={activeTab === "home" ? "text-blue-600 font-bold" : ""}
            >
              ⌂<br />Home
            </button>

            <button
              onClick={() => setActiveTab("intake")}
              className={
                activeTab === "intake" ? "text-blue-600 font-bold" : ""
              }
            >
              +<br />Intake
            </button>

            <button
              onClick={() => setActiveTab("tasks")}
              className={activeTab === "tasks" ? "text-blue-600 font-bold" : ""}
            >
              ✅<br />Follow-ups
            </button>
          </div>
        </nav>
      </div>
    </main>
  );
}

function FollowUpList({ tasks, openWhatsapp, openCalendarDraft }) {
  return (
    <section className="px-6 mt-7">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-black text-xl">Recent Follow-ups</h2>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 && (
          <div className="bg-white rounded-[1.5rem] p-5 shadow text-zinc-500">
            Δεν υπάρχουν ακόμα καταχωρήσεις.
          </div>
        )}

        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-[1.5rem] p-5 shadow">
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-xs text-blue-600 font-black uppercase tracking-widest">
                  {task.interaction_type || task.task_type || "Follow-up"}
                </p>

                <h3 className="font-black text-lg mt-1">
                  {task.contact_name || task.title}
                </h3>

                <p className="text-zinc-500">
                  {task.company_name || task.topic || ""}
                </p>
              </div>

              <span className="bg-blue-50 text-blue-700 h-fit px-3 py-1 rounded-full text-xs font-bold">
                {task.priority || "Medium"}
              </span>
            </div>

            {task.topic && (
              <p className="mt-4 font-bold text-zinc-700">
                Θέμα: {task.topic}
              </p>
            )}

            {task.agreed_actions && (
              <p className="mt-3 text-zinc-600">
                <strong>Συμφωνήθηκε:</strong> {task.agreed_actions}
              </p>
            )}

            {task.promised_by_us && (
              <p className="mt-3 text-zinc-600">
                <strong>Υποσχεθήκαμε:</strong> {task.promised_by_us}
              </p>
            )}

            {task.pending_from_them && (
              <p className="mt-3 text-zinc-600">
                <strong>Pending από αυτούς:</strong> {task.pending_from_them}
              </p>
            )}

            {(task.follow_up_date || task.follow_up_time) && (
              <div className="mt-4 bg-[#f1f5fb] rounded-2xl p-3 font-bold text-blue-700">
                Follow-up: {task.follow_up_date || ""}{" "}
                {task.follow_up_time || ""}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => openCalendarDraft(task)}
                className="bg-[#071a33] text-white rounded-2xl p-3 font-bold"
              >
                Calendar
              </button>

              <button
                onClick={() => openWhatsapp(task)}
                className="bg-green-100 text-green-700 rounded-2xl p-3 font-bold"
              >
                WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
