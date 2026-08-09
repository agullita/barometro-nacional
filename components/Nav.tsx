"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const links = [
  { href: "/", label: "Proyectos" },
  { href: "/criterios", label: "Criterios" },
  { href: "/actividades", label: "Actividades" },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav className="bg-white border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-frm-azul rounded flex items-center justify-center text-white font-bold">
              FRM
           </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm leading-tight">
                Barómetro Nacional
             </div>
              <div className="text-xs text-slate-500 leading-tight">
                Fundación Real Madrid
             </div>
           </div>
         </Link>

          <div className="flex gap-1">
            {links.map((l) => {
              const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={clsx(
                    "px-3 py-1.5 rounded-md text-sm font-medium",
                    active
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {l.label}
               </Link>
              );
            })}
         </div>
       </div>

        <div className="text-xs text-slate-400">v0.1 · Prototipo</div>
     </div>
   </nav>
  );
}
