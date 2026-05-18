"use client";

import { useState } from "react";

import SecretaryConversation from "../components/SecretaryConversation";

import {
  questions,
  initialIntakeForm,
} from "../lib/conversationEngine";

import { createSpeechRecognition } from "../lib/speechRecognition";

export default function Home() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialIntakeForm);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState("answer");

  const currentQuestion = questions[step];

  function speak(text, afterSpeak) {
    if (typeof window === "undefined") return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => {
      if (afterSpeak) afterSpeak();
    };

    window.speechSynthesis.speak(utterance);
  }

  function listenForAnswer() {
    const recognition = createSpeechRecognition();

    if (!recognition) {
      alert("Speech recognition not supported. Use Chrome.");
      return;
    }

    setIsListening(true);
    setMode("answer");

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setCurrentAnswer(transcript);
      setIsListening(false);
      setIsConfirming(true);

      speak(
        `I understood: ${transcript}. Is this correct? Say OK, Repeat or Skip.`,
        listenForConfirmation
      );
    };

    recognition.onerror = () => {
      setIsListening(false);
      speak("I could not hear you clearly. I will ask again.", () => {
        speak(currentQuestion.question, listenForAnswer);
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  function listenForConfirmation() {
    const recognition = createSpeechRecognition();

    if (!recognition) {
      alert("Speech recognition not supported. Use Chrome.");
      return;
    }

    setIsListening(true);
    setMode("confirmation");

    recognition.start();

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();

      setIsListening(false);

      if (
        command.includes("ok") ||
        command.includes("yes") ||
        command.includes("correct") ||
        command.includes("next")
      ) {
        saveAnswerAndMoveNext();
        return;
      }

      if (
        command.includes("repeat") ||
        command.includes("again") ||
        command.includes("wrong")
      ) {
        setCurrentAnswer("");
        setIsConfirming(false);

        speak("No problem. Please say it again.", listenForAnswer);
        return;
      }

      if (
        command.includes("skip") ||
        command.includes("blank") ||
        command.includes("empty")
      ) {
        skipQuestion();
        return;
      }

      speak(
        "I did not understand. Please say OK, Repeat, or Skip.",
        listenForConfirmation
      );
    };

    recognition.onerror = () => {
      setIsListening(false);
      speak(
        "I did not hear your confirmation. Please say OK, Repeat, or Skip.",
        listenForConfirmation
      );
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  function saveAnswerAndMoveNext() {
    const field = currentQuestion.field;

    const updatedForm = {
      ...formData,
      [field]: currentAnswer,
    };

    setFormData(updatedForm);
    setCurrentAnswer("");
    setIsConfirming(false);

    if (step < questions.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);

      speak(questions[nextStep].question, listenForAnswer);
    } else {
      finishIntake(updatedForm);
    }
  }

  function skipQuestion() {
    setCurrentAnswer("");
    setIsConfirming(false);

    if (step < questions.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);

      speak(questions[nextStep].question, listenForAnswer);
    } else {
      finishIntake(formData);
    }
  }

  function finishIntake(finalData) {
    const summary = `
      Intake completed.
      Contact: ${finalData.contact_name || "not provided"}.
      Company: ${finalData.company_name || "not provided"}.
      Topic: ${finalData.topic || "not provided"}.
      Follow up: ${finalData.follow_up_date || "not provided"}.
    `;

    speak(`${summary}. Say Save to store it, or Repeat to start again.`, listenForFinalCommand);
  }

  function listenForFinalCommand() {
    const recognition = createSpeechRecognition();

    if (!recognition) {
      alert("Speech recognition not supported. Use Chrome.");
      return;
    }

    setIsListening(true);
    setMode("final");

    recognition.start();

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();

      setIsListening(false);

      if (
        command.includes("save") ||
        command.includes("ok") ||
        command.includes("yes")
      ) {
        speak("Saved. The intake is complete.");
        alert("Intake completed. Next step will save this to Supabase.");
        return;
      }

      if (
        command.includes("repeat") ||
        command.includes("restart") ||
        command.includes("again")
      ) {
        setStep(0);
        setFormData(initialIntakeForm);
        setCurrentAnswer("");
        setIsConfirming(false);

        speak(questions[0].question, listenForAnswer);
        return;
      }

      speak("Please say Save or Repeat.", listenForFinalCommand);
    };

    recognition.onerror = () => {
      setIsListening(false);
      speak("I did not hear you. Please say Save or Repeat.", listenForFinalCommand);
    };
  }

  function startTouchFreeIntake() {
    setStarted(true);
    setStep(0);
    setFormData(initialIntakeForm);
    setCurrentAnswer("");
    setIsConfirming(false);

    speak("Starting guided intake.", () => {
      speak(questions[0].question, listenForAnswer);
    });
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-5xl font-black text-center">
          IntelliFlow
        </h1>

        <p className="text-center text-zinc-500 mt-3">
          V48 Touch-Free Secretary Mode
        </p>

        {!started && (
          <div className="px-6 mt-10">
            <button
              onClick={startTouchFreeIntake}
              className="w-full bg-blue-600 text-white rounded-3xl p-6 text-2xl font-black shadow-xl"
            >
              Start Touch-Free Intake
            </button>

            <p className="text-center text-zinc-500 mt-4">
              Press once. Then answer by voice.
            </p>
          </div>
        )}

        {started && (
          <SecretaryConversation
            currentQuestion={
              mode === "confirmation"
                ? "Confirm your answer"
                : mode === "final"
                ? "Final confirmation"
                : currentQuestion.question
            }
            currentAnswer={currentAnswer}
            isListening={isListening}
            isConfirming={isConfirming}
            onStartListening={listenForAnswer}
            onOk={saveAnswerAndMoveNext}
            onRepeat={() => speak("Please say it again.", listenForAnswer)}
            onSkip={skipQuestion}
          />
        )}
      </div>
    </main>
  );
}
