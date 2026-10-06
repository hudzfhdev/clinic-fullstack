import { Sidebar } from "#/components/app-layouts.tsx";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between p-3 shadow-md">
        <Sidebar />
      </header>
      <Outlet />
    </div>
  );
}
