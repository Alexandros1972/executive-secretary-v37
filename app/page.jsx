"use client";

import { useEffect, useState } from "react";

import SecretaryConversation from "../components/SecretaryConversation";

import {
  questions,
  initialIntakeForm,
} from "../lib/conversationEngine";

import { createSpeechRecognition } from "../lib/speechRecognition";

export default function Home() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialIntakeForm);
  const [isListening, setIsListening] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const currentQuestion = questions[step];

  function speak(text) {
    if (typeof window === "undefined") return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    if (currentQuestion?.question && !isConfirming) {
      speak(currentQuestion.question);
    }
  }, [step]);

  const startListening = () => {
    const recognition = createSpeechRecognition();

    if (!recognition) {
      alert("Speech recognition not supported. Use Chrome.");
      return;
    }

    window.speechSynthesis.cancel();

    setIsListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setCurrentAnswer(transcript);

      setIsListening(false);

      setIsConfirming(true);

      speak(
        `I understood: ${transcript}. Is this correct? Say OK, Repeat or Skip.`
      );
    };

    recognition.onerror = () => {
      setIsListening(false);

      speak("I could not hear you clearly. Please try again.");
    };

    recognition.onend = () => {
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
      speak("The intake has been completed.");

      alert("The intake has been completed.");

      console.log(formData);
    }
  };

  const handleRepeat = () => {
    setCurrentAnswer("");

    setIsConfirming(false);

    speak("Please say it again.");
  };

  const handleSkip = () => {
    setCurrentAnswer("");

    setIsConfirming(false);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      speak("The intake has been completed.");

      alert("The intake has been completed.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-5xl font-black text-center">
          IntelliFlow
        </h1>

        <p className="text-center text-zinc-500 mt-3">
          Voice Guided Secretary V47
        </p>

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
