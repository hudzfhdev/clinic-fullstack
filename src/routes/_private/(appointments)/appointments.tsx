import { AppPageLayout } from "#/components/appLayouts.tsx";
import type { Appointment } from "#/isomorphic/schema/appointment.schema.ts";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import { buttonVariants, Kbd, Surface } from "@heroui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useId } from "react";
import type { PropsWithChildren } from "react";

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

const KanbanUI = Object.entries(KANBAN_COLUMNS).sort(
  (curr, next) => curr[1].order - next[1].order,
);

function RouteComponent() {
  return (
    <AppPageLayout className="space-y-4">
      <Link to="/appointments/new" className={buttonVariants()}>
        Create Appointment
      </Link>
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return;
          console.log(event.operation);
        }}
      >
        <div className="flex gap-5 h-full">
          {KanbanUI.map(([status, { label }]) => {
            return (
              <KanbanColumn status={`${status}-${label}`} key={status}>
                <div className="p-6 border-b border-b-separator">{label}</div>
                <div className="p-3">
                  <KanbanCard status={status} />
                </div>
              </KanbanColumn>
            );
          })}
        </div>
      </DragDropProvider>
    </AppPageLayout>
  );
}

function KanbanCard({ status }) {
  const id = useId();
  const { ref } = useDraggable({ id });

  return (
    <div
      className="py-2 px-4 ring rounded-2xl ring-accent h-28 bg-accent-soft"
      ref={ref}
    >
      Appointment Data for <Kbd>{status}</Kbd>
    </div>
  );
}

function KanbanColumn({ children }: PropsWithChildren) {
  const id = useId();
  const { ref } = useDroppable({ id });
  return (
    <Surface ref={ref} className="grow rounded-4xl flex flex-col">
      {children}
    </Surface>
  );
}
