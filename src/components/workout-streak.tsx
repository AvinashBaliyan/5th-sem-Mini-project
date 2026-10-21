'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { mockPerformanceData } from "@/lib/mock-data";
import { calculateWorkoutStreak } from "@/lib/utils";

export function WorkoutStreak() {
  const [streak, setStreak] = useState(0); 

  useEffect(() => {
    // In a real app, this would come from user data.
    // Here we calculate it based on mock data on the client.
    setStreak(calculateWorkoutStreak(mockPerformanceData));
  }, []);

  return (
    <Card className="bg-gradient-to-r from-orange-500 to-primary text-primary-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame />
          Workout Streak
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Complete an activity every day to keep the flame alive. Don't break the chain!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-baseline gap-4">
        <div className="text-6xl font-bold">{streak}</div>
        <div className="text-2xl font-medium">Days</div>
      </CardContent>
    </Card>
  );
}
