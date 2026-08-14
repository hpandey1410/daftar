"use client";

import { useState } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";

export function ShareNudge() {
  const { nudgeOpen, closeNudge } = usePlayer();
  const [sent, setSent] = useState(false);

  if (!nudgeOpen) return null;

  async function handleSend() {
    const url = typeof window !== "undefined" ? window.location.href : "https://daftarco.in";
    const text = "Someone's still stuck in a meeting right now. Send them out.";
    if (navigator.share) {
      try {
        await navigator.share({ title: "दफ्तर", text, url });
      } catch {
        // cancelled
      }
      closeNudge();
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setSent(true);
      setTimeout(() => closeNudge(), 1200);
    } catch {
      closeNudge();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[55] flex items-end justify-center bg-office-950/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={closeNudge}
    >
      <div
        className="modal-in w-full max-w-sm rounded-2xl border border-paper/10 bg-office-900 p-6 text-center shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-display text-xl tracking-tight text-paper">
          Someone&apos;s still stuck in a meeting right now.
        </p>
        <p className="mt-2 font-mono-office text-xs text-paper-dim">
          They could use this. There&apos;s room on the floor.
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSend}
            className="cursor-pointer rounded-full bg-highlighter py-3 font-mono-office text-sm font-bold uppercase tracking-wide text-office-950 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
          >
            {sent ? "Link copied" : "Send it to one person"}
          </button>
          <button
            type="button"
            onClick={closeNudge}
            className="cursor-pointer rounded-full py-2.5 font-mono-office text-xs uppercase tracking-wide text-muted transition-colors duration-150 hover:text-paper"
          >
            Not right now
          </button>
        </div>
      </div>
    </div>
  );
}
