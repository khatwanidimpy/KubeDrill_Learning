import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function Timer({
  seconds,
  onElapsed,
}: {
  seconds: number;
  onElapsed: () => void;
}) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (left <= 0) { onElapsed(); return; }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left, onElapsed]);

  const m = Math.floor(left / 60).toString().padStart(2, "0");
  const s = (left % 60).toString().padStart(2, "0");
  const danger = left < 60;

  return (
    <div
      className={`mono inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium ${
        danger ? "border-destructive text-destructive" : "border-border"
      }`}
    >
      <Clock className="h-4 w-4" />
      {m}:{s}
    </div>
  );
}
