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
    utterance.lang = "el-GR";
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
      alert("Speech recognition not supported. Δοκίμασε Chrome.");
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

      speak(`Κατάλαβα: ${transcript}. Είναι σωστό; Πες OK, Repeat ή Skip.`);
    };

    recognition.onerror = () => {
      setIsListening(false);
      speak("Δεν σε άκουσα καθαρά. Πάτησε ξανά το μικρόφωνο.");
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
      speak("Η καταγραφή ολοκληρώθηκε.");
      alert("Η καταγραφή ολοκληρώθηκε");
      console.log(formData);
    }
  };

  const handleRepeat = () => {
    setCurrentAnswer("");
    setIsConfirming(false);
    speak("Πες το ξανά.");
  };

  const handleSkip = () => {
    setCurrentAnswer("");
    setIsConfirming(false);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      speak("Η καταγραφή ολοκληρώθηκε.");
      alert("Η καταγραφή ολοκληρώθηκε");
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
