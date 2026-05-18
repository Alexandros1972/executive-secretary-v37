export const questions = [
  "What type of communication was it?",
  "Who did you speak with?",
  "What is their position?",
  "Which company?",
  "What was discussed?",
  "What was agreed?",
  "What is pending?",
  "When should we follow up?"
]

export function processGuidedStep(conversation, currentStep) {
  const last = conversation[conversation.length - 1]

  return {
    clientName: conversation[1]?.answer || '',
    companyName: conversation[3]?.answer || '',
    lastAnswer: last?.answer || '',
    currentStep
  }
}

export function generateMorningBriefing() {
  return `Today focus:
- Check pending follow-ups
- Review open client conversations
- Complete overdue tasks
- Prepare next offers`
}

export function generateFollowUpSuggestions() {
  return `Suggested follow-ups:
- Clients waiting for proposal
- Clients with pending payments
- Recent meetings without next action`
}

export function generateWeeklyReview() {
  return `Weekly review:
- Review completed tasks
- Move unfinished items forward
- Check active opportunities
- Plan next customer actions`
}
