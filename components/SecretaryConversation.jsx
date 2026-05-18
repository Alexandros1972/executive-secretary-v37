"use client";

export default function SecretaryConversation({
  currentQuestion,
  currentAnswer,
  isListening,
  isConfirming,
  onStartListening,
  onOk,
  onRepeat,
  onSkip,
}) {
  return (
    <section className="px-6 mt-8">
      <div className="bg-white rounded-[2rem] p-6 shadow">
        <p className="text-xs font-black tracking-widest uppercase text-blue-600">
          AI Secretary
        </p>

        <h2 className="text-3xl font-black mt-4 leading-tight">
          {currentQuestion}
        </h2>

        <button
          onClick={onStartListening}
          className={`w-40 h-40 rounded-full mx-auto mt-10 flex items-center justify-center shadow-2xl transition ${
            isListening ? "bg-red-500 scale-105" : "bg-blue-600"
          }`}
        >
          <span className="text-white text-6xl">🎙</span>
        </button>

        <div className="mt-8 bg-[#f1f5fb] rounded-2xl p-5">
          <p className="text-sm text-zinc-500 mb-2">
            {isConfirming ? "Αυτό κατάλαβα:" : "Περιμένω την απάντησή σου:"}
          </p>

          <p className="font-black text-xl">
            {currentAnswer || "..."}
          </p>
        </div>

        {isConfirming && (
          <div className="grid grid-cols-3 gap-3 mt-6">
            <button
              onClick={onOk}
              className="bg-green-100 text-green-700 rounded-2xl p-4 font-black"
            >
              OK
            </button>

            <button
              onClick={onRepeat}
              className="bg-yellow-100 text-yellow-700 rounded-2xl p-4 font-black"
            >
              Repeat
            </button>

            <button
              onClick={onSkip}
              className="bg-zinc-100 text-zinc-700 rounded-2xl p-4 font-black"
            >
              Skip
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
