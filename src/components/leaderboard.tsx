'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockLeaderboardData } from "@/lib/mock-data";
import { Crown, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function Leaderboard() {

  const getRankIndicator = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Crown className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Crown className="w-5 h-5 text-orange-600" />;
    return <span className="font-mono">{rank}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Athletes</CardTitle>
        <CardDescription>Based on overall performance score</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Athlete</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLeaderboardData.map((athlete) => (
              <TableRow key={athlete.rank} className={cn(athlete.saiId === 'SAI-98765' && 'bg-primary/10')}>
                <TableCell>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    {getRankIndicator(athlete.rank)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={athlete.avatar} alt={athlete.athleteName} />
                      <AvatarFallback>{athlete.athleteName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{athlete.athleteName}</p>
                      <p className="text-sm text-muted-foreground">{athlete.saiId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-lg">{athlete.score.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
