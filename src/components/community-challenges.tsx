'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCommunityChallenges } from "@/lib/mock-data";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Clock, Users, Flame, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function CommunityChallenges() {

  const activeChallenges = mockCommunityChallenges.filter(c => c.status === 'active');
  const completedChallenges = mockCommunityChallenges.filter(c => c.status === 'completed');

  const ChallengeCard = ({ challenge }: { challenge: typeof mockCommunityChallenges[0] }) => {
    const isCompleted = challenge.status === 'completed';
    const progress = isCompleted ? 100 : (challenge.currentProgress / challenge.goal) * 100;
    
    return (
        <Card className={cn("flex flex-col", isCompleted && "bg-muted/40")}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-headline">{challenge.title}</CardTitle>
                    <Badge variant={isCompleted ? "default" : "secondary"} className={cn(isCompleted && "bg-green-600")}>
                      {isCompleted ? <CheckCircle2 className="mr-1 h-4 w-4"/> : <Flame className="mr-1 h-4 w-4"/>}
                      {challenge.status}
                    </Badge>
                </div>
                <CardDescription>{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                        <span className="font-medium">Progress</span>
                        <span className="text-muted-foreground">{challenge.currentProgress.toLocaleString()} / {challenge.goal.toLocaleString()} {challenge.unit}</span>
                    </div>
                    <Progress value={progress} />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{challenge.participants} Participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{isCompleted ? 'Ended' : `${challenge.daysLeft} days left`}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" disabled={isCompleted || challenge.isJoined}>
                    {isCompleted ? "Challenge Ended" : challenge.isJoined ? "You've Joined!" : "Join Challenge"}
                </Button>
            </CardFooter>
        </Card>
    )
  }

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {activeChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
        </div>
      </TabsContent>
      <TabsContent value="completed">
         <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {completedChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
