"use client";

import React, { useState } from "react";

const apps = [
  {
    name: "Microsoft Dynamics 365 BC",
    image: "/img/Dynamics_365_Business_Central_logo.svg.png",
    type: "oauth",
    description: "Sign-in via Microsoft account to sync emails / tasks",
  },
  {
    name: "Custom API Connector",
    image: "/img/api.png",
    type: "apikey",
    description: "Allow entry of API key for external systems (e.g., ERP, CRM)",
  },
];

export default function AppsConnectorsContent() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
 const [signedIn, setSignedIn] = useState<Record<string, boolean>>({
  "Microsoft Dynamics 365 BC": !!localStorage.getItem("token"),
});
  const handleSignIn = (appName: string, token?: string) => {
  if (token) {
    localStorage.setItem("token", token); // store token
    setSignedIn((prev) => ({ ...prev, [appName]: true }));
  }
};

  const handleApiKeyChange = (appName: string, value: string) => {
    setApiKeys((prev) => ({ ...prev, [appName]: value }));
  };

  const handleSaveAll = () => {
    // Example: You can send signedIn and apiKeys to API here
    console.log("Saving settings:", { signedIn, apiKeys });
    alert("All changes saved successfully!");
  };

  return (
    <div className="space-y-4 text-card-foreground-800">
      <p className="text-sm text-card-foreground-600">
        Connect apps so you can talk to them with visual and interactive experiences in Ascent AI.{" "}
        <a href="#" className="text-blue-600 hover:underline">Learn more.</a>
      </p>

      <div className="space-y-3">
        {apps.map((app) => (
          <div
            key={app.name}
            className="flex items-center justify-between p-3 border rounded-xl bg-background"
          >
            {/* Icon + Name/Description */}
            <div className="flex items-center gap-3">
              <img
                src={app.image}
                alt={app.name}
                className="w-12 h-12 object-contain rounded-md"
              />
              <div>
                <span className="font-medium text-card-foreground-800">{app.name}</span>
                <p className="text-xs text-card-foreground-600">{app.description}</p>
              </div>
            </div>

            {/* Action */}
           {app.type === "oauth" && (
              <button
                onClick={() => handleSignIn(app.name)}
                className={`px-3 py-1.5 rounded-md text-white ${
                  signedIn[app.name] ? "bg-green-600" : "bg-blue-600"
                } hover:opacity-90 transition`}
              >
                {signedIn[app.name] ? "Connected" : "Connect"}
              </button>
            )}
         
            {app.type === "apikey" && (
              <input
                type="text"
                placeholder="Enter API Key"
                value={apiKeys[app.name] || ""}
                onChange={(e) => handleApiKeyChange(app.name, e.target.value)}
                className="border rounded-md px-2 py-1 text-sm"
              />
            )}
          </div>
        ))}
      </div>

     
    </div>
  );
}
