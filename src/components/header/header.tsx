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
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

type HeaderProps = {
  user?: User | null;
  logout?: () => void;
  toggleSidebar: () => void;
};

type Plan = {
  name: string;
  price: string;
  description: string[];
  cta: string;
  tag?: string;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "₱0 / month",
    description: [
      "Intelligence for everyday tasks",
      "Access to Ascent Ai yGen Innovations",
      "Limited file uploads",
      "Limited and slower image generation",
      "Limited memory and context",
      "Limited deep research",
      "Have an existing plan? See billing help",
    ],
    cta: "Start Free",
  },
  {
    name: "Go",
    price: "₱300 / month (inclusive of VAT)",
    description: [
      "Expanded access to Ascent Ai",
      "Expanded messaging and uploads",
      "Expanded and faster image creation",
      "Longer memory and context",
      "Limited deep research",
      "Projects, tasks, custom GPTs",
      "Only available in certain regions. Limits apply",
    ],
    cta: "Upgrade to Go",
    tag: "NEW",
  },
  {
    name: "Plus",
    price: "₱1,100 / month (inclusive of VAT)",
    description: [
      "Ascent Ai with advanced reasoning",
      "Expanded messaging and uploads",
      "Expanded and faster image creation",
      "Expanded memory and context",
      "Expanded deep research and agent mode",
      "Projects, tasks, custom Ascent Ai",
      "Sora video generation",
      "Codex agent",
      "Limits apply",
    ],
    cta: "Get Plus",
  },
  {
    name: "Pro",
    price: "₱9,990 / month (inclusive of VAT)",
    description: [
      "Ascent Ai with pro reasoning",
      "Unlimited messages and uploads",
      "Unlimited and faster image creation",
      "Maximum memory and context",
      "Maximum deep research and agent mode",
      "Expanded projects, tasks, and custom Ascent Ai",
      "Expanded Sora video generation",
      "Expanded, priority-speed Codex agent",
      "Research preview of new features",
      "Unlimited subject to abuse guardrails. Learn more",
    ],
    cta: "Get Pro",
  },
];

export default function Header({ user, logout, toggleSidebar }: HeaderProps) {
  const [showUpgrade, setShowUpgrade] = useState(true);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const handleUpgradeClick = () => setShowPricingModal(true);
  const { t, i18n } = useTranslation();
  
  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-background px-3 py-2 ">
        {/* Left Section */}
        <div className="flex items-center sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={toggleSidebar}
          >
            <Equal className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 cursor-pointer ml-1"
              >
                {t("yGen Innovations")} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem className="flex flex-col items-start gap-1">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="mr-2 h-4 w-4" />
                    <span>{t("Ascent AI Plus")}</span>
                  </div>
                  <Button variant="default" className="h-6 text-xs px-2">
                    {t("Upgrade")}
                  </Button>
                </div>
                <p className="text-xs text-card-foreground-500">
                  {t("Our smartest model and more")}
                </p>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex flex-col items-start gap-1">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <Bot className="mr-2 h-4 w-4" />
                    <span>{t("Ascent AI Standard")}</span>
                  </div>
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-xs text-card-foreground-500">
                  {t("Great balance of speed and quality")}
                </p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Upgrade Banner */}
        {showUpgrade && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-full shadow-lg space-x-2 animate-fade-in">
            <span className="hidden sm:inline text-xs font-medium">
              🚀 {t("Upgrade")}
            </span>
            <span className="sm:hidden text-xs font-medium">🚀 {t("Upgrade")}</span>

            <Button
              variant="secondary"
              size="sm"
              className="h-6 text-xs font-semibold px-2 rounded-full bg-white text-blue-800 hover:bg-gray-100"
              onClick={handleUpgradeClick}
            >
              {t("Upgrade")}
            </Button>

            <button
              onClick={() => setShowUpgrade(false)}
              className="ml-1 text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Desktop Dropdown */}
        <div className="hidden sm:flex items-center space-x-1 w-full justify-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 cursor-pointer font-bold"
              >
                {t("Ascent AI by yGen Innovations")}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem className="flex flex-col items-start gap-1">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="mr-2 h-4 w-4" />
                    <span>{t("Ascent AI Plus")}</span>
                  </div>
                  <Button variant="default" className="h-6 text-xs px-2">
                    {t("Upgrade")}
                  </Button>
                </div>
                <p className="text-xs text-card-foreground-500">
                  {t("Our smartest model and more")}
                </p>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex flex-col items-start gap-1">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <Bot className="mr-2 h-4 w-4" />
                    <span>{t("Ascent AI Standard")}</span>
                  </div>
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-xs text-card-foreground-500">
                  {t("Great balance of speed and quality")}
                </p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="cursor-pointer">
            <Share2 className="mr-2 h-4 w-4" /> {t("Share")}
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
                <Archive className="mr-2 h-4 w-4" /> {t("Archive")}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <FileBarChart className="mr-2 h-4 w-4" /> {t("Report")}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" /> {t("Delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Professional Pricing Modal */}
      <AnimatePresence>
        {showPricingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start overflow-auto py-10 px-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-background rounded-xl w-full max-w-6xl p-8 relative shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setShowPricingModal(false)}
                className="absolute top-5 right-5 text-gray-600 hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>

              <h1 className="text-4xl font-bold mb-12 text-center text-foreground">
                {t("Choose Your Plan")}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`p-6 flex flex-col justify-between rounded-xl shadow-md hover:shadow-2xl transition relative
                      ${plan.name === "Pro" ? "bg-gradient-to-tr from-purple-600 to-blue-600 text-white shadow-2xl scale-105" : "bg-background text-foreground"}
                    `}
                  >
                    <div>
                      <div className="flex items-center mb-4">
                        <h2 className="text-xl font-semibold">{plan.name}</h2>
                        {plan.tag && (
                          <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                            {plan.tag}
                          </span>
                        )}
                      </div>
                      <p className={`text-2xl font-bold mb-4 ${plan.name === "Pro" ? "text-white" : ""}`}>{plan.price}</p>
                      <ul className="mb-6 space-y-2 list-disc list-inside">
                        {plan.description.map((item, index) => (
                          <li key={index} className={plan.name === "Pro" ? "text-white/90" : ""}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      onClick={() => alert(`Selected plan: ${plan.name}`)}
                      className={`mt-auto py-3 px-6 rounded-lg font-semibold transition
                        ${plan.name === "Pro" ? "bg-white text-purple-700 hover:bg-gray-100" : "bg-blue-600 text-white hover:bg-blue-700"}
                      `}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
