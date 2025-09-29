"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  color?: string;
  badge?: string;
}

interface QuickActionGridProps {
  title: string;
  description?: string;
  actions: QuickAction[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function QuickActionGrid({
  title,
  description,
  actions,
  columns = 4,
  className = "",
}: QuickActionGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
        {description && <p className="text-gray-600">{description}</p>}
      </div>

      <div className={`grid ${gridCols[columns]} gap-4`}>
        {actions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card
              className={`
              hover:shadow-md transition-all duration-300 cursor-pointer h-full
              ${action.color || "hover:border-primary/20"}
            `}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {action.icon}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    {action.badge && (
                      <Badge variant="outline" className="text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
