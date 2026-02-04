import { ReactNode } from 'react';

interface TooltipProps {
  label: string;
  children: ReactNode;
}

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <div className="relative group flex items-center">
      {children}

      {/* Tooltip bubble */}
      <div
        className="
          pointer-events-none
          absolute top-full mt-2
          left-1/2 -translate-x-1/2
          whitespace-nowrap
          rounded-md
          bg-black/80 dark:bg-black/70
          px-2 py-1
          text-xs font-medium text-white
          opacity-0 scale-95
          transition-all duration-150
          group-hover:opacity-100 group-hover:scale-100
          z-50
        "
      >
        {label}
      </div>
    </div>
  );
}
