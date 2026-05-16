const cards = [
  { title: "Overdue", value: "0", text: "εκκρεμείς ενέργειες", tone: "text-red-400" },
  { title: "Today", value: "0", text: "ενέργειες για σήμερα", tone: "text-white" },
  { title: "Open Tasks", value: "1", text: "ανοιχτή υποχρέωση", tone: "text-yellow-400" },
  { title: "Recent Notes", value: "3", text: "τελευταίες σημειώσεις", tone: "text-white" },
];

const actions = [
  "Call follow-ups",
  "Pending offers",
  "Client notes",
  "Today reminders",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <p className="text-yellow-400 text-sm font-semibold tracking-widest uppercase">
            Executive Secretary
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mt-3">
            Daily Command Center
          </h1>
          <p className="text-zinc-400 mt-4 text-lg">
            Η σημερινή εικόνα σου, καθαρά και οργανωμένα.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl"
            >
              <p className="text-zinc-400 text-sm uppercase tracking-wide">
                {card.title}
              </p>
              <h2 className={`text-5xl font-bold mt-4 ${card.tone}`}>
                {card.value}
              </h2>
              <p className="text-zinc-500 mt-3">{card.text}</p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-bold mb-5">Do Not Forget Today</h2>

            <div className="space-y-4">
              <div className="rounded-2xl bg-black border border-zinc-800 p-4">
                <p className="text-yellow-400 font-semibold">
                  Follow up clients
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  Έλεγξε ποιοι περιμένουν προσφορά ή απάντηση.
                </p>
              </div>

              <div className="rounded-2xl bg-black border border-zinc-800 p-4">
                <p className="text-yellow-400 font-semibold">
                  Calls & reminders
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  Κατέγραψε τα τηλεφωνήματα που πρέπει να γίνουν σήμερα.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-bold mb-5 text-yellow-400">
              Quick Actions
            </h2>

            <div className="space-y-3">
              {actions.map((item) => (
                <button
                  key={item}
                  className="w-full text-left rounded-2xl bg-black border border-zinc-800 px-4 py-3 text-zinc-300 hover:border-yellow-400 hover:text-white transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
