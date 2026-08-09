"use client";

import { FileText } from "lucide-react";
import { useState } from "react";

interface ExportButtonProps {
  label?: string;
  onClick: () => Promise<void>;
  disabled?: boolean;
}

export function ExportButton({ label = "Exportar PDF", onClick, disabled = false }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error("Error durante exportación:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FileText size={16} />
      {loading ? "Generando..." : label}
    </button>
  );
}
