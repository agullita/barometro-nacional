import { clsx } from "clsx";

interface Props {
  cat: "I" | "II" | "III";
  label: string;
  className?: string;
}

export function BadgeCategoria({ cat, label, className }: Props) {
  const color =
    cat === "I"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
      : cat === "II"
      ? "bg-amber-100 text-amber-800 border-amber-300"
      : "bg-rose-100 text-rose-800 border-rose-300";
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
        color,
        className
      )}
    >
      <span className="font-bold">Cat. {cat}</span>
      <span>·</span>
      <span>{label}</span>
    </span>
  );
}

export function BadgeAlcance({ cat, label }: { cat: 1 | 2 | 3; label: string }) {
  const color =
    cat === 1
      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
      : cat === 2
      ? "bg-amber-100 text-amber-800 border-amber-300"
      : "bg-rose-100 text-rose-800 border-rose-300";
  return (
    <span className={clsx("inline-flex px-2 py-0.5 rounded text-xs font-medium border", color)}>
      {label}
   </span>
  );
}

export function BadgeCarga({ cat, label }: { cat: "A" | "B" | "C"; label: string }) {
  const color =
    cat === "C"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
      : cat === "B"
      ? "bg-amber-100 text-amber-800 border-amber-300"
      : "bg-rose-100 text-rose-800 border-rose-300";
  return (
    <span className={clsx("inline-flex px-2 py-0.5 rounded text-xs font-medium border", color)}>
      {label}
   </span>
  );
}
