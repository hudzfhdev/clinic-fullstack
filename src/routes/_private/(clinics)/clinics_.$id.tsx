import { AppPageLayout } from "#/components/appLayouts.tsx";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/(clinics)/clinics_/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppPageLayout>
      <Outlet />
    </AppPageLayout>
  );
}
