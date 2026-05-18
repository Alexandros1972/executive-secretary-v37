export const questions = [
  {
    field: "interaction_type",
    question: "Τι είδους επικοινωνία ήταν;",
  },
  {
    field: "contact_name",
    question: "Με ποιον μίλησες;",
  },
  {
    field: "contact_position",
    question: "Ποια είναι η θέση του;",
  },
  {
    field: "company_name",
    question: "Ποια είναι η εταιρεία;",
  },
  {
    field: "phone",
    question: "Ποιο είναι το τηλέφωνο;",
  },
  {
    field: "email",
    question: "Ποιο είναι το email;",
  },
  {
    field: "whatsapp_number",
    question: "Ποιο είναι το WhatsApp;",
  },
  {
    field: "topic",
    question: "Ποιο ήταν το θέμα;",
  },
  {
    field: "discussion_notes",
    question: "Τι συζητήσατε;",
  },
  {
    field: "agreed_actions",
    question: "Τι συμφωνήθηκε;",
  },
  {
    field: "promised_by_us",
    question: "Τι υποσχεθήκατε εσείς;",
  },
  {
    field: "pending_from_them",
    question: "Τι περιμένετε από αυτούς;",
  },
  {
    field: "follow_up_date",
    question: "Πότε να γίνει follow up;",
  },
  {
    field: "follow_up_time",
    question: "Τι ώρα να γίνει follow up;",
  },
  {
    field: "priority",
    question: "Ποια είναι η προτεραιότητα; Χαμηλή, μεσαία, υψηλή ή επείγον;",
  },
  {
    field: "pipeline_stage",
    question: "Σε ποιο στάδιο είναι; Lead, interested, offer sent, waiting reply, demo needed ή negotiation;",
  },
  {
    field: "calendar_event_required",
    question: "Να μπει στο Google Calendar;",
  },
  {
    field: "whatsapp_followup_required",
    question: "Να ετοιμαστεί WhatsApp follow up;",
  },
];

export const initialIntakeForm = {
  interaction_type: "",
  contact_name: "",
  contact_position: "",
  company_name: "",
  phone: "",
  email: "",
  whatsapp_number: "",
  topic: "",
  discussion_notes: "",
  agreed_actions: "",
  promised_by_us: "",
  pending_from_them: "",
  follow_up_date: "",
  follow_up_time: "",
  priority: "Medium",
  pipeline_stage: "Interested",
  calendar_event_required: false,
  whatsapp_followup_required: false,
};

export function isOkCommand(text) {
  const value = text.toLowerCase().trim();
  return ["ok", "okay", "οκ", "σωστό", "ναι", "yes", "εντάξει"].some((word) =>
    value.includes(word)
  );
}

export function isRepeatCommand(text) {
  const value = text.toLowerCase().trim();
  return ["repeat", "ξανά", "ξανα", "λάθος", "λαθος", "διόρθωσε", "διορθωσε"].some((word) =>
    value.includes(word)
  );
}

export function isSkipCommand(text) {
  const value = text.toLowerCase().trim();
  return ["skip", "next", "άστο", "αστο", "κενό", "κενο", "δεν ξέρω", "δεν ξερω"].some((word) =>
    value.includes(word)
  );
}
