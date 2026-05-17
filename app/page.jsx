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
  const [taskType, setTaskType] = useState("Phone Call");
  const [priority, setPriority] = useState("Medium");

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
        task_type: taskType,
        priority,
      },
    ]);

    setTitle("");
    fetchTasks();
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-5xl font-bold text-yellow-400 mb-2">
        Business Command Center
      </h1>

      <p className="text-zinc-400 mb-8">
        Real-time executive secretary dashboard
      </p>

      <section className="border border-zinc-800 rounded-2xl p-5 mb-8 max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
          Add New Task
        </h2>

        <input
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 mb-3"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            className="bg-zinc-900 border border-zinc-700 rounded-xl p-3"
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
          >
            <option>Phone Call</option>
            <option>Email</option>
            <option>Meeting</option>
            <option>Offer</option>
            <option>Follow Up</option>
          </select>

          <select
            className="bg-zinc-900 border border-zinc-700 rounded-xl p-3"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button
            onClick={addTask}
            className="bg-yellow-400 text-black font-bold rounded-xl p-3"
          >
            Add Task
          </button>
        </div>
      </section>

      <section className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="border border-zinc-700 p-4 rounded-xl">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p className="text-zinc-400">{task.task_type}</p>
            <p className="text-yellow-400">{task.priority}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
