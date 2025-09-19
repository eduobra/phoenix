// components/ui/FlowTrace.tsx
import React from "react";

export default function FlowTrace({
  from,
  to,
  via,
}: {
  from: string;
  to: string;
  via?: string;
}) {
  return (
    <div className="text-xs text-gray-500 italic mt-1 px-4">
      {from} {via && <>→ <span className="text-blue-600">{via}</span></>} → {to}
    </div>
  );
}
