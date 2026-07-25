// CalcIcon — Powered by Lucide React (professional open-source icon library)
// https://lucide.dev — used by shadcn/ui, Vercel, Linear, and thousands of real products

import type { ComponentType } from "react";
import {
  Home,
  CreditCard,
  Scale,
  Briefcase,
  Sunset,
  Landmark,
  Calendar,
  Percent,
  Building2,
  Receipt,
  Heart,
  Hammer,
  Calculator,
  TrendingUp,
  Zap,
  Car,
  ShoppingBag,
  type LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  mortgage:            Home,
  emi:                 CreditCard,
  bmi:                 Scale,
  salary:              Briefcase,
  retirement:          Sunset,
  loan:                Landmark,
  age:                 Calendar,
  percentage:          Percent,
  finance:             Building2,
  tax:                 Receipt,
  health:              Heart,
  construction:        Hammer,
  math:                Calculator,
  investment:          TrendingUp,
  ev:                  Zap,
  automotive:          Car,
  "compound-interest": TrendingUp,
  "sales-tax":         ShoppingBag,
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
