
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dailyYogaPoses, type YogaPose } from '@/lib/yoga-poses';
import { cn } from '@/lib/utils';
import React from 'react';
import Image from 'next/image';

interface DailyYogaSessionProps {
  pose?: YogaPose;
}

export function DailyYogaSession({ pose: suggestedPose }: DailyYogaSessionProps) {
  const [dayIndex, setDayIndex] = useState<number | null>(null);

  useEffect(() => {
    // This runs only on the client, preventing hydration mismatch
    setDayIndex(new Date().getDay());
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    const rotateX = (y / height - 0.5) * -15; 
    const rotateY = (x / width - 0.5) * 15;

    e.currentTarget.style.setProperty('--rotate-x', `${rotateX}deg`);
    e.currentTarget.style.setProperty('--rotate-y', `${rotateY}deg`);
    e.currentTarget.style.setProperty('--glow-x', `${(x / width) * 100}%`);
    e.currentTarget.style.setProperty('--glow-y', `${(y / height) * 100}%`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rotate-x', '0deg');
    e.currentTarget.style.setProperty('--rotate-y', '0deg');
  };

  const pose = suggestedPose || (dayIndex !== null ? dailyYogaPoses[dayIndex] : null);

  if (!pose) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pose of the Day</CardTitle>
          <CardDescription>A moment of calm and focus.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
           <div className="animate-pulse rounded-md bg-muted w-full h-full" />
        </CardContent>
      </Card>
    );
  }
  
  const title = suggestedPose ? `Suggested Pose: ${pose.name}` : `Pose of the Day: ${pose.name}`;

  return (
    <div className="[perspective:900px]">
        <Card
            className={cn(
                "group transition-all duration-300 ease-out",
                "[transform-style:preserve-3d] [transform:rotateX(var(--rotate-x,0))_rotateY(var(--rotate-y,0))]",
                "hover:[transform:scale(1.05)_rotateX(var(--rotate-x,0))_rotateY(var(--rotate-y,0))] hover:z-10"
            )}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
        <div
            className={cn(
                "ar-badge-glow absolute inset-0 rounded-lg transition-opacity duration-500",
                "bg-[radial-gradient(circle_at_var(--glow-x)_var(--glow-y),hsl(var(--primary)/0.1),transparent_40%)]",
                "opacity-0 group-hover:opacity-100"
            )}
        />
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>A moment of calm and focus.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div 
              className="aspect-video relative rounded-lg overflow-hidden border transform-gpu [transform:translateZ(10px)] bg-muted"
            >
              <Image
                src={pose.imageUrl}
                alt={`Illustration of ${pose.name}`}
                fill
                className="object-cover"
                data-ai-hint={pose.imageHint}
              />
            </div>
            <p className="text-sm text-muted-foreground transform-gpu [transform:translateZ(5px)]">
            {pose.description}
            </p>
        </CardContent>
         <div
            className={cn(
                "ar-badge-sheen absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500",
                "bg-[linear-gradient(-45deg,transparent_40%,rgba(255,255,255,0.1)_50%,transparent_60%)]",
                "bg-[length:300%_100%] bg-[position:200%_0]",
                "group-hover:opacity-100 group-hover:bg-[position:-20%_0] group-hover:transition-[background-position] group-hover:duration-1000"
            )}
            />
        </Card>
    </div>
  );
}
