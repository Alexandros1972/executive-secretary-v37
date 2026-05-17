"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      if (!supabase) {
        setError("Supabase URL or Key is missing.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.from("tasks").select("*");

      if (error) {
        setError(error.message);
      } else {
        setTasks(data || []);
      }

      setLoading(false);
    }

    fetchTasks();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-5xl font-bold text-yellow-400 mb-4">
        Business Command Center
      </h1>

      <p className="text-zinc-400 mb-8">
        Real-time executive secretary dashboard
      </p>

      {loading && <p>Loading tasks...</p>}

      {error && (
        <div className="border border-red-500 text-red-400 p-4 rounded-xl">
          Error: {error}
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <p className="text-zinc-400">No tasks found.</p>
      )}

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="border border-zinc-700 p-4 rounded-xl">
            <h2 className="text-xl font-bold">{task.title || "Untitled task"}</h2>
            <p className="text-zinc-400">{task.task_type || task.status}</p>
            <p className="text-yellow-400">{task.priority}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
