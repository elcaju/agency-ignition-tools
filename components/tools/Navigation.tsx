"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tools = [
  { name: "Formatter", href: "/formatter", icon: "🧹" },
  { name: "TAM Calculator", href: "/tam-calculator", icon: "📈" },
  { name: "ROI Calculator", href: "/roi-calculator", icon: "💰" },
  { name: "Copywriter", href: "/copywriter", icon: "✍️" },
  { name: "Market Researcher", href: "/market-researcher", icon: "🔍" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-foreground">
            Agency Ignition Tools
          </Link>
          <div className="flex gap-2">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <Button
                  variant={pathname === tool.href ? "default" : "ghost"}
                  className="gap-2"
                >
                  <span>{tool.icon}</span>
                  <span className="hidden sm:inline">{tool.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

