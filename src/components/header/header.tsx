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
  Menu // <-- hamburger icon
} from "lucide-react";
import { User } from "@/types/user";

type HeaderProps = {
  user?: User | null;
  logout?: () => void;
  toggleSidebar: () => void;
};

export default function Header({ user, logout ,toggleSidebar }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-2">
      
      {/* Sidebar toggle button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="cursor-pointer sm:hidden" // hide on large screens
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Dropdown Menu */}
      <div className="flex items-center space-x-1 w-full justify-center sm:w-auto sm:justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 cursor-pointer">
              ASCENT AI<ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                ASCENT AI Plus
              </div>
              <Button variant="default"  className="h-6 text-xs px-2">
                Upgrade
              </Button>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="mr-2 h-4 w-4" />
                ASCENT AI Standard
              </div>
              <Check className="h-4 w-4 text-green-600" />
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
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
