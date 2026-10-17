/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
  createFileRoute,
  ErrorComponent,
  useNavigate,
} from "@tanstack/react-router";
import { Surface, toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "#/orpc/client";
import { sanitizeForm } from "#/utils/common";
import { AppPageLayout } from "#/components/appLayouts.tsx";
import {
  AppointmentsForm,
  isCreateForm,
} from "#/components/modules/appointments/appointments-form.tsx";

export const Route = createFileRoute(
  "/_private/(appointments)/appointments_/new",
)({
  component: RouteComponent,
  head: () => ({ meta: [{ title: "New Appointment" }] }),
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation(
    orpc.createAppointment.mutationOptions({
      onSettled: (data, err) => {
        if (err) {
          toast.danger(`Error`, { description: "Something wrong." });
          return;
        }

        if (data) {
          toast.success(`Success`, {
            description: "New clinic has been added.",
          });
          qc.invalidateQueries({ queryKey: orpc.listClinics.queryKey() });
          nav({ to: "/clinics" });
          return;
        }
      },
    }),
  );

  return (
    <AppPageLayout className="grid place-items-center">
      <Surface className="w-full md:max-w-2xl xl:max-w-3xl p-6 rounded-xl shadow-xl">
        <AppointmentsForm
          isMutating={isPending}
          onSubmit={(v) => {
            if (isCreateForm(v)) {
              mutate({ body: sanitizeForm(v) });
            }
          }}
        />
      </Surface>
    </AppPageLayout>
  );
}
