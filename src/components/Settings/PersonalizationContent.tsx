"use client";

import React, { useState } from "react";
import { Switch } from "../ui/switch";
import Modal from "../ui/Modal"; // assuming you have a Modal component

export default function PersonalizationContent() {
  const [ascentPersonality, setAscentPersonality] = useState("");
  const [memoryEnabled, setMemoryEnabled] = useState(true);

  // Modal state
  const [modal, setModal] = useState({ isOpen: false, message: "" });

  const handleMemoryToggle = () => {
    setMemoryEnabled((prev) => {
      const newState = !prev;

      // Show modal instead of toast
      setModal({
        isOpen: true,
        message: `Knowledge Context ${newState ? "enabled" : "disabled"}`,
      });

      return newState;
    });
  };

  return (
    <div className="space-y-6 text-card-foreground-800">
      {/* AI Response Style */}
      <div className="border p-4 rounded-xl space-y-2">
        <label className="font-medium">AI Response Style</label>
        <select
          value={ascentPersonality}
          onChange={(e) => setAscentPersonality(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-foreground bg-background"
        >
          <option value="">Default</option>
          <option value="concise">Concise</option>
          <option value="analytical">Analytical</option>
        </select>
        <p className="text-xs text-card-foreground-500 mt-1">
          Choose how AI responds
        </p>
      </div>

      {/* Knowledge Context Toggle */}
      <div className="border p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Knowledge Context Toggle</h4>
          <span className="text-xs text-card-foreground-500">Experimental</span>
        </div>
        <div className="flex items-center justify-between border-t pt-3">
          <p className="text-sm text-card-foreground-700">
            Allow AI to retain session context for follow-ups (“Stay Context Aware”)
          </p>
          <Switch checked={memoryEnabled} onChange={handleMemoryToggle} />
        </div>
      </div>

      {/* Agent Memory Limit Preview */}
      <div className="border p-4 rounded-xl space-y-2">
        <h4 className="font-medium">Agent Memory Limit Preview</h4>
        <p className="text-sm text-card-foreground-700">
          Display how many previous interactions are kept in context (e.g., 5 threads)
        </p>
        <p className="text-xs text-card-foreground-500 mt-1">
          Ascent AI may use Memory to personalize queries to search providers.{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Learn more
          </a>
        </p>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        title="Knowledge Context"
        message={modal.message}
        onClose={() => setModal({ isOpen: false, message: "" })}
      />
    </div>
  );
}
