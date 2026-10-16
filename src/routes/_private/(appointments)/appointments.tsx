import { AppPageLayout } from "#/components/appLayouts.tsx";
import type { Appointment } from "#/isomorphic/schema/appointment.schema.ts";
import { buttonVariants, Surface } from "@heroui/react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/(appointments)/appointments")({
  component: RouteComponent,
});

const KANBAN_COLUMNS: Record<
  Appointment["status"],
  { order: number; label: string }
> = {
  done: { order: 4, label: "Done" },
  in_progress: { order: 3, label: "In Progress" },
  in_queue: { order: 2, label: "In Queue" },
  pending: { order: 1, label: "Pending" },
};

function RouteComponent() {
  return (
    <AppPageLayout className="h-full space-y-4">
      <Link to="/appointments/new" className={buttonVariants()}>
        Create Appointment
      </Link>
      <div className="flex gap-5 h-full">
        {Object.entries(KANBAN_COLUMNS)
          .sort((curr, next) => curr[1].order - next[1].order)
          .map(([k, { label }]) => {
            return (
              <Surface className="grow rounded-4xl flex flex-col" key={k}>
                <div className="p-6 border-b border-b-separator">{label}</div>
                <div className="p-6">Kotak</div>
              </Surface>
            );
          })}
      </div>
    </AppPageLayout>
  );
}
