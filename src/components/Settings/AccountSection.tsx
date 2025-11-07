"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Star,
  CreditCard,
  CircleUser,
  LogOut,
  Mail,
  User,
} from "lucide-react";

export default function AccountSection() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const authDataString = localStorage.getItem("authData");
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        const userData = authData?.state?.userData;
        if (userData) {
          setUser({ name: userData.name, email: userData.email });
        }
      } catch (err) {
        console.error("Failed to parse authData from localStorage:", err);
      }
    }
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* --- Account Info --- */}
      <div className="p-4 border rounded-2xl bg-card-50 space-y-3">
        <h2 className="text-lg font-semibold text-card-foreground-900 flex items-center gap-2">
          <User className="w-5 h-5 text-card-foreground-500" /> Account Info
        </h2>
        <InfoItem
          icon={<CircleUser className="text-card-foreground-500" />}
          label="Username"
          value={user?.name || "N/A"}
        />
        <InfoItem
          icon={<Mail className="text-card-foreground-500" />}
          label="Email"
          value={user?.email || "N/A"}
        />
        <InfoItem
          icon={<Star className="text-card-foreground-500" />}
          label="Plan Type"
          value="Free"
        />
      </div>

      {/* --- Upgrade Plan --- */}
      <div className="flex items-center justify-between p-4 border rounded-2xl hover:bg-card-50 transition">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-card-foreground-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-card-foreground-500" /> Upgrade Plan
          </h2>
          <p className="text-sm text-card-foreground-500">
            Access premium features with Pro or Enterprise.
          </p>
        </div>
        <Button className="rounded-full px-5 py-1.5 text-sm">Upgrade</Button>
      </div>

      {/* --- Log Out --- */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between p-4 border rounded-2xl hover:bg-card-50 transition">
          <span className="flex items-center gap-2 text-sm text-card-foreground-700">
            <LogOut className="w-4 h-4 text-card-foreground-500" /> Log Out
          </span>
          <Button
            variant="ghost"
            className="rounded-full px-5 py-1.5 text-sm text-card-foreground-700 border border-card-300 hover:bg-card-100"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-card-100 transition">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm text-card-foreground-500">{label}</span>
        <span className="text-sm font-medium text-card-foreground-900">{value}</span>
      </div>
    </div>
  );
}
