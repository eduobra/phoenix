"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Settings,
  Sparkles,
  User,
  Brain,
  Globe,
  Code,
  Mic,
} from "lucide-react";

export default function PersonalizationContent() {
  const [enableCustomization, setEnableCustomization] = useState(true);
  const [ascentPersonality, setAscentPersonality] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [chatHistoryEnabled, setChatHistoryEnabled] = useState(true);

  const personalities = [
    "Chatty", "Witty", "Straight shooting", "Encouraging", "Gen Z", "Traditional",
    "Forward thinking", "Poetic", "Opinionated", "Humble", "Silly", "Direct",
    "Pragmatic", "Corporate", "Outside the box", "Empathetic"
  ];

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const renderToggle = (value: boolean, setValue: (v: boolean) => void) => (
    <button
      onClick={() => setValue(!value)}
      className={`w-12 h-6 rounded-full transition-colors ${
        value ? "bg-blue-500" : "bg-gray-300"
      } flex items-center px-1`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full transition-transform ${
          value ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>
    </button>
  );

  return (
    <div className="space-y-6 text-gray-800">
      {/* Header */}
     

      {/* Enable customization */}
      <div className="flex items-center justify-between border p-4 rounded-xl">
        <div>
          <h4 className="font-medium">Enable customization</h4>
          <p className="text-sm text-gray-600">
            Customize how Ascent AI responds to you.{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Learn more
            </a>
          </p>
        </div>
        {renderToggle(enableCustomization, setEnableCustomization)}
      </div>

      {/* Ascent AI personality */}
      <div className="border p-4 rounded-xl space-y-2">
        <label className="font-medium">Ascent AI personality</label>
        <select
          value={ascentPersonality}
          onChange={(e) => setAscentPersonality(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Select a tone...</option>
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
          <option value="creative">Creative</option>
        </select>
      </div>

      {/* Custom instructions */}
      <div className="border p-4 rounded-xl space-y-2">
        <label className="font-medium">Custom instructions</label>
        <textarea
          placeholder="Additional behavior, style, and tone preferences"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          rows={2}
        ></textarea>
      </div>

      {/* Personality choices */}
      <div className="space-y-2">
        <h4 className="font-medium">Choose a personality</h4>
        <div className="flex flex-wrap gap-2">
          {personalities.map((item) => (
            <button
              key={item}
              onClick={() => setAscentPersonality(item)}
              className={`px-3 py-1 rounded-full border text-sm ${
                ascentPersonality === item
                  ? "bg-blue-100 border-blue-500 text-blue-700"
                  : "hover:bg-gray-100 border-gray-300 text-gray-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* About you */}
      <div className="border p-4 rounded-xl space-y-3">
        <h4 className="font-medium flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" /> About you
        </h4>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="What should Ascent Ai call you?"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Changing random job with animation..."
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Interests, values, or preferences to keep in mind"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            rows={2}
          ></textarea>
        </div>
      </div>

      {/* Memory section */}
      <div className="border p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Reference saved memories</h4>
          <button className="border px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-100">
            Manage
          </button>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <p className="text-sm text-gray-700">
            Let ChatGPT save and use memories when responding.
          </p>
          {renderToggle(memoryEnabled, setMemoryEnabled)}
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <p className="text-sm text-gray-700">
            Let ChatGPT reference recent conversations when responding.
          </p>
          {renderToggle(chatHistoryEnabled, setChatHistoryEnabled)}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Ascent AI may use Memory to personalize queries to search providers, such as Bing.{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Learn more
          </a>
        </p>
      </div>

      {/* Advance Section */}
      <div className="border p-4 rounded-xl space-y-2">
        <h4
          onClick={() => toggleDropdown("advanced")}
          className="font-medium flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" /> Advance Settings
          </span>
          {openDropdown === "advanced" ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </h4>

        {openDropdown === "advanced" && (
          <div className="space-y-3 mt-3">
            {[
              { name: "Web search", icon: Globe },
              { name: "Code", icon: Code },
              { name: "Canvas", icon: Settings },
              { name: "ChatGPT Voice", icon: Mic },
              { name: "Advanced voice", icon: Sparkles },
            ].map(({ name, icon: Icon }) => (
              <div
                key={name}
                className="flex items-center justify-between border p-3 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span>{name}</span>
                </div>
                {renderToggle(true, () => {})}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
