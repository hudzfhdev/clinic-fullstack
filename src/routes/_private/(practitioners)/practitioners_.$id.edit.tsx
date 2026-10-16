import { AppPageLayout } from "#/components/appLayouts.tsx";
import { PractitionerForm } from "#/components/modules/practitioners/practitionerForm.tsx";
import { orpc } from "#/orpc/client.ts";
import { sanitizeForm } from "#/utils/common.ts";
import { Surface, toast } from "@heroui/react";
import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_private/(practitioners)/practitioners_/$id/edit",
)({
  component: RouteComponent,
  ssr: "data-only",
  loader: ({ params, context: { queryClient } }) => {
    return queryClient.query(
      orpc.getPractitionerByID.queryOptions({ input: { id: params.id } }),
    );
  },
});

function RouteComponent() {
  const practitionerData = useLoaderData({
    from: "/_private/(practitioners)/practitioners_/$id/edit",
  });
  const nav = useNavigate();
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation(
    orpc.updatePractitionerById.mutationOptions({
      onSettled: (data, err) => {
        const narrowedError = isDefinedError(err);
        if (narrowedError) {
          toast.danger(`Error`, {
            description: err.message || "Something wrong...",
          });
          return;
        }
        if (data) {
          toast.success(`Success`, {
            description: "Practitioner data has been updated.",
          });
          qc.invalidateQueries({ queryKey: orpc.listPractitioners.queryKey() });
          nav({ to: "/practitioners" });
          return;
        }
      },
    }),
  );

  return (
    <AppPageLayout className="grid place-items-center">
      <Surface className="w-full md:max-w-2xl xl:max-w-3xl p-6">
        <PractitionerForm
          isMutating={isPending}
          onSubmit={(value) => {
            mutate({
              params: { id: practitionerData.id },
              body: sanitizeForm(value),
            });
          }}
          practitionerData={practitionerData}
        />
      </Surface>
    </AppPageLayout>
  );
}
