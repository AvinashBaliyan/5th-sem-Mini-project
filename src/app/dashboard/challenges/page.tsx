import { CommunityChallenges } from "@/components/community-challenges";

export default function ChallengesPage() {
  return (
    <div className="flex-1 p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Community Challenges</h2>
          <p className="text-muted-foreground">
            Compete with fellow athletes and push your limits together.
          </p>
        </div>
      </div>
      <CommunityChallenges />
    </div>
  );
}
