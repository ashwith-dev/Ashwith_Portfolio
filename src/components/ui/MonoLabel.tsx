import { cn } from "@/lib/utils";

interface MonoLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function MonoLabel({ children, className }: MonoLabelProps) {
  return (
    <span
      className={cn(
        "font-mono text-xs tracking-widest uppercase text-[var(--muted)]",
        className
      )}
    >
      {children}
    </span>
  );
}
