import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Surface, toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "#/orpc/client";
import { sanitizeForm } from "#/utils/common";
import { AppPageLayout } from "#/components/appLayouts.tsx";
import { RouteErrorComponent } from "#/components/routeErrorComponent.tsx";
import { isDefinedError } from "@orpc/client";
import { PractitionerForm } from "#/components/modules/practitioners/practitionerForm.tsx";

export const Route = createFileRoute(
  "/_private/(practitioners)/practitioners_/new",
)({
  component: RouteComponent,
  errorComponent: RouteErrorComponent,
  ssr: "data-only",
});

function RouteComponent() {
  const nav = useNavigate();
  const qc = useQueryClient();

  const practitionerMutation = useMutation(
    orpc.createPractitioner.mutationOptions({
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
            description: "New practitioner has been added.",
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
          isMutating={practitionerMutation.isPending}
          onSubmit={(v) => practitionerMutation.mutate(sanitizeForm(v))}
        />
      </Surface>
    </AppPageLayout>
  );
}
