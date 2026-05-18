export const questions = [
  {
    field: "interaction_type",
    question: "What type of communication was it?",
  },
  {
    field: "contact_name",
    question: "Who did you speak with?",
  },
  {
    field: "contact_position",
    question: "What is their position?",
  },
  {
    field: "company_name",
    question: "Which company?",
  },
  {
    field: "phone",
    question: "What is the phone number?",
  },
  {
    field: "email",
    question: "What is the email address?",
  },
  {
    field: "topic",
    question: "What was the topic?",
  },
  {
    field: "discussion_notes",
    question: "What was discussed?",
  },
  {
    field: "agreed_actions",
    question: "What was agreed?",
  },
  {
    field: "follow_up_date",
    question: "When should the follow up happen?",
  },
];

export const initialIntakeForm = {
  interaction_type: "",
  contact_name: "",
  contact_position: "",
  company_name: "",
  phone: "",
  email: "",
  topic: "",
  discussion_notes: "",
  agreed_actions: "",
  follow_up_date: "",
};

export function isOkCommand(text) {
  return text.toLowerCase().includes("ok");
}

export function isRepeatCommand(text) {
  return text.toLowerCase().includes("repeat");
}

export function isSkipCommand(text) {
  return text.toLowerCase().includes("skip");
}
