import {
  createFileRoute,
  useLoaderData,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { orpc } from "#/orpc/client.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sanitizeForm } from "#/utils/common.ts";
import { isDefinedError } from "@orpc/client";
import { Surface, toast } from "@heroui/react";
import { AppPageLayout } from "#/components/appLayouts.tsx";
import { ClinicForm } from "#/components/modules/clinics/clinicForm.tsx";

export const Route = createFileRoute("/_private/(clinics)/clinics_/$id_/edit")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) =>
    queryClient.query(
      orpc.getClinicByID.queryOptions({ input: { clinic_id: params.id } }),
    ),
});

function RouteComponent() {
  const nav = useNavigate();
  const qc = useQueryClient();

  const { id } = useParams({ from: "/_private/(clinics)/clinics_/$id_/edit" });
  const clinicData = useLoaderData({
    from: "/_private/(clinics)/clinics_/$id_/edit",
    strict: true,
  });

  const { mutate, isPending } = useMutation(
    orpc.updateClinicById.mutationOptions({
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
            description: "Clinic has been updated.",
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
        <ClinicForm
          clinicData={clinicData}
          onSubmit={(value) =>
            mutate({
              params: { id },
              body: sanitizeForm({ ...clinicData, ...value }),
            })
          }
          isSubmitting={isPending}
        />
      </Surface>
    </AppPageLayout>
  );
}
