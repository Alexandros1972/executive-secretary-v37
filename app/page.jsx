"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setTasks(data);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-6xl font-bold text-yellow-400 mb-2">
        Business Command Center
      </h1>

      <p className="text-gray-400 mb-10">
        Real-time executive secretary dashboard
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >
            <div className="text-yellow-400 text-sm mb-2">
              {task.task_type}
            </div>

            <h2 className="text-2xl font-bold mb-4">
              {task.title}
            </h2>

            <div className="text-gray-400">
              Priority: {task.priority}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
