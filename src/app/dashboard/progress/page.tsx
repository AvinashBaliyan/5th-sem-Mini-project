import { ProgressTracker } from "@/components/progress-tracker";

export default function ProgressPage() {
  return (
    <div className="flex-1 p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Progress Tracker</h2>
          <p className="text-muted-foreground">
            Monitor your performance over time with charts and detailed logs.
          </p>
        </div>
      </div>
      <ProgressTracker />
    </div>
  );
}
