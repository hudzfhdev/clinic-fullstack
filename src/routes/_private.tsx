import { Header, Sidebar } from "#/components/app-layouts.tsx";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col h-full">
      <Header>
        <Sidebar />
      </Header>
      <Outlet />
    </div>
  );
}
