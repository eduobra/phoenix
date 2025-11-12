"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Archive,
  FileBarChart,
  Trash2,
  Share2,
  ChevronDown,
  Bot,
  Zap,
  Check,
  Equal,
  X,
} from "lucide-react";
import { User } from "@/types/user";

type HeaderProps = {
  user?: User | null;
  logout?: () => void;
  toggleSidebar: () => void;
};

export default function Header({ user, logout, toggleSidebar }: HeaderProps) {
  const [showUpgrade, setShowUpgrade] = useState(true);

  return (
    <header className="flex items-center justify-between border-b bg-background px-3 py-2 ">
      {/* Left Section (mobile: menu + company dropdown) */}
      <div className="flex items-center sm:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          onClick={toggleSidebar}
        >
          <Equal className="h-5 w-5" />
        </Button>

        {/* Company dropdown on mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 cursor-pointer ml-1"
            >
              yGen Innovations <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {/* Item 1 */}
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Zap className="mr-2 h-4 w-4" />
                  <span>Ascent AI Plus</span>
                </div>
                <Button variant="default" className="h-6 text-xs px-2">
                  Upgrade
                </Button>
              </div>
              <p className="text-xs text-card-foreground-500">
                Our smartest model and more
              </p>
            </DropdownMenuItem>

            {/* Item 2 */}
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Bot className="mr-2 h-4 w-4" />
                  <span>Ascent AI Standard</span>
                </div>
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xs text-card-foreground-500">
                Great balance of speed and quality
              </p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center Section — Upgrade Promo */}
     {showUpgrade && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-blue-800 text-gray-100 px-3 py-1.5 rounded-full shadow-md space-x-2 animate-fade-in">
            {/* Small text labels */}
            <span className="hidden sm:inline text-xs font-medium">
              🚀 Upgrade to Pro
            </span>
            <span className="sm:hidden text-xs font-medium">
              🚀 Upgrade
            </span>

            {/* Upgrade button */}
            <Button
              variant="secondary"
              size="sm"
              className="h-6 text-xs font-semibold px-2 rounded-full bg-white text-blue-800 hover:bg-gray-100"
              aria-label="Upgrade plan"
            >
              Upgrade
            </Button>

            {/* Close button */}
            <button
              onClick={() => setShowUpgrade(false)}
              aria-label="Close upgrade banner"
              className="ml-1 text-gray-200 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}


      {/* Ascent AI dropdown (desktop view) */}
      <div className="hidden sm:flex items-center space-x-1 w-full justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 cursor-pointer font-bold"
            >
              Ascent AI by yGen Innovations
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {/* Item 1 */}
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Zap className="mr-2 h-4 w-4" />
                  <span>Ascent AI Plus</span>
                </div>
                <Button variant="default" className="h-6 text-xs px-2">
                  Upgrade
                </Button>
              </div>
              <p className="text-xs text-card-foreground-500">
                Our smartest model and more
              </p>
            </DropdownMenuItem>

            {/* Item 2 */}
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Bot className="mr-2 h-4 w-4" />
                  <span>Ascent AI Standard</span>
                </div>
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xs text-card-foreground-500">
                Great balance of speed and quality
              </p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="cursor-pointer">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              aria-label="More options"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              <Archive className="mr-2 h-4 w-4" /> Archive
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <FileBarChart className="mr-2 h-4 w-4" /> Report
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
