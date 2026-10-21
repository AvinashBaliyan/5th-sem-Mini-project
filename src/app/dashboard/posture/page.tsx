import { PostureCorrection } from "@/components/posture-correction";

export default function PosturePage() {
  return (
    <div className="flex-1 p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Real-time Posture Correction</h2>
          <p className="text-muted-foreground">
            Get instant feedback on your exercise form from our AI Coach.
          </p>
        </div>
      </div>
      <PostureCorrection />
    </div>
  );
}
