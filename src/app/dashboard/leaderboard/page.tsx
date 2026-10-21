import { Leaderboard } from "@/components/leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="flex-1 p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Leaderboard</h2>
          <p className="text-muted-foreground">
            See how you rank among other top athletes.
          </p>
        </div>
      </div>
      <Leaderboard />
    </div>
  );
}
