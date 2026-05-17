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
      .select("*");

    console.log(data);
    console.log(error);

    if (data) {
      setTasks(data);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold text-yellow-400 mb-8">
        Business Command Center
      </h1>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border border-zinc-700 p-4 rounded-xl"
          >
            <h2 className="text-xl font-bold">{task.title}</h2>

            <p className="text-zinc-400">
              {task.task_type}
            </p>

            <p className="text-yellow-400">
              {task.priority}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
