import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SecuritySettings() {
  return (
    <div className="space-y-6">
      {/* --- Section Header --- */}
      <div>
       
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your login protection, devices, and trusted sessions.
        </p>
      </div>

      {/* --- Multi-Factor Authentication --- */}
      <Card className="rounded-2xl border border-gray-200 dark:border-gray-700">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Multi-factor authentication
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Require an extra security challenge when logging in. If you are
              unable to pass this challenge, you will have the option to recover
              your account via email.
            </p>
          </div>
          <input
            type="radio"
            name="mfa"
            className="h-5 w-5 accent-indigo-500"
          />
        </CardContent>
      </Card>

      {/* --- Trusted Devices --- */}
      <Card className="rounded-2xl border border-gray-200 dark:border-gray-700">
        <CardContent className="space-y-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Trusted Devices
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                When you sign in on another device, it will be added here and
                can automatically receive device prompts for signing in.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Log out of this device
            </span>
            <Button className="rounded-full px-5 py-1.5 text-sm">
              Log out
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Log out of all devices
            </span>
            <Button
              variant="outline"
              className="rounded-full px-5 py-1.5 text-sm text-red-600"
            >
              Log out all
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- Secure sign-in --- */}
      <Card className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <CardContent className="py-5">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Secure sign in with Ascent Ai
            </h3>
            <p className="text-sm text-indigo-600 hover:underline cursor-pointer">
              Learn more
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sign in to websites and apps across the internet with the trusted
            security of Ascent Ai.
          </p>

          <div className="mt-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You haven’t used Ascent Ai to sign into any websites or apps yet.
              Once you do, they’ll show up here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
