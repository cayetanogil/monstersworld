import React from "react";

const severityColors = [
  "bg-red-200",
  "bg-orange-200",
  "bg-yellow-200",
  "bg-green-200",
  "bg-blue-200",
];

interface SeverityBadgeProps {
  severity: number;
  children: React.ReactNode;
}

function SeverityBadge({
  severity,
  children,
}: SeverityBadgeProps): JSX.Element | null {
  const colorClass = severityColors[severity - 1];
  return (
    <span
      className={`${colorClass} inline-block rounded-md px-2 py-1 font-mono text-xs tracking-wide text-slate-800`}
    >
      {children}
    </span>
  );
}

export default SeverityBadge;
