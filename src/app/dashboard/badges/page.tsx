import { Badges } from "@/components/badges";

export default function BadgesPage() {
  return (
    <div className="flex-1 p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Your Badges</h2>
          <p className="text-muted-foreground">
            Celebrate your achievements and milestones.
          </p>
        </div>
      </div>
      <Badges />
    </div>
  );
}
