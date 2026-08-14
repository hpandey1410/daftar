export function Footer() {
  return (
    <footer className="relative z-10 mt-10 px-4 pb-56 pt-6 text-center sm:pb-52">
      <p className="font-mono-office text-xs text-paper-dim">
        <span className="font-semibold text-paper">Gary, Facilities</span>
        {" — "}I control the office PA system. I&apos;ve picked every song
        since the Great Printer Incident of 2019.
      </p>
      <a
        href="#"
        className="mt-2 inline-block font-mono-office text-[11px] text-highlighter underline decoration-highlighter/40 underline-offset-4 transition-colors hover:text-paper"
      >
        Follow Gary&apos;s desk plant &rarr;
      </a>
      <p className="mt-3 font-mono-office text-[10px] tracking-wide text-muted">
        New tracks join the shift most weeks.
      </p>
    </footer>
  );
}
