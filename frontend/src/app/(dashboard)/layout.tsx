import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full relative bg-white dark:bg-black overflow-hidden">

      <AppSidebar />
      <div className="flex flex-col w-full relative z-10">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-end border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-4 lg:px-8 shadow-sm">
            <ThemeToggle />
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
