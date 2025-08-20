import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

export default function MoodTracker() {
  const [mood, setMood] = useState('happy');
  const [note, setNote] = useState('');
  async function submit() {
    await apiRequest('POST', '/api/mood', { mood, note });
    setNote('');
  }
  return (
    <div className="flex items-center gap-2">
      <select className="border rounded px-2 py-1" value={mood} onChange={(e) => setMood(e.target.value)}>
        <option value="happy">Happy</option>
        <option value="stressed">Stressed</option>
        <option value="tired">Tired</option>
        <option value="neutral">Neutral</option>
      </select>
      <input className="border rounded px-2 py-1 flex-1" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
      <Button onClick={submit}>Log Mood</Button>
    </div>
  );
}


