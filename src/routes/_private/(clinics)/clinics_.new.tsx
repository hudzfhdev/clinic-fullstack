import {
  createFileRoute,
  ErrorComponent,
  useNavigate,
} from "@tanstack/react-router";
import { Surface, toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "#/orpc/client";
import { sanitizeForm } from "#/utils/common";
import { isDefinedError } from "@orpc/client";
import { AppPageLayout } from "#/components/appLayouts.tsx";
import { ClinicForm } from "#/components/modules/clinics/clinicForm.tsx";

export const Route = createFileRoute("/_private/(clinics)/clinics_/new")({
  component: RouteComponent,
  head: () => ({ meta: [{ title: "New Clinic" }] }),
  errorComponent: ErrorComponent,
  ssr: "data-only",
});

function RouteComponent() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const clinicsMutation = useMutation(
    orpc.createClinic.mutationOptions({
      onSettled: (data, err) => {
        const error = isDefinedError(err);
        if (error) {
          toast.danger(`Error`, {
            description:
              err.message || "Something wrong after form submission.",
          });
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
      <Surface className="w-full md:max-w-2xl xl:max-w-3xl p-6">
        <ClinicForm
          isSubmitting={clinicsMutation.isPending}
          onSubmit={(value) =>
            clinicsMutation.mutate(
              sanitizeForm({
                name: value.name,
                status: value.status,
                start_time: value.start_time,
                end_time: value.end_time,
                address: value.address,
              }),
            )
          }
        />
      </Surface>
    </AppPageLayout>
  );
}
