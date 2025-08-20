import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

export default function Whiteboard({ groupId }: { groupId: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let drawing = false;
    function getPos(e: MouseEvent) { const rect = canvas.getBoundingClientRect(); return { x: e.clientX - rect.left, y: e.clientY - rect.top }; }
    function down(e: MouseEvent) { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }
    function move(e: MouseEvent) { if (!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }
    function up() { drawing = false; }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    return () => { canvas.removeEventListener('mousedown', down); canvas.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, []);
  async function save() {
    const dataUrl = canvasRef.current?.toDataURL('image/png');
    if (!dataUrl) return;
    await apiRequest('POST', '/api/whiteboard/snapshots', { groupId, dataUrl });
  }
  return (
    <div className="space-y-2">
      <canvas ref={canvasRef} width={800} height={400} className="border w-full" />
      <Button onClick={save}>Save Snapshot</Button>
    </div>
  );
}


