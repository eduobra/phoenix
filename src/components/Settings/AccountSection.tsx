"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Star,
  MessageSquare,
  Image,
  Brain,
  Search,
  CheckCircle2,
  Info,
  Globe,
  Linkedin,
  Github,
  Mail,
  CircleUserRound,
  Box,
} from "lucide-react";

export default function AccountSection() {
  return (
    <div className="w-full space-y-6">
      {/* Account Upgrade Section */}
      <div className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50 transition">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Get Ascent Ai Pro
          </h2>
          <p className="text-sm text-gray-500">
            Get everything in Free, and more.
          </p>
        </div>
        <Button className="rounded-full px-5 py-1.5 text-sm">Upgrade</Button>
      </div>

      {/* Pro Features List */}
      <div className="p-4 border rounded-2xl bg-gray-50 space-y-3">
        <Feature icon={<Star className="text-yellow-500" />} text="Expanded Access to Ascent Ai Pro" />
        <Feature icon={<MessageSquare className="text-blue-500" />} text="Expanded messaging and uploads" />
        <Feature icon={<Image className="text-pink-500" />} text="Expanded and faster image creation" />
        <Feature icon={<Brain className="text-purple-500" />} text="Longer memory and context" />
        <Feature icon={<Search className="text-green-500" />} text="Limited deep research" />
        <Feature icon={<CheckCircle2 className="text-indigo-500" />} text="Projects, tasks, custom Ascent AIs" />
      </div>

      {/* Delete Account */}
      <div className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50 transition">
        <span className="text-sm text-gray-700">Delete account</span>
        <Button
          variant="ghost"
          className="rounded-full px-5 py-1.5 text-sm text-red-600 border border-red-200 hover:bg-red-50"
        >
          Delete account
        </Button>
      </div>

      {/* Builder Profile Section */}
      <div className="p-4 border rounded-2xl space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Ascent builder profile
          </h3>
          <hr className="my-2 border-gray-200" />
          <p className="text-sm text-gray-600">
            Personalize your builder profile to connect with users of your GPTs.
            These settings apply to publicly shared GPTs.
          </p>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center mt-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
            <Box className="w-8 h-8 text-gray-500" />
          </div>
          <h4 className="font-medium text-gray-800">PlaceholderAscent</h4>
          <div className="flex items-center gap-2 mt-1">
            <CircleUserRound className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">By community builder</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span className="border rounded-full px-3 py-0.5 text-gray-600 bg-gray-100">
              Preview
            </span>
          </div>
        </div>

        {/* Verification Box */}
        <div className="mt-4 p-4 border rounded-2xl bg-white flex items-start gap-3">
          <div className="flex-shrink-0">
            <Info className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-700 font-medium">
              Complete verification to publish GPTs to everyone.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Verify your identity by adding billing details or verifying
              ownership of a public domain name.
            </p>
          </div>
        </div>

        {/* Links Section */}
        <div className="mt-4 p-4 border rounded-2xl bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Globe className="w-5 h-5" />
              <span className="text-sm">Links</span>
            </div>
            <select className="border rounded-full px-3 py-1 text-sm text-gray-600">
              <option>Select a domain</option>
              <option>ascentai.com</option>
              <option>mygpt.dev</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Linkedin className="w-5 h-5 text-blue-600" />
              <span className="text-sm">LinkedIn</span>
            </div>
            <Button className="rounded-full px-5 py-1.5 text-sm">Add</Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </div>
            <Button className="rounded-full px-5 py-1.5 text-sm">Add</Button>
          </div>
        </div>

        <hr className="my-3 border-gray-200" />

        {/* Email Section */}
        <div className="p-4 border rounded-2xl bg-white space-y-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-5 h-5" />
            <span className="text-sm">sample@gmail.com</span>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="accent-blue-600" />
            Receive feedback emails
          </label>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  );
}
