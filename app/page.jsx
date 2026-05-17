"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [listening, setListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("id", { ascending: false });

    setTasks(data || []);
  }

  async function addTask(customTitle = title, type = "Follow Up") {
    if (!customTitle.trim()) return;

    const { error } = await supabase.from("tasks").insert([
      {
        title: customTitle,
        task_type: type,
        priority: "Medium",
      },
    ]);

    if (error) {
      alert("Δεν μπόρεσε να αποθηκευτεί το task: " + error.message);
      return;
    }

    setTitle("");
    setVoiceText("");
    setVoiceMessage("Η εκκρεμότητα αποθηκεύτηκε.");
    fetchTasks();
  }

  function detectTaskType(text) {
    const lower = text.toLowerCase();

    if (
      lower.includes("πάρε") ||
      lower.includes("τηλέφωνο") ||
      lower.includes("τηλεφώνησε") ||
      lower.includes("call")
    ) {
      return "Phone Call";
    }

    if (
      lower.includes("στείλε") ||
      lower.includes("email") ||
      lower.includes("mail") ||
      lower.includes("μήνυμα")
    ) {
      return "Email";
    }

    if (
      lower.includes("ραντεβού") ||
      lower.includes("συνάντηση") ||
      lower.includes("meeting")
    ) {
      return "Meeting";
    }

    if (
      lower.includes("προσφορά") ||
      lower.includes("offer") ||
      lower.includes("quotation")
    ) {
      return "Offer";
    }

    return "Task";
  }

  function processVoiceCommand() {
    if (!voiceText.trim()) return;

    const type = detectTaskType(voiceText);
    addTask(voiceText, type);
  }

  function startListening() {
    setVoiceMessage("");

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceMessage(
        "Το voice recognition δεν υποστηρίζεται σε αυτόν τον browser. Δοκίμασε Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "el-GR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setVoiceMessage("Ακούω...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText(transcript);
      setVoiceMessage("Η φωνή μετατράπηκε σε κείμενο.");
    };

    recognition.onerror = (event) => {
      setVoiceMessage("Σφάλμα μικροφώνου: " + event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#07111f]">
      <div className="max-w-md mx-auto min-h-screen bg-[#f7f9fd] pb-28">
        <header className="flex items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs text-blue-600 font-bold tracking-widest uppercase">
              IntelliFlow V43
            </p>

            <h1 className="text-3xl font-black mt-1">
              {activeTab === "home" ? "Καλημέρα, Alex" : "Voice Command"}
            </h1>

            <p className="text-zinc-500 mt-1">
              {activeTab === "home"
                ? "Η σημερινή σου εικόνα, καθαρά και οργανωμένα."
                : "Υπαγόρευσε σημείωση ή εκκρεμότητα."}
            </p>
          </div>

          <div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center">
            🔔
          </div>
        </header>

        {activeTab === "home" && (
          <>
            <section className="px-6">
              <div className="rounded-[2rem] bg-[#071a33] text-white p-6 shadow-xl">
                <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">
                  AI Suggestion
                </p>

                <h2 className="text-2xl font-black mt-4 leading-tight">
                  Βρήκα {tasks.length} ανοιχτές εκκρεμότητες.
                </h2>

                <p className="text-blue-100 mt-3 text-sm">
                  Μπορώ να οργανώσω τις σημερινές προτεραιότητες.
                </p>
              </div>
            </section>

            <section className="px-6 mt-7">
              <h2 className="font-black text-xl mb-4">Quick Add Task</h2>

              <div className="bg-white rounded-[1.5rem] p-4 shadow">
                <input
                  className="w-full bg-[#f1f5fb] rounded-2xl p-4 outline-none"
                  placeholder="Γράψε νέα εκκρεμότητα..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <button
                  onClick={() => addTask()}
                  className="w-full bg-[#071a33] text-white rounded-2xl p-4 mt-3 font-bold"
                >
                  Add Task
                </button>
              </div>
            </section>

            <section className="px-6 mt-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-xl">Your Focus</h2>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                  {tasks.length} tasks
                </span>
              </div>

              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-[1.5rem] p-5 shadow flex gap-4"
                  >
                    <div className="w-7 h-7 rounded-lg border-2 border-blue-600"></div>

                    <div className="flex-1">
                      <h3 className="font-black text-lg">{task.title}</h3>

                      <p className="text-zinc-500 mt-1">
                        {task.task_type || "Task"}
                      </p>

                      <div className="flex gap-2 mt-3">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          {task.priority || "Medium"}
                        </span>

                        <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-xs font-bold">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "voice" && (
          <section className="px-6 mt-8 text-center">
            <button
              onClick={startListening}
              className={`w-56 h-56 rounded-full mx-auto flex items-center justify-center shadow-2xl transition ${
                listening ? "bg-red-500 scale-105" : "bg-blue-600"
              }`}
            >
              <span className="text-white text-7xl">🎙</span>
            </button>

            <h2 className="text-3xl font-black mt-10">
              {listening ? "Σε ακούω..." : "Υπαγόρευσε την εκκρεμότητα"}
            </h2>

            <p className="text-zinc-500 mt-3">
              Πάτα το μικρόφωνο, μίλησε, και μετά πάτα Done για να αποθηκευτεί.
            </p>

            {voiceMessage && (
              <div className="mt-5 bg-blue-50 text-blue-700 rounded-2xl p-4 font-bold">
                {voiceMessage}
              </div>
            )}

            <div className="bg-white rounded-[1.5rem] p-4 shadow mt-8">
              <textarea
                className="w-full bg-[#f1f5fb] rounded-2xl p-4 outline-none min-h-28"
                placeholder="π.χ. Θύμισέ μου να πάρω τον Fabio αύριο..."
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
              />

              <button
                onClick={processVoiceCommand}
                className="w-full bg-[#071a33] text-white rounded-2xl p-4 mt-3 font-bold"
              >
                Done
              </button>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={() =>
                  setVoiceText("Θύμισέ μου να πάρω τηλέφωνο τον Fabio")
                }
                className="bg-blue-100 text-blue-700 px-5 py-3 rounded-full font-bold"
              >
                Θύμισέ μου το ραντεβού...
              </button>

              <button
                onClick={() =>
                  setVoiceText("Πρόσθεσε στα tasks να στείλω προσφορά")
                }
                className="bg-blue-100 text-blue-700 px-5 py-3 rounded-full font-bold"
              >
                Πρόσθεσε στα tasks...
              </button>
            </div>
          </section>
        )}

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200">
          <div className="max-w-md mx-auto grid grid-cols-4 text-center py-3">
            <button
              onClick={() => setActiveTab("home")}
              className={activeTab === "home" ? "text-blue-600 font-bold" : ""}
            >
              ⌂<br />Home
            </button>

            <button
              onClick={() => setActiveTab("voice")}
              className={activeTab === "voice" ? "text-blue-600 font-bold" : ""}
            >
              🎙<br />Voice
            </button>

            <button>
              📄<br />Notes
            </button>

            <button>
              ✅<br />Tasks
            </button>
          </div>
        </nav>
      </div>
    </main>
  );
}
