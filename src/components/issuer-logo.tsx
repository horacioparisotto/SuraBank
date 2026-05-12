import { cn } from "@/lib/utils";

export function IssuerLogo({ issuer, className }: { issuer: string; className?: string }) {
  const normalized = issuer.toLowerCase();
  if (normalized.includes("master")) {
    return (
      <svg
        viewBox="0 0 48 30"
        className={cn("h-7 w-auto", className)}
        aria-label="Mastercard"
        role="img"
      >
        <circle cx="18" cy="15" r="11" fill="#EB001B" />
        <circle cx="30" cy="15" r="11" fill="#F79E1B" />
        <path d="M24 6.8a11 11 0 0 1 0 16.4 11 11 0 0 1 0-16.4Z" fill="#FF5F00" />
      </svg>
    );
  }
  if (normalized.includes("visa")) {
    return (
      <svg viewBox="0 0 48 16" className={cn("h-5 w-auto", className)} aria-label="Visa" role="img">
        <rect width="48" height="16" rx="2" fill="#1A1F71" />
        <text
          x="24"
          y="11"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="9"
          fill="#fff"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          VISA
        </text>
      </svg>
    );
  }
  return <span className={cn("text-xs uppercase opacity-80", className)}>{issuer}</span>;
}
