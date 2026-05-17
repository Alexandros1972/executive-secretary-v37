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

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data } = await supabase.from("tasks").select("*");
    setTasks(data || []);
  }

  async function addTask() {
    if (!title.trim()) return;

    await supabase.from("tasks").insert([
      {
        title,
        task_type: "Follow Up",
        priority: "Medium",
      },
    ]);

    setTitle("");
    fetchTasks();
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#07111f]">
      <div className="max-w-md mx-auto min-h-screen bg-[#f7f9fd] pb-28">
        <header className="flex items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs text-blue-600 font-bold tracking-widest uppercase">
              IntelliFlow
            </p>
            <h1 className="text-3xl font-black mt-1">Καλημέρα, Alex</h1>
            <p className="text-zinc-500 mt-1">
              Η σημερινή σου εικόνα, καθαρά και οργανωμένα.
            </p>
          </div>

          <div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center">
            🔔
          </div>
        </header>

        <section className="px-6">
          <div className="rounded-[2rem] bg-[#071a33] text-white p-6 shadow-xl">
            <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">
              AI Suggestion
            </p>
            <h2 className="text-2xl font-black mt-4 leading-tight">
              Βρήκα 1 ανοιχτή εκκρεμότητα για follow-up.
            </h2>
            <p className="text-blue-100 mt-3 text-sm">
              Μπορώ να τη βάλω στις σημερινές προτεραιότητες.
            </p>

            <button className="mt-5 bg-blue-600 text-white rounded-2xl px-5 py-3 font-bold">
              Schedule Now
            </button>
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
              onClick={addTask}
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

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200">
          <div className="max-w-md mx-auto grid grid-cols-4 text-center py-3">
            <div className="text-blue-600 font-bold">⌂<br />Home</div>
            <div>🎙<br />Voice</div>
            <div>📄<br />Notes</div>
            <div>✅<br />Tasks</div>
          </div>
        </nav>
      </div>
    </main>
  );
}
