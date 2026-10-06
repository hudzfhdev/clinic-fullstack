import {
  createFileRoute,
  ErrorComponent,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useAppForm } from "#/components/forms/forms.util";
import { Button, buttonVariants, Form, toast, Typography } from "@heroui/react";
import { HospitalIcon, HouseIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "#/orpc/client";
import { sanitizeForm } from "#/utils/common";
import { states } from "#/libs/address";
import { zClinicCreateSchema } from "#/orpc/schema.ts";
import type { ClinicCreateZodSchema } from "#/orpc/schema.ts";
import { AppPageLayout } from "#/components/app-layouts.tsx";

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

        if (data?.data) {
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
    } as ClinicCreateZodSchema,
    onSubmit({ value }) {
      console.log("submitted", value, sanitizeForm(value));
      clinicsMutation.mutate(sanitizeForm(value));
    },
    validators: {
      onChangeAsync: zClinicCreateSchema,
      onSubmitAsync: zClinicCreateSchema,
    },
  });

  return (
    <AppPageLayout className="grid place-items-center">
      <form.AppForm>
        <Form
          className="bg-white flex flex-col w-full gap-3 md:max-w-2xl p-6 rounded-xl shadow-xl"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(e);
          }}
        >
          <div className="mb-3 flex gap-3 items-center">
            <HospitalIcon />
            <Typography type="h3">New Clinic</Typography>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <form.AppField
              name="name"
              children={(field) => (
                <field.AppTextField
                  isRequired
                  placeholder="eg: ClinicXYZ"
                  label="Name"
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
                  getLabel={(v) => v.label}
                  getValue={(v) => v.value}
                />
              )}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b py-2 border-b-accent-soft">
              <HouseIcon size={17} />
              <Typography>Address</Typography>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <form.AppField
                name="address.address_one"
                children={(field) => (
                  <field.AppTextField label="Address one" isRequired />
                )}
              />
              <form.AppField
                name="address.address_two"
                children={(field) => <field.AppTextField label="Address two" />}
              />
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-3">
              <form.AppField
                name="address.city"
                children={(field) => (
                  <field.AppTextField label="City" isRequired />
                )}
              />
              <form.AppField
                name="address.postcode"
                children={(field) => (
                  <field.AppTextField label="Postcode" isRequired />
                )}
              />
              <form.AppField
                name="address.state"
                children={(field) => (
                  <field.AppComboBoxField
                    options={statesOptions}
                    getOptionLabel={(v) => v.label}
                    getOptionValue={(v) => v.value}
                    label="State"
                    isRequired
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
    </AppPageLayout>
  );
}
