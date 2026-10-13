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
import { zCreateServiceSchema } from "#/isomorphic/schema/services.schema.ts";
import type { CreateServiceSchema } from "#/isomorphic/schema/services.schema.ts";
import { EntityIcon } from "#/components/entityIcons.tsx";
import { PopulateClinicsOptions } from "../(practitioners)/practitioners_.new";
import { toComboBoxOptions } from "#/components/common/appComboBox.tsx";

export const Route = createFileRoute("/_private/(services)/services_/new")({
  component: RouteComponent,
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const serviceMutation = useMutation(
    orpc.createService.mutationOptions({
      onSettled: (data, err) => {
        if (err) {
          toast.danger(`Error`, { description: "Something wrong." });
          return;
        }

        if (data) {
          toast.success(`Success`, {
            description: "New service has been added.",
          });
          qc.invalidateQueries({ queryKey: orpc.listServices.queryKey() });
          nav({ to: "/services" });
          return;
        }
      },
    }),
  );

  const form = useAppForm({
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    defaultValues: {
      name: "",
      clinic_id: "",
      description: "",
    } as CreateServiceSchema,
    onSubmit({ value }) {
      console.log("submitted service form", value, sanitizeForm(value));
      serviceMutation.mutate(sanitizeForm(value));
    },
    validators: {
      onChangeAsync: zCreateServiceSchema,
      onSubmitAsync: zCreateServiceSchema,
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
              <EntityIcon entity="services" />
              <Typography type="h3">New Service</Typography>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.AppTextField
                    isRequired
                    label="Name"
                    variant="secondary"
                  />
                )}
              />
              <PopulateClinicsOptions>
                {({ clinics }) => (
                  <form.AppField
                    name="clinic_id"
                    children={(field) => (
                      <field.AppComboBoxField
                        isRequired
                        variant="secondary"
                        label="Clinic"
                        options={toComboBoxOptions(clinics, {
                          labelKey: "name",
                          valueKey: "id",
                        })}
                      />
                    )}
                  />
                )}
              </PopulateClinicsOptions>
            </div>

            <form.AppField
              name="description"
              children={(field) => (
                <field.AppTextAreaField
                  label="Description"
                  variant="secondary"
                  rows={5}
                />
              )}
            />

            <div className="flex justify-end gap-2">
              <Link
                to="/clinics"
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
