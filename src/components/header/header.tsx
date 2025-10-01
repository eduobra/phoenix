"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
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
  Menu ,
  AlignHorizontalJustifyStart,
  Equal
} from "lucide-react";
import { User } from "@/types/user";

type HeaderProps = {
  user?: User | null;
  logout?: () => void;
  toggleSidebar: () => void;
};

export default function Header({ user, logout ,toggleSidebar }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-3 py-2">
  {/* Left Section (Equal + Ascent AI on mobile) */}
  <div className="flex items-center sm:hidden">
    {/* Sidebar toggle button */}
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer"
      onClick={toggleSidebar}
    >
      <Equal className="h-5 w-5" />
    </Button>

    {/* Ascent AI dropdown - shown beside Equal only on mobile */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 cursor-pointer ml-1">
          Ascent AI <ChevronDown className="h-4 w-4" />
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
        <p className="text-xs text-gray-500">Our smartest model and more</p>
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
        <p className="text-xs text-gray-500">Great balance of speed and quality</p>
      </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
  </div>

  {/* Ascent AI dropdown - visible on tablet/desktop in center */}
  <div className="hidden sm:flex items-center space-x-1 w-full justify-center sm:w-auto sm:justify-start">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 cursor-pointer">
          Ascent AI <ChevronDown className="h-4 w-4" />
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
        <p className="text-xs text-gray-500">Our smartest model and more</p>
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
        <p className="text-xs text-gray-500">Great balance of speed and quality</p>
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
        <Button variant="ghost" size="icon" className="cursor-pointer">
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
