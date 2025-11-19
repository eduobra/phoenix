"use client";

import React, { useState } from "react";

export default function DataControlsContent() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleClearHistory = () => {
    setModalVisible(true);
  };

  const handleConfirmClear = () => {
    // Call backend or logic to clear chat history here
    setModalVisible(false);
    alert("Chat history has been cleared."); // temporary feedback
  };

  const handleDownloadData = () => {
    // Implement export logic here
    alert("Chat data exported successfully.");
  };

  const handleAuditLogPreview = () => {
    // Implement preview logic here
    alert("Session audit log preview generated.");
  };

  const renderButton = (label: string, onClick: () => void, color = "gray") => {
    const base =
      color === "red"
        ? "text-red-600 border-red-500 hover:bg-red-50"
        : "text-card-foreground-700 border-gray-300 hover:bg-card-100";
    return (
      <button
        onClick={onClick}
        className={`border px-4 py-1 rounded-full text-sm font-medium transition-colors ${base}`}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      <div className="space-y-6 text-card-foreground-800">
        {/* Clear Chat History */}
        <div className="flex items-center justify-between border p-4 rounded-xl">
          <div>
            <h4 className="font-medium">Clear Chat History</h4>
            <p className="text-sm text-card-foreground-600">Wipe chat threads for privacy.</p>
          </div>
          {renderButton("Clear", handleClearHistory, "red")}
        </div>

        {/* Download Chat Data */}
        <div className="flex items-center justify-between border p-4 rounded-xl">
          <div>
            <h4 className="font-medium">Download Chat Data</h4>
            <p className="text-sm text-card-foreground-600">Export conversation as .txt or .json.</p>
          </div>
          {renderButton("Export", handleDownloadData)}
        </div>

        {/* Session Audit Log Preview */}
        <div className="flex items-center justify-between border p-4 rounded-xl">
          <div>
            <h4 className="font-medium">Session Audit Log Preview</h4>
            <p className="text-sm text-card-foreground-600">
              Show last 5 AI actions (e.g., “Generated summary”, “Accessed Outlook”)
            </p>
          </div>
          {renderButton("Preview", handleAuditLogPreview)}
        </div>
      </div>

      {/* Modal for Clear Chat History */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 text-center space-y-4">
            <h2 className="text-lg font-medium">Confirm Clear Chat History</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to clear all chat history? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3 mt-2">
              <button
                onClick={() => setModalVisible(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:opacity-90 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:opacity-90 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
