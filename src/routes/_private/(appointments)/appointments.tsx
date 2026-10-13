import { AppPageLayout } from "#/components/appLayouts.tsx";
import { buttonVariants } from "@heroui/react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/(appointments)/appointments")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppPageLayout>
      <Link to="/appointments/new" className={buttonVariants()}>
        Create Appointment
      </Link>
    </AppPageLayout>
  );
}
