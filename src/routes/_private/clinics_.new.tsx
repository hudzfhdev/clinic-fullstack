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
import { HospitalIcon, HouseIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "#/orpc/client";
import { sanitizeForm } from "#/utils/common";
import { states } from "#/libs/address";
import { AppPageLayout } from "#/components/app-layouts.tsx";
import { zClinicCreateSchema } from "#/isomorphic/schema/clinics.schema.ts";
import type { ClinicCreateSchema } from "#/isomorphic/schema/clinics.schema.ts";

export const Route = createFileRoute("/_private/clinics_/new")({
  component: RouteComponent,
  head: () => ({ meta: [{ title: "New Clinic" }] }),
  errorComponent: ErrorComponent,
});

const statesOptions = states.map((v) => ({ label: v.state, value: v.state }));

function RouteComponent() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const clinicsMutation = useMutation(
    orpc.createClinic.mutationOptions({
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
      name: "",
      status: "active",
      address: {
        address_one: "",
        address_two: "",
        city: "",
        postcode: "",
        state: "",
        note: "",
      },
    } as ClinicCreateSchema,
    onSubmit({ value }) {
      console.log("submitted clinic", value, sanitizeForm(value));
      clinicsMutation.mutate(sanitizeForm(value));
    },
    validators: {
      onChangeAsync: zClinicCreateSchema,
      onSubmitAsync: zClinicCreateSchema,
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
            <div className="mb-3 flex gap-4 items-center">
              <HospitalIcon />
              <Typography type="h3">New Clinic</Typography>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.AppTextField
                    isRequired
                    placeholder="eg: ClinicXYZ"
                    label="Name"
                    variant="secondary"
                  />
                )}
              />
              <form.AppField
                name="status"
                children={(field) => (
                  <field.AppSelectField
                    label="Status"
                    isRequired
                    options={[
                      { label: "Active", value: "active" },
                      { label: "Pending", value: "pending" },
                    ]}
                    variant="secondary"
                  />
                )}
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b py-2 border-b-accent-soft">
                <HouseIcon size={17} />
                <Typography>Address</Typography>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <form.AppField
                  name="address.address_one"
                  children={(field) => (
                    <field.AppTextField
                      label="Address one"
                      isRequired
                      variant="secondary"
                    />
                  )}
                />
                <form.AppField
                  name="address.address_two"
                  children={(field) => (
                    <field.AppTextField
                      label="Address two"
                      variant="secondary"
                    />
                  )}
                />
              </div>
              <div className="grid grid-cols-2 grid-rows-2 gap-4">
                <form.AppField
                  name="address.city"
                  children={(field) => (
                    <field.AppTextField
                      label="City"
                      isRequired
                      variant="secondary"
                    />
                  )}
                />
                <form.AppField
                  name="address.postcode"
                  children={(field) => (
                    <field.AppTextField
                      label="Postcode"
                      isRequired
                      variant="secondary"
                    />
                  )}
                />
                <form.AppField
                  name="address.state"
                  children={(field) => (
                    <field.AppComboBoxField
                      options={statesOptions}
                      label="State"
                      isRequired
                      variant="secondary"
                    />
                  )}
                />
              </div>
            </div>
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
