const stats = [
  { title: "Overdue", value: "0", text: "εκκρεμείς ενέργειες", color: "text-red-400" },
  { title: "Today", value: "0", text: "ενέργειες για σήμερα", color: "text-white" },
  { title: "Open Tasks", value: "1", text: "ανοιχτή υποχρέωση", color: "text-yellow-400" },
  { title: "Recent Notes", value: "3", text: "τελευταίες σημειώσεις", color: "text-white" },
];

const tasks = [
  "Follow up clients waiting for proposal",
  "Call clients with pending payments",
  "Prepare next VITO offer",
];

const notes = [
  "Έκτορας Burger Shop Nicosia: προσφορά VITO VM",
  "Να ετοιμαστεί follow-up για Waveco",
  "Να ελεγχθούν pending offers",
];

const calls = [
  "Fabio / Waveco",
  "VITO Germany",
  "Client follow-ups",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-5 py-6">

        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
          <div>
            <p className="text-yellow-400 text-xs font-bold tracking-[0.25em] uppercase">
              Executive Secretary V38
            </p>
            <h1 className="text-4xl md:text-6xl font-black mt-3">
              Business Command Center
            </h1>
            <p className="text-zinc-400 mt-3">
              Η καθημερινή γραμματεία σου, οργανωμένη σε ένα καθαρό σύστημα.
            </p>
          </div>

          <button className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-2xl">
            + New Action
          </button>
        </header>

        <nav className="flex gap-3 overflow-x-auto mb-8 pb-2">
          {["Home", "Tasks", "Calls", "Notes", "Clients", "Calendar"].map((item, index) => (
            <button
              key={item}
              className={`px-5 py-3 rounded-2xl border text-sm font-semibold ${
                index === 0
                  ? "bg-yellow-400 text-black border-yellow-400"
                  : "bg-zinc-950 text-zinc-300 border-zinc-800"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((item) => (
            <div key={item.title} className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6">
              <p className="text-zinc-500 text-xs uppercase tracking-widest">{item.title}</p>
              <h2 className={`text-5xl font-black mt-4 ${item.color}`}>{item.value}</h2>
              <p className="text-zinc-500 mt-3">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6">
            <h2 className="text-2xl font-bold mb-5 text-yellow-400">Tasks</h2>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task} className="rounded-2xl bg-black border border-zinc-800 p-4">
                  <p>{task}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6">
            <h2 className="text-2xl font-bold mb-5 text-yellow-400">Calls</h2>
            <div className="space-y-3">
              {calls.map((call) => (
                <div key={call} className="rounded-2xl bg-black border border-zinc-800 p-4">
                  <p>{call}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6">
            <h2 className="text-2xl font-bold mb-5 text-yellow-400">Recent Notes</h2>
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note} className="rounded-2xl bg-black border border-zinc-800 p-4">
                  <p className="text-zinc-300">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
