import { YogaLibrary } from "@/components/yoga-library";

export default function YogaPage() {
  return (
    <div className="flex-1 p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Yoga Library</h2>
          <p className="text-muted-foreground">
            Explore and learn various yoga asanas for physical and mental well-being.
          </p>
        </div>
      </div>
      <YogaLibrary />
    </div>
  );
}
