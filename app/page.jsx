'use client'

import { useState } from 'react'
import SecretaryConversation from '../components/SecretaryConversation.jsx'

import {
  questions,
  processGuidedStep,
  generateMorningBriefing,
  generateFollowUpSuggestions,
  generateWeeklyReview
} from '../lib/conversationEngine'

export default function Home() {
  const [conversation, setConversation] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [notes, setNotes] = useState('')
  const [clientName, setClientName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAnswer = async (answer) => {
    setLoading(true)

    const currentQuestion = questions[currentStep]

    const updatedConversation = [
      ...conversation,
      {
        question: currentQuestion,
        answer
      }
    ]

    setConversation(updatedConversation)

    const result = processGuidedStep(
      updatedConversation,
      currentStep
    )

    if (result?.clientName) {
      setClientName(result.clientName)
    }

    if (result?.companyName) {
      setCompanyName(result.companyName)
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    }

    setLoading(false)
  }

  const resetConversation = () => {
    setConversation([])
    setCurrentStep(0)
    setNotes('')
    setClientName('')
    setCompanyName('')
  }

  const morningBriefing = generateMorningBriefing()
  const followUps = generateFollowUpSuggestions()
  const weeklyReview = generateWeeklyReview()

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-5xl mx-auto">

        <div className="mb-6">
          <h1 className="text-4xl font-bold">
            Executive Secretary AI
          </h1>

          <p className="text-gray-400 mt-2">
            Voice-first operational assistant
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <div className="lg:col-span-2">
            <SecretaryConversation
              questions={questions}
              currentStep={currentStep}
              onAnswer={handleAnswer}
              loading={loading}
              conversation={conversation}
            />
          </div>

          <div className="space-y-4">

            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-3">
                Active Client
              </h2>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-400">Client:</span>{' '}
                  {clientName || '—'}
                </p>

                <p>
                  <span className="text-gray-400">Company:</span>{' '}
                  {companyName || '—'}
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-3">
                Morning Briefing
              </h2>

              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {morningBriefing}
              </p>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-3">
                Follow-Ups
              </h2>

              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {followUps}
              </p>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-3">
                Weekly Review
              </h2>

              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {weeklyReview}
              </p>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-3">
                Notes
              </h2>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write notes manually..."
                className="w-full h-32 bg-black border border-zinc-700 rounded-xl p-3 text-sm outline-none"
              />
            </div>

            <button
              onClick={resetConversation}
              className="w-full bg-red-600 hover:bg-red-700 transition rounded-2xl p-3 font-semibold"
            >
              Reset Session
            </button>

          </div>
        </div>
      </div>
    </main>
  )
}
