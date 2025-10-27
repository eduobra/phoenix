"use client";
import React, { useState } from "react";

export default function DataControlsContent() {
  const [improveModel, setImproveModel] = useState(true);

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

  const renderButton = (label: string, color = "gray") => {
    const base =
      color === "red"
        ? "text-red-600 border-red-500 hover:bg-red-50"
        : "text-gray-700 border-gray-300 hover:bg-gray-100";
    return (
      <button
        className={`border px-4 py-1 rounded-full text-sm font-medium transition-colors ${base}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-6 text-gray-800">
      {/* Header */}
      <h3 className="text-lg font-semibold">Data Controls</h3>

      {/* Improve the model */}
      <div className="flex items-center justify-between border p-4 rounded-xl">
        <div>
          <h4 className="font-medium">Improve the model for everyone</h4>
          <p className="text-sm text-gray-600">
            Allow Ascent AI to use your conversations to help improve model performance.
          </p>
        </div>
        {renderToggle(improveModel, setImproveModel)}
      </div>

      {/* Shared links */}
      <div className="flex items-center justify-between border p-4 rounded-xl">
        <div>
          <h4 className="font-medium">Shared links</h4>
          <p className="text-sm text-gray-600">Manage or delete shared chat links.</p>
        </div>
        {renderButton("Manage")}
      </div>

      {/* Archived chats */}
      <div className="flex items-center justify-between border p-4 rounded-xl">
        <div>
          <h4 className="font-medium">Archived chats</h4>
          <p className="text-sm text-gray-600">View and manage archived chat conversations.</p>
        </div>
        {renderButton("Manage")}
      </div>

      {/* Archive all */}
      <div className="flex items-center justify-between border p-4 rounded-xl">
        <div>
          <h4 className="font-medium">Archive all</h4>
          <p className="text-sm text-gray-600">Move all chats to archive.</p>
        </div>
        {renderButton("Archive all")}
      </div>

      {/* Delete all chats */}
      <div className="flex items-center justify-between border p-4 rounded-xl">
        <div>
          <h4 className="font-medium text-red-600">Delete all chats</h4>
          <p className="text-sm text-gray-600">Permanently delete all chat history.</p>
        </div>
        {renderButton("Delete all", "red")}
      </div>

      {/* Export data */}
      <div className="flex items-center justify-between border p-4 rounded-xl">
        <div>
          <h4 className="font-medium">Export data</h4>
          <p className="text-sm text-gray-600">
            Download your data in a portable format for backup or analysis.
          </p>
        </div>
        {renderButton("Export")}
      </div>
    </div>
  );
}
