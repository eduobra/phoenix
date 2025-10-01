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
      <div className="absolute top-20 left-10 animate-bounce">
        <div className="w-3 h-3 rounded-full bg-primary-glow shadow-glow" />
      </div>
      <div className="absolute top-1/3 right-16 animate-pulse">
        <Brain className="w-6 h-6 text-primary-glow" />
      </div>
      <div className="absolute delay-300 bottom-1/3 left-1/4 animate-bounce">
        <Sparkles className="w-4 h-4 text-primary-glow" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl px-6 mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border rounded-full bg-card/10 backdrop-blur-sm border-border/20">
          <Zap className="w-4 h-4 text-primary-glow" />
          <span className="text-sm text-white">Next-Generation AI Technology</span>
        </div>

        <h1 className="mb-6 text-6xl font-bold text-white md:text-8xl">
          <span className="block">Ascent AI</span>
          <span className="block text-transparent bg-gradient-primary bg-clip-text">Agent Suite</span>
        </h1>

        <p className="max-w-3xl mx-auto mb-8 text-xl leading-relaxed text-white md:text-2xl">
          Unleash the power of intelligent automation with our comprehensive AI agent platform. Transform your
          workflows, amplify productivity, and reach new heights of innovation.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link passHref href={"/login"}>
            <Button size="lg" className="transition-all duration-300 bg-gradient-primary hover:shadow-glow group">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="font-semibold text-indigo-500 border-hero-foreground/20 hover:bg-hero-foreground/10"
          >
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 pt-8 mt-16 border-t border-border/20">
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-white">50K+</div>
            <div className="text-sm text-white">Active Users</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-white">99.9%</div>
            <div className="text-sm text-white">Uptime</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-white">24/7</div>
            <div className="text-sm text-white">AI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    icon: Bot,
    title: "Intelligent Agents",
    description: "Deploy smart AI agents that learn, adapt, and execute complex tasks with human-like reasoning.",
  },
  {
    icon: Brain,
    title: "Machine Learning",
    description: "Advanced ML algorithms that continuously improve performance and accuracy over time.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process thousands of requests per second with sub-millisecond response times.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Comprehensive insights and monitoring with beautiful dashboards and reports.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Seamlessly integrate with your existing tools and automate complex workflows.",
  },
  {
    icon: MessageSquare,
    title: "Natural Language",
    description: "Communicate with agents using natural language for intuitive interactions.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Deploy across multiple regions with automatic scaling and load balancing.",
  },
  {
    icon: Clock,
    title: "24/7 Operation",
    description: "Continuous operation with automatic failover and zero-downtime deployments.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="px-6 py-24 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl text-foreground">Powerful AI Capabilities</h2>
          <p className="max-w-3xl mx-auto text-xl text-muted-foreground">
            Our comprehensive suite of AI tools and agents provides everything you need to transform your business
            operations and unlock new possibilities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 transition-all duration-300 bg-gradient-card border-border/50 hover:shadow-card hover:scale-105 group"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-4 transition-all duration-300 rounded-lg bg-gradient-primary group-hover:shadow-glow">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-card-foreground">{feature.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
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
        <h2 className="mb-6 text-4xl font-bold text-white md:text-6xl">
          Ready to Transform
          <span className="block text-transparent bg-gradient-primary bg-clip-text">Your Business?</span>
        </h2>

        <p className="max-w-2xl mx-auto mb-8 text-xl text-white">
          Join thousands of companies already using Ascent AI to automate workflows, boost productivity, and drive
          innovation at scale.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 mb-12 sm:flex-row">
          <Button
            size="lg"
            className="transition-all duration-300 bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:shadow-glow group"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-white border-hero-foreground/20 hover:bg-hero-foreground/10"
          >
            Schedule Demo
          </Button>
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
