"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function ParentalControlsSection() {
  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div>
        <p className="text-sm text-card-foreground-500">
          Parents and teens can link accounts, giving parents tools to adjust certain
          features, set limits, and add safeguards that work for their family.
        </p>
      </div>

      {/* Add Family Member */}
      <div className="flex items-center justify-between p-4 border rounded-2xl hover:bg-card-50 transition">
        <span className="text-sm text-card-foreground-700">Manage linked accounts and permissions</span>
        <Button className="rounded-full px-5 py-1.5 text-sm">
          Add family member
        </Button>
      </div>
    </div>
  );
}
