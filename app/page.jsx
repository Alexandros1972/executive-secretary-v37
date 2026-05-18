'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const emptyForm = {
  interaction_type: 'Phone Call',
  contact_name: '',
  contact_position: '',
  company_name: '',
  phone: '',
  email: '',
  whatsapp_number: '',
  topic: '',
  discussion_notes: '',
  agreed_actions: '',
  promised_by_us: '',
  pending_from_them: '',
  follow_up_date: '',
  follow_up_time: '',
  priority: 'Medium',
  pipeline_stage: 'Interested',
  calendar_event_required: false,
  whatsapp_followup_required: false
}

export default function Home() {
  const [mode, setMode] = useState('home')
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    setItems(data || [])
  }

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function buildTitle(data) {
    return `${data.interaction_type || 'Communication'}: ${data.contact_name || 'Unknown'}${data.company_name ? ' / ' + data.company_name : ''}${data.topic ? ' - ' + data.topic : ''}`
  }

  function buildWhatsappMessage(data) {
    return `Hello ${data.contact_name || ''}, following our discussion about ${data.topic || 'the matter we discussed'}, I wanted to check if there is any update from your side.`
  }

  async function saveRecord() {
    setMessage('')

    const { error } = await supabase.from('tasks').insert([
      {
        title: buildTitle(form),
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
        whatsapp_message_template: buildWhatsappMessage(form),
        source: 'manual_intake',
        status: 'active'
      }
    ])

    if (error) {
      setMessage('Error: ' + error.message)
      return
    }

    setMessage('Saved successfully.')
    setForm(emptyForm)
    await loadItems()
    setMode('home')
  }

  function markDone(id) {
    supabase.from('tasks').update({ status: 'completed' }).eq('id', id).then(loadItems)
  }

  function reopen(id) {
    supabase.from('tasks').update({ status: 'active' }).eq('id', id).then(loadItems)
  }

  function openWhatsapp(item) {
    const phone = (item.whatsapp_number || item.phone || '').replace(/\D/g, '')
    const text = item.whatsapp_message_template || buildWhatsappMessage(item)
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  function openCalendar(item) {
    const title = encodeURIComponent(`Follow-up: ${item.contact_name || item.company_name || item.topic || 'Client'}`)
    const details = encodeURIComponent(
      `Company: ${item.company_name || ''}
Contact: ${item.contact_name || ''}
Position: ${item.contact_position || ''}
Phone: ${item.phone || ''}
Email: ${item.email || ''}
Topic: ${item.topic || ''}
Discussion: ${item.discussion_notes || ''}
Agreed: ${item.agreed_actions || ''}
Promised by us: ${item.promised_by_us || ''}
Pending from them: ${item.pending_from_them || ''}`
    )

    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`, '_blank')
  }

  const active = items.filter(i => i.status !== 'completed')
  const completed = items.filter(i => i.status === 'completed')
  const overdue = active.filter(i => i.follow_up_date && new Date(i.follow_up_date) < new Date())

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#07111f] pb-28">
      <div className="max-w-md mx-auto min-h-screen">

        <header className="px-6 py-6">
          <p className="text-xs text-blue-600 font-black tracking-widest uppercase">
            V50 Executive Secretary
          </p>

          <h1 className="text-3xl font-black mt-1">
            {mode === 'home' && 'Daily Command Center'}
            {mode === 'voice' && 'Voice Intake'}
            {mode === 'manual' && 'Manual Intake'}
            {mode === 'followups' && 'Follow-ups'}
          </h1>

          <p className="text-zinc-500 mt-1">
            Personal secretary for calls, meetings, pending items and reminders.
          </p>
        </header>

        {mode === 'home' && (
          <>
            <section className="px-6">
              <div className="rounded-[2rem] bg-[#071a33] text-white p-6 shadow-xl">
                <p className="text-blue-300 text-xs font-black uppercase tracking-widest">
                  Morning Briefing
                </p>

                <h2 className="text-2xl font-black mt-4 leading-tight">
                  You have {active.length} active follow-ups.
                </h2>

                <p className="text-blue-100 mt-3">
                  {overdue.length} overdue. {completed.length} completed.
                </p>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button
                    onClick={() => setMode('voice')}
                    className="bg-blue-600 text-white rounded-2xl p-4 font-black"
                  >
                    Voice Intake
                  </button>

                  <button
                    onClick={() => setMode('manual')}
                    className="bg-white text-[#071a33] rounded-2xl p-4 font-black"
                  >
                    Manual Intake
                  </button>
                </div>
              </div>
            </section>

            <FollowUpList
              title="Today Focus"
              items={active.slice(0, 5)}
              markDone={markDone}
              reopen={reopen}
              openWhatsapp={openWhatsapp}
              openCalendar={openCalendar}
            />
          </>
        )}

        {mode === 'voice' && (
          <section className="px-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-xl text-center">
              <p className="text-xs text-blue-600 font-black tracking-widest uppercase">
                Voice Intake
              </p>

              <h2 className="text-3xl font-black mt-4">
                Touch-Free Secretary
              </h2>

              <p className="text-zinc-500 mt-3">
                Press once, then answer by voice. The secretary will guide you through the intake.
              </p>

              <button
                onClick={() => alert('Voice intake will be connected in the next step.')}
                className="mt-8 w-40 h-40 rounded-full bg-blue-600 text-white text-5xl shadow-2xl"
              >
                🎙
              </button>
            </div>
          </section>
        )}

        {mode === 'manual' && (
          <section className="px-6">
            <div className="bg-white rounded-[1.5rem] p-5 shadow space-y-4">
              <Field label="Type">
                <select className="input" value={form.interaction_type} onChange={e => updateField('interaction_type', e.target.value)}>
                  <option>Phone Call</option>
                  <option>Meeting</option>
                  <option>WhatsApp</option>
                  <option>Email</option>
                  <option>Presentation</option>
                  <option>Offer Follow-up</option>
                  <option>Reminder</option>
                </select>
              </Field>

              <Input label="Contact Name" value={form.contact_name} onChange={v => updateField('contact_name', v)} />
              <Input label="Position" value={form.contact_position} onChange={v => updateField('contact_position', v)} />
              <Input label="Company" value={form.company_name} onChange={v => updateField('company_name', v)} />
              <Input label="Phone" value={form.phone} onChange={v => updateField('phone', v)} />
              <Input label="Email" value={form.email} onChange={v => updateField('email', v)} />
              <Input label="WhatsApp" value={form.whatsapp_number} onChange={v => updateField('whatsapp_number', v)} />
              <Input label="Topic" value={form.topic} onChange={v => updateField('topic', v)} />

              <Textarea label="What was discussed?" value={form.discussion_notes} onChange={v => updateField('discussion_notes', v)} />
              <Textarea label="What was agreed?" value={form.agreed_actions} onChange={v => updateField('agreed_actions', v)} />
              <Textarea label="What did we promise?" value={form.promised_by_us} onChange={v => updateField('promised_by_us', v)} />
              <Textarea label="What is pending from them?" value={form.pending_from_them} onChange={v => updateField('pending_from_them', v)} />

              <Input label="Follow-up Date" type="date" value={form.follow_up_date} onChange={v => updateField('follow_up_date', v)} />
              <Input label="Follow-up Time" type="time" value={form.follow_up_time} onChange={v => updateField('follow_up_time', v)} />

              <Field label="Priority">
                <select className="input" value={form.priority} onChange={e => updateField('priority', e.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </Field>

              <Field label="Pipeline Stage">
                <select className="input" value={form.pipeline_stage} onChange={e => updateField('pipeline_stage', e.target.value)}>
                  <option>Lead</option>
                  <option>Interested</option>
                  <option>Offer Sent</option>
                  <option>Waiting Reply</option>
                  <option>Demo Needed</option>
                  <option>Negotiation</option>
                  <option>Won</option>
                  <option>Lost</option>
                </select>
              </Field>

              <label className="flex gap-3 items-center font-bold">
                <input type="checkbox" checked={form.calendar_event_required} onChange={e => updateField('calendar_event_required', e.target.checked)} />
                Add to Google Calendar
              </label>

              <label className="flex gap-3 items-center font-bold">
                <input type="checkbox" checked={form.whatsapp_followup_required} onChange={e => updateField('whatsapp_followup_required', e.target.checked)} />
                Prepare WhatsApp follow-up
              </label>

              {message && (
                <div className="bg-blue-50 text-blue-700 rounded-2xl p-4 font-black">
                  {message}
                </div>
              )}

              <button onClick={saveRecord} className="w-full bg-blue-600 text-white rounded-2xl p-4 font-black">
                Save Intake
              </button>
            </div>
          </section>
        )}

        {mode === 'followups' && (
          <FollowUpList
            title="All Follow-ups"
            items={items}
            markDone={markDone}
            reopen={reopen}
            openWhatsapp={openWhatsapp}
            openCalendar={openCalendar}
          />
        )}

        <style jsx>{`
          .input {
            width: 100%;
            background: #ffffff;
            color: #07111f;
            border: 1px solid #d8e0ec;
            border-radius: 16px;
            padding: 14px;
            outline: none;
          }

          .input::placeholder {
            color: #8a94a6;
          }
        `}</style>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200">
          <div className="max-w-md mx-auto grid grid-cols-4 text-center py-3">
            <button onClick={() => setMode('home')} className={mode === 'home' ? 'text-blue-600 font-black' : ''}>
              ⌂<br />Home
            </button>

            <button onClick={() => setMode('voice')} className={mode === 'voice' ? 'text-blue-600 font-black' : ''}>
              🎙<br />Voice
            </button>

            <button onClick={() => setMode('manual')} className={mode === 'manual' ? 'text-blue-600 font-black' : ''}>
              +<br />Intake
            </button>

            <button onClick={() => setMode('followups')} className={mode === 'followups' ? 'text-blue-600 font-black' : ''}>
              ✅<br />Follow-ups
            </button>
          </div>
        </nav>
      </div>
    </main>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block font-black text-zinc-700 mb-2">{label}</label>
      {children}
    </div>
  )
}

function Input({ label, value, onChange, type = 'text' }) {
  return (
    <Field label={label}>
      <input className="input" type={type} value={value} onChange={e => onChange(e.target.value)} />
    </Field>
  )
}

function Textarea({ label, value, onChange }) {
  return (
    <Field label={label}>
      <textarea className="input min-h-28" value={value} onChange={e => onChange(e.target.value)} />
    </Field>
  )
}

function FollowUpList({ title, items, markDone, reopen, openWhatsapp, openCalendar }) {
  return (
    <section className="px-6 mt-7">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-black text-xl">{title}</h2>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-black">
          {items.length}
        </span>
      </div>

      <div className="space-y-4">
        {items.map(item => {
          const done = item.status === 'completed'

          return (
            <div key={item.id} className="bg-white rounded-[1.5rem] p-5 shadow">
              <p className="text-xs text-blue-600 font-black uppercase tracking-widest">
                {item.interaction_type || item.task_type || 'Follow-up'}
              </p>

              <h3 className="font-black text-lg mt-1">
                {item.contact_name || item.title}
              </h3>

              <p className="text-zinc-500">
                {item.company_name || item.topic || ''}
              </p>

              {item.follow_up_date && (
                <div className="mt-4 bg-[#f1f5fb] rounded-2xl p-3 font-black text-blue-700">
                  Follow-up: {item.follow_up_date} {item.follow_up_time || ''}
                </div>
              )}

              {item.pending_from_them && (
                <p className="mt-3 text-zinc-600">
                  <strong>Pending:</strong> {item.pending_from_them}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button onClick={() => openCalendar(item)} className="bg-[#071a33] text-white rounded-2xl p-3 font-black">
                  Calendar
                </button>

                <button onClick={() => openWhatsapp(item)} className="bg-green-100 text-green-700 rounded-2xl p-3 font-black">
                  WhatsApp
                </button>
              </div>

              <button
                onClick={() => done ? reopen(item.id) : markDone(item.id)}
                className={`w-full mt-3 rounded-2xl p-3 font-black ${done ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}
              >
                {done ? 'Reopen' : 'Done'}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
