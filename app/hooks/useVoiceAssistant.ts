"use client";

type Listener = (text: string) => void;

function getRecognition(): SpeechRecognition | null {
  if (typeof window === "undefined") return null;

  const SpeechRecognitionConstructor =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionConstructor) return null;

  const recog: SpeechRecognition = new SpeechRecognitionConstructor();
  recog.lang = "en-IN";
  recog.continuous = false;
  recog.interimResults = false;

  return recog;
}

export function useVoiceAssistant() {
  function speak(text: string) {
    if (typeof window === "undefined") return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function listen(callback: Listener) {
    const recognition = getRecognition();

    if (!recognition) {
      console.warn("SpeechRecognition not supported in this browser");
      return;
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      callback(transcript);
      recognition.stop();
    };

    recognition.onerror = () => {
      recognition.stop();
    };

    recognition.start();
  }

  return { speak, listen };
}
