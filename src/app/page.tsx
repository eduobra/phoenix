import { Button } from "@/components/ui/button";

import { CheckCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  Bot,
  Brain,
  Zap,
  Shield,
  BarChart3,
  Workflow,
  MessageSquare,
  Globe,
  Clock,
  ArrowRight,
  Sparkles,
  Network,
  EarthLock,
 BrainCircuit,
 TowerControl,
 ShieldCheck,
 MessageCircleMore
} from "lucide-react";
import Link from "next/link";
import ChatbotWidget from "@/components/ui/ChatbotWidget";

const benefits = ["Free 14-day trial", "No setup fees", "Cancel anytime", "24/7 support included"];

const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-dark">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={"/banner.jpg"} alt="AI Technology Background" className="object-cover w-full h-full opacity-20" />
        <div className="absolute inset-0 bg-gradient-dark opacity-80" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-30 left-10 animate-bounce">
        <div className="w-3 h-3 rounded-full bg-primary-glow shadow-glow" />
      </div>
      <div className="absolute top-1/6 right-13  animate-pulse">
        <Brain className="w-6 h-6 text-primary-glow" />
      </div>
      <div className="absolute delay-300 bottom-1/3 left-1/4 animate-bounce">
        <Sparkles className="w-4 h-4 text-primary-glow" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl px-6 mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/10 from-[#6366F1] to-[#8B5CF6] backdrop-blur-sm">
            <Zap className="w-4 h-4 text-[#6366F1]" />
            <span className="text-xs font-medium bg-gradient-to-r text-white bg-clip-text ">
              Empowering Decision-Driven Enterprises
            </span>
        </div>
         <h1 className="mb-6 text-6xl font-light text-[3rem]  text-white md:text-8xl">
          <span className="block">Ascent AI</span>
          <span className="block text-transparent bg-gradient-primary bg-clip-text">
            Agent Suite
          </span>
        </h1>

       <p className="max-w-3xl mx-auto mb-8 text-xl md:text-2xl leading-relaxed font-normal text-[#777c81] [line-height:1.5em]">
        Unleash a new era of intelligent decision-making.<br /><br />
        Ascent AI empowers your Finance, Sales, and Logistics teams with AI-driven advisers
        that analyze data, deliver insights, and recommend the best actions in real time.<br /><br />
        Transform your workforce into proactive decision-makers — faster, smarter, and always
        ahead.
      </p>

       <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        {/* Primary CTA — Start Free Trial */}
        <Link href="/login" passHref className="w-full sm:w-48">
          <Button
            size="lg"
            className="w-full transition-all duration-300 text-white font-semibold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:brightness-110 hover:shadow-lg group"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>

        {/* Secondary CTA — Watch Overview Video */}
        <Link href="/promo-video" passHref className="w-full sm:w-48">
          <Button
            variant="ghost"
            size="lg"
            className="w-full font-semibold text-white border border-white hover:brightness-110 hover:bg-white transition-all duration-300"
          >
            Watch Overview Video
          </Button>
        </Link>
      </div>



        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 pt-8 mt-16 border-t border-border/20">
          <div className="text-center">
            <div className="text-3xl font-medium text-[#6B7280]">500+</div>
            <div className="text-sm font-normal text-[#6B7280] leading-snug">
              Business<br />
              Workflows<br />
              Automated
            </div>
          </div>
          <div className="text-center">
              <div className="text-3xl font-medium text-[#6B7280]">99.9%</div>
              <div className="text-sm font-normal text-[#6B7280] leading-snug">
                Uptime
              </div>
          </div>
          <div className="text-center">
               <div className="text-3xl font-medium text-[#6B7280]">24/7</div>
                <div className="text-sm font-normal text-[#6B7280] leading-snug">
                AI-Powered<br />
                Support
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    icon: Brain,
    title: "Intelligent Agents",
    description: " AI that adapts, reasons, and acts. Deploy cognitive agents that learn your processes, execute tasks, and provide real-time recommendations with human-like understanding.",
  },
  {
    icon: Network,
    title: "Autonomous Reasoning",
    description: "AI that thinks beyond automation. Each agent understands context, evaluates outcomes, and acts on data-driven reasoning to guide your teams toward the best business decisions.",
  },
  {
    icon: EarthLock,
    title: "Multi-Agent Collaboration",
    description: "Specialized AI agents work together — sharing intelligence and coordinating tasks across Finance, Sales, and Logistics — ensuring synchronized decisions across departments.",
  },
  {
    icon: BrainCircuit,
    title: "Knowledge-Driven Insights",
    description: "Agents continuously learn from your enterprise data, documents, and user interactions — turning collective knowledge into actionable intelligence that evolves over time.",
  },
  {
    icon: TowerControl,
    title: "Dynamic Orchestration",
    description: "Tasks and actions are intelligently assigned, sequenced, and executed across systems — adapting in real time as business priorities shift.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description: "Bank-level encryption with compliance to <strong>SOC 2</strong>, <strong>GDPR</strong>, and <strong>HIPAA</strong> standards — ensuring every transaction and dataset remains fully protected.",
  },
  {
    icon: MessageCircleMore,
    title: "Natural Language Understanding",
    description: "Communicate naturally with your agents. Use simple language to query data, generate reports, and trigger workflows — no coding required.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Deploy seamlessly across multiple regions with automatic scaling, redundancy, and zero-downtime updates — built for global operations.",
  },
  {
    icon: Clock,
    title: "24/7 Operation",
    description: "Enjoy continuous uptime and self-healing operations. Agents proactively monitor, recover, and optimize processes — ensuring your digital workforce never sleeps.",
  },
];

