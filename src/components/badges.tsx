'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockBadgesData } from "@/lib/mock-data";
import { CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import * as LucideIcons from 'lucide-react';
import React from 'react';

export function Badges() {
    
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    const rotateX = (y / height - 0.5) * -25; // Increase tilt for more depth
    const rotateY = (x / width - 0.5) * 25;

    e.currentTarget.style.setProperty('--rotate-x', `${rotateX}deg`);
    e.currentTarget.style.setProperty('--rotate-y', `${rotateY}deg`);
    e.currentTarget.style.setProperty('--glow-x', `${(x / width) * 100}%`);
    e.currentTarget.style.setProperty('--glow-y', `${(y / height) * 100}%`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rotate-x', '0deg');
    e.currentTarget.style.setProperty('--rotate-y', '0deg');
  };

  return (
    <Card className="[perspective:800px] bg-transparent border-0 shadow-none">
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>Badges you've earned and ones you can unlock.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mockBadgesData.map((badge) => {
          // @ts-ignore
          const Icon = LucideIcons[badge.icon] || LucideIcons.Award;
          return (
            <div
              key={badge.id}
              className={cn(
                "ar-badge group relative flex flex-col items-center justify-center space-y-3 rounded-xl border p-6 text-center transition-all duration-300 ease-out",
                "[transform-style:preserve-3d] [transform:rotateX(var(--rotate-x,0))_rotateY(var(--rotate-y,0))]",
                "hover:[transform:scale(1.05)_rotateX(var(--rotate-x,0))_rotateY(var(--rotate-y,0))] hover:z-10",
                badge.isEarned 
                  ? "border-primary/30 bg-primary/5 shadow-lg shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20" 
                  : "border-border bg-muted/30"
              )}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={cn(
                  "ar-badge-glow absolute inset-0 rounded-xl transition-opacity duration-500",
                  "bg-[radial-gradient(circle_at_var(--glow-x)_var(--glow-y),hsl(var(--primary)/0.15),transparent_40%)]",
                  "opacity-0 group-hover:opacity-100"
                )}
              />

              {badge.isEarned ? (
                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-green-500" />
              ) : (
                <Lock className="absolute top-3 right-3 h-5 w-5 text-muted-foreground" />
              )}
              <div
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-full transition-colors",
                  "transform-gpu [transform:translateZ(20px)]", // Pop out the icon
                  badge.isEarned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-10 w-10" />
              </div>
              <div className="space-y-1 transform-gpu [transform:translateZ(10px)]">
                <h3 className={cn("font-semibold text-lg", badge.isEarned ? 'text-foreground' : 'text-muted-foreground')}>
                  {badge.name}
                </h3>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
               <div
                className={cn(
                  "ar-badge-sheen absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500",
                  "bg-[linear-gradient(-45deg,transparent_40%,rgba(255,255,255,0.15)_50%,transparent_60%)]",
                  "bg-[length:300%_100%] bg-[position:200%_0]",
                  "group-hover:opacity-100 group-hover:bg-[position:-20%_0] group-hover:transition-[background-position] group-hover:duration-1000"
                )}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
