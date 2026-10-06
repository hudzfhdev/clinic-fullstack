import { AppPageLayout } from "#/components/app-layouts.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AppPageLayout>Hello "/_private/dashboard"!</AppPageLayout>;
}
