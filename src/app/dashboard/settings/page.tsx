import { Settings } from "@/components/settings";

export default function SettingsPage() {
  return (
    <div className="flex-1 p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account and application preferences.
          </p>
        </div>
      </div>
      <Settings />
    </div>
  );
}