const FeaturesSection = () => {
  return (
   
      <div className="mx-auto max-w-7xl">
      <section className="py-20 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="mb-6 text-4xl md:text-5xl font-bold text-[#111827]">
            Powerful AI Agents Capabilities
          </h2>
          <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed">
            Discover the intelligence behind Ascent AI Agents — a suite of autonomous agents that 
            think, reason, and collaborate to drive smarter decisions and operational excellence.
          </p>
        </div>
      </section>


       <section className="pb-10 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-start p-8 h-full text-center rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-lg ">
                    <feature.icon className="w-8 h-8 text-[#6C63FF]" />
                  </div>
                  <h3 className="mb-3 text-[1.25rem] font-semibold text-[#111827]">
                    {feature.title}
                  </h3>
                  <p
                    className="leading-relaxed text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: feature.description }}
                  ></p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
  );
};

const CTASection = () => {
  return (
    <section className="relative px-6 py-24 overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 w-64 h-64 rounded-full left-1/4 bg-primary-glow blur-3xl" />
        <div className="absolute bottom-0 rounded-full right-1/4 w-96 h-96 bg-accent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
         <div className="max-w-4xl mx-auto px-4">
            <h2 className="mb-6 text-[2.5rem] font-bold leading-tight text-white">
              Ready to Transform Your Business with{" "}
              <span className="block bg-gradient-to-r from-[#312E81] to-[#4F46E5] bg-clip-text text-transparent">
                Agentic AI?
              </span>
            </h2>

        <p className="max-w-2xl mx-auto my-8 text-[1.25rem] font-normal text-[#E5E7EB] leading-relaxed">
          Start your journey with <strong>Ascent AI Agent Suite</strong> — the self-exploration platform that 
          empowers Finance, Sales, and Logistics teams with intelligent digital advisers. Discover how 
          autonomous agents can help you work smarter, decide faster, and deliver more impact.
        </p>

          </div>
        <div className="flex flex-col items-center justify-center mt-12 space-y-6 mb-12">
          {/* Primary Button */}
          <Button
            size="lg"
            className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:brightness-110 hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] group"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>

          {/* Optional "Learn More" link */}
          <a
            href="#features"
            className="text-sm text-[#E0E7FF]/80 hover:text-[#E0E7FF] underline-offset-4 hover:underline transition-all duration-200"
          >
            Learn More About Ascent AI →
          </a>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-white">
              <CheckCircle className="flex-shrink-0 w-5 h-5 text-primary-glow" />
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
       <ChatbotWidget />
    </div>
  );
};

export default Index;
