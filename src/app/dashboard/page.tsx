import { VideoAssessment } from "@/components/video-assessment";
import { WorkoutStreak } from "@/components/workout-streak";

export default function DashboardPage() {
  return (
    <div className="flex-1 p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
          <p className="text-muted-foreground">
            Your central hub for performance, progress, and motivation.
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <WorkoutStreak />
        <VideoAssessment />
      </div>
    </div>
  );
}
