// CalcIcon — Powered by Lucide React (professional open-source icon library)
// https://lucide.dev — used by shadcn/ui, Vercel, Linear, and thousands of real products

import type { ComponentType } from "react";
import {
  // Calculator cards
  Home, CreditCard, Scale, Briefcase, Sunset, Landmark, Calendar,
  Percent, Building2, Receipt, Heart, Hammer, Calculator, TrendingUp,
  Zap, Car, ShoppingBag,
  // Trust features
  BadgeCheck, ShieldCheck, Lock, Users, Globe, GraduationCap,
  // How it works
  Search, PenLine, BarChart3, Lightbulb,
  // Differentiators
  Sigma, ListOrdered, BookOpen, Compass,
  // VS comparison
  XCircle, CheckCircle2,
  type LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  // ── Calculator section icons ──
  mortgage:             Home,
  emi:                  CreditCard,
  bmi:                  Scale,
  salary:               Briefcase,
  retirement:           Sunset,
  loan:                 Landmark,
  age:                  Calendar,
  percentage:           Percent,
  finance:              Building2,
  tax:                  Receipt,
  health:               Heart,
  construction:         Hammer,
  math:                 Calculator,
  investment:           TrendingUp,
  ev:                   Zap,
  automotive:           Car,
  "compound-interest":  TrendingUp,
  "sales-tax":          ShoppingBag,

  // ── Trust features ──
  verified:             BadgeCheck,
  private:              ShieldCheck,
  lock:                 Lock,
  instant:              Zap,
  users:                Users,
  globe:                Globe,
  graduation:           GraduationCap,

  // ── How it works ──
  search:               Search,
  pen:                  PenLine,
  chart:                BarChart3,
  lightbulb:            Lightbulb,

  // ── Differentiators ──
  formula:              Sigma,
  steps:                ListOrdered,
  examples:             BookOpen,
  insights:             Compass,

  // ── VS comparison ──
  bad:                  XCircle,
  good:                 CheckCircle2,
};

interface CalcIconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export default function CalcIcon({
  name,
  size = 22,
  className = "",
  strokeWidth = 1.75,
}: CalcIconProps) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    />
  );
}
