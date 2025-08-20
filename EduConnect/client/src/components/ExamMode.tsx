import { useEffect, useRef, useState } from "react";

export default function ExamMode({ onLeave }: { onLeave: () => void }) {
  const [active, setActive] = useState(true);
  const leftCount = useRef(0);
  useEffect(() => {
    function vis() {
      if (document.hidden) {
        leftCount.current += 1;
        if (leftCount.current >= 1) {
          onLeave();
        }
      }
    }
    document.addEventListener('visibilitychange', vis);
    return () => document.removeEventListener('visibilitychange', vis);
  }, [onLeave]);
  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) { e.preventDefault(); e.returnValue = ''; }
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, []);
  if (!active) return null;
  return <div className="p-2 text-xs text-amber-600">Exam mode active: avoid leaving the tab.</div>;
}


