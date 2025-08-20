import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function VoiceInput({ onResult }: { onResult: (text: string) => void }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  let recognition: any;
  useEffect(() => {
    const w: any = window as any;
    recognition = new (w.SpeechRecognition || w.webkitSpeechRecognition || w.mozSpeechRecognition || w.msSpeechRecognition)();
    if (recognition) {
      setSupported(true);
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        onResult(text);
      };
      recognition.onend = () => setListening(false);
    }
  }, []);
  function start() { if (!supported) return; setListening(true); recognition.start(); }
  function stop() { if (!supported) return; recognition.stop(); setListening(false); }
  if (!supported) return <div className="text-xs text-gray-500">Voice input not supported</div>;
  return (
    <div className="flex gap-2 items-center">
      <Button onClick={start} disabled={listening}>Start</Button>
      <Button onClick={stop} variant="secondary" disabled={!listening}>Stop</Button>
    </div>
  );
}


