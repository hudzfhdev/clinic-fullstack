/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
  createFileRoute,
  ErrorComponent,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useAppForm } from "#/components/forms/forms.util";
import {
  Button,
  buttonVariants,
  Form,
  Surface,
  toast,
  Typography,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "#/orpc/client";
import { sanitizeForm } from "#/utils/common";
import { AppPageLayout } from "#/components/appLayouts.tsx";
import { EntityIcon } from "#/components/entityIcons.tsx";
import { zCreateAppointmentSchema } from "#/isomorphic/schema/appointment.schema.ts";
import type { CreateAppointmentSchema } from "#/isomorphic/schema/appointment.schema.ts";

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
  const clinicsMutation = useMutation(
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

  const form = useAppForm({
    defaultValues: {
      clinic_id: "",
      end_time: "",
      patient_id: "",
      practitioner_id: "",
      room_id: "",
      service_id: "",
      start_time: "",
      status: "pending",
    } as CreateAppointmentSchema,
    onSubmit({ value }) {
      clinicsMutation.mutate(sanitizeForm(value));
    },
    validators: {
      onChangeAsync: zCreateAppointmentSchema,
      onSubmitAsync: zCreateAppointmentSchema,
    },
  });

  return (
    <AppPageLayout className="grid place-items-center">
      <Surface className="w-full md:max-w-2xl xl:max-w-3xl p-6 rounded-xl shadow-xl">
        <form.AppForm>
          <Form
            className="flex flex-col w-full gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(e);
            }}
          >
            <div className="mb-3 flex gap-2 items-center">
              <EntityIcon entity="appointments" />
              <Typography type="h3">New Appointment</Typography>
            </div>

            <div className="flex justify-end gap-2">
              <Link
                to="/appointments"
                className={buttonVariants({ variant: "ghost" })}
              >
                Back
              </Link>
              <Button type="submit">Add</Button>
            </div>
          </Form>
        </form.AppForm>
      </Surface>
    </AppPageLayout>
  );
}
