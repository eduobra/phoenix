"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SecuritySettings() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignOutAll = () => {
    setModalVisible(true);
  };

  const confirmSignOutAll = () => {
    setModalVisible(false);
    // Call backend logic to sign out from all devices here
    alert("Signed out from all devices.");
  };

  return (
    <div className="space-y-6">
      {/* --- Section Header --- */}
      <div>
        <p className="text-sm text-card-foreground-500 dark:text-card-foreground-400">
          Manage your login protection, devices, and trusted sessions.
        </p>
      </div>

      {/* --- Multi-Factor Authentication --- */}
      <Card className="rounded-2xl border border-gray-200 dark:border-gray-700">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4">
          <div>
            <h3 className="font-medium text-card-foreground-900 dark:text-card-foreground-100">
              Password Reset / MFA
            </h3>
            <p className="text-sm text-card-foreground-500 dark:text-card-foreground-400 max-w-md">
              Standard secure login flows
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-full px-5 py-1.5 text-sm text-red-600"
          >
            Reset Password
          </Button>
        </CardContent>
      </Card>

      {/* --- Trusted Devices --- */}
      <Card className="rounded-2xl border border-gray-200 dark:border-gray-700">
        <CardContent className="space-y-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h3 className="font-medium text-card-foreground-900 dark:text-card-foreground-100">
                Device Sign-Out
              </h3>
              <p className="text-sm text-card-foreground-500 dark:text-card-foreground-400 max-w-md">
                Sign out from all devices
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-sm text-card-foreground-600 dark:text-card-foreground-400">
              Log out of this device
            </span>
            <Button   onClick={handleSignOutAll} className="rounded-full px-5 py-1.5 text-sm">
              Sign out from all devices
            </Button>
            {/* <Button
              className="rounded-full px-5 py-1.5 text-sm text-red-600 border border-red-500 hover:bg-red-50"
              onClick={handleSignOutAll}
            >
              Sign out from all devices
            </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* --- Secure sign-in --- */}
      <Card className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-card-50 dark:bg-card-800">
        <CardContent className="py-5">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
            <h3 className="font-medium text-card-foreground-900 dark:text-card-foreground-100">
              Access Log (Last Login)
            </h3>
          </div>
          <p className="text-sm text-card-foreground-500 dark:text-card-foreground-400">
            Show last login date & IP location
          </p>

          <div className="mt-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-background dark:bg-card-900">
            <p className="text-sm text-card-foreground-500 dark:text-card-foreground-400">
              You haven’t used Ascent Ai to sign into any websites or apps yet.
              Once you do, they’ll show up here.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* --- Modal for Sign out all devices --- */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 text-center space-y-4">
            <h2 className="text-lg font-medium">Confirm Sign Out</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to sign out from all devices? This will log you out everywhere.
            </p>
            <div className="flex justify-center gap-3 mt-2">
              <button
                onClick={() => setModalVisible(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:opacity-90 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSignOutAll}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:opacity-90 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
