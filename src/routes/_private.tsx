import { AppHeader } from "#/components/appLayouts.tsx";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader />
      <Outlet />
    </div>
  );
}
