"use client";

import { useState } from "react";

import SecretaryConversation from "../components/SecretaryConversation";

import {
  questions,
  initialIntakeForm,
  isOkCommand,
  isRepeatCommand,
  isSkipCommand,
} from "../lib/conversationEngine";

import { createSpeechRecognition } from "../lib/speechRecognition";

export default function Home() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialIntakeForm);

  const [isListening, setIsListening] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const [currentAnswer, setCurrentAnswer] = useState("");

  const currentQuestion = questions[step];

  const startListening = () => {
    const recognition = createSpeechRecognition();

    if (!recognition) {
      alert("Speech recognition not supported");
      return;
    }

    setIsListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setCurrentAnswer(transcript);

      setIsListening(false);
      setIsConfirming(true);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
  };

  const handleOk = () => {
    const field = currentQuestion.field;

    setFormData((prev) => ({
      ...prev,
      [field]: currentAnswer,
    }));

    setCurrentAnswer("");
    setIsConfirming(false);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      alert("Η καταγραφή ολοκληρώθηκε");
    }
  };

  const handleRepeat = () => {
    setCurrentAnswer("");
    setIsConfirming(false);
  };

  const handleSkip = () => {
    setCurrentAnswer("");
    setIsConfirming(false);

    if (step < questions.length - 1) {
      setStep(step + 1);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-5xl font-black text-center">
          IntelliFlow
        </h1>

        <SecretaryConversation
          currentQuestion={currentQuestion.question}
          currentAnswer={currentAnswer}
          isListening={isListening}
          isConfirming={isConfirming}
          onStartListening={startListening}
          onOk={handleOk}
          onRepeat={handleRepeat}
          onSkip={handleSkip}
        />
      </div>
    </main>
  );
}
