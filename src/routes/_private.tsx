import { AppHeader, AppSidebar } from "#/components/app-layouts.tsx";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader>
        <AppSidebar />
      </AppHeader>
      <Outlet />
    </div>
  );
}
