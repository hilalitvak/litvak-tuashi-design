export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5v-.5c0-.2-.7-1.6-.9-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" />
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1 1 7.2 3.9z" />
    </svg>
  );
}

/** כפתור פתיחת שיחת וואטסאפ. הקישור נפתח בלשונית נפרדת. */
export function WhatsAppButton({
  number,
  owner,
  size = "default",
}: {
  number: string;
  owner: string;
  size?: "default" | "large";
}) {
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 rounded-sm border border-ink-line bg-ink text-cream transition-colors hover:border-sand hover:text-sand ${
        size === "large" ? "px-6 py-4 text-base" : "px-4 py-2.5 text-sm"
      }`}
    >
      <WhatsAppIcon className={size === "large" ? "h-5 w-5" : "h-4 w-4"} />
      וואטסאפ עם {owner}
    </a>
  );
}
