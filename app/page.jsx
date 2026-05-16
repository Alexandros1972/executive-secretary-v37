import { CalendarDays, CheckCircle2, Clock3, Mail, MessageCircle, Phone, Plus, Search, Sparkles, Users } from 'lucide-react';

const briefingCards = [
  { title: 'Calls Today', value: '5', desc: '2 high priority follow-ups', icon: Phone },
  { title: 'Pending Offers', value: '8', desc: '3 waiting for response', icon: Mail },
  { title: 'Meetings', value: '3', desc: 'Next meeting at 14:00', icon: CalendarDays },
  { title: 'Tasks', value: '12', desc: '4 urgent actions today', icon: CheckCircle2 }
];

const timeline = [
  { time: '09:00', title: 'Call Louis Hotels', tag: 'VITO', urgent: true },
  { time: '11:30', title: 'Send Waveco proposal', tag: 'Waveco', urgent: false },
  { time: '14:00', title: 'Meeting with supplier', tag: 'Ops', urgent: false },
  { time: '17:00', title: 'Follow-up Alpha Mega', tag: 'Client', urgent: true }
];

const clients = [
  { name: 'Suren', company: 'Restaurant', action: 'Waiting oil price', status: 'Follow up' },
  { name: 'Hector', company: 'Burger Shop Nicosia', action: 'Send VM offer', status: 'Proposal' },
  { name: 'Fabio', company: 'Waveco', action: 'Infusion feedback', status: 'Message' }
];

export default function ExecutiveSecretaryV37() {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(242,182,0,0.16),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_25%)]" />

      <section className="relative mx-auto max-w-7xl px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pt-8">
        <header className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-yellow-400">Executive Secretary V37</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">
              Good Morning,<br />Georgia.
            </h1>
            <p className="mt-4 max-w-xl text-base text-zinc-400 sm:text-lg">
              You have 3 priority actions today. Your secretary dashboard is ready.
            </p>
          </div>

          <div className="hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-glow backdrop-blur-xl sm:block">
            <p className="text-sm text-zinc-400">Today</p>
            <p className="mt-1 text-3xl font-bold">16 May</p>
            <p className="mt-2 text-sm text-yellow-400">Nicosia</p>
          </div>
        </header>

        <div className="mb-6 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">
          <Search className="ml-2 h-5 w-5 text-zinc-500" />
          <input
            className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-zinc-500"
            placeholder="Search clients, calls, notes or tasks..."
          />
          <button className="rounded-2xl bg-yellow-400 px-4 py-2 text-sm font-bold text-black transition hover:scale-[1.02]">
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {briefingCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="group rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-yellow-400/60">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">{card.title}</p>
                    <p className="mt-3 text-5xl font-black text-yellow-400">{card.value}</p>
                  </div>
                  <div className="rounded-2xl bg-yellow-400/10 p-3 text-yellow-400">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <p className="mt-5 text-sm text-zinc-300">{card.desc}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-400">Today</p>
                <h2 className="text-2xl font-bold">Priority Timeline</h2>
              </div>
              <button className="flex items-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black transition hover:scale-[1.02]">
                <Plus className="h-4 w-4" /> Add Task
              </button>
            </div>

            <div className="space-y-3">
              {timeline.map((item) => (
                <div key={`${item.time}-${item.title}`} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-black/30 p-4 transition hover:border-yellow-400/60">
                  <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-sm font-bold text-yellow-400">
                    {item.time}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.tag}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.urgent ? 'bg-red-500/15 text-red-300' : 'bg-zinc-700/50 text-zinc-300'}`}>
                    {item.urgent ? 'Urgent' : 'Normal'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-[2rem] border border-yellow-400/20 bg-yellow-400/[0.06] p-5 shadow-glow backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-yellow-400 p-3 text-black">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-yellow-400">AI</p>
                <h2 className="text-2xl font-bold">Suggestions</h2>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200">You haven’t followed up Suren for 5 days.</div>
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200">3 clients opened your proposal but didn’t reply.</div>
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200">Prepare Hector’s VM payment plan offer.</div>
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-400">Clients</p>
              <h2 className="text-2xl font-bold">Active Follow-ups</h2>
            </div>
            <Users className="h-6 w-6 text-yellow-400" />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {clients.map((client) => (
              <div key={client.name} className="rounded-3xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold">{client.name}</p>
                    <p className="text-sm text-zinc-500">{client.company}</p>
                  </div>
                  <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400">{client.status}</span>
                </div>
                <p className="mt-4 text-sm text-zinc-300">{client.action}</p>
                <div className="mt-4 flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:border-yellow-400/60"><Phone className="h-4 w-4" /> Call</button>
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:border-yellow-400/60"><MessageCircle className="h-4 w-4" /> WhatsApp</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      <nav className="fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-zinc-950/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:gap-5 sm:px-6">
        <button className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">Home</button>
        <button className="px-2 text-sm text-zinc-400 hover:text-white">Tasks</button>
        <button className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-2xl font-black text-black shadow-glow transition hover:scale-105">+</button>
        <button className="px-2 text-sm text-zinc-400 hover:text-white">Calls</button>
        <button className="px-2 text-sm text-zinc-400 hover:text-white">Clients</button>
      </nav>
    </main>
  );
}
