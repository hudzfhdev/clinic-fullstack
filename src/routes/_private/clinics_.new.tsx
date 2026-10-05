import {
  createFileRoute,
  ErrorComponent,
  useNavigate,
} from "@tanstack/react-router";
import { AppPageLayout } from "../_private";
import { useAppForm } from "#/components/forms/forms.util";
import { Button, toast, Typography } from "@heroui/react";
import { HospitalIcon, HouseIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "#/orpc/client";
import { zClinicCreateSchema } from "#/orpc/schema";
import type { InferredClinicCreateSchema } from "#/orpc/schema";
import { sanitizeForm } from "#/utils/common";
import { states } from "#/libs/address";

export const Route = createFileRoute("/_private/clinics_/new")({
  component: RouteComponent,
  head: () => ({ meta: [{ title: "New Clinic" }] }),
  errorComponent: ErrorComponent,
});

const statesOptions = states.map((v) => v.state);

function RouteComponent() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const clinicsMutation = useMutation(
    orpc.createClinic.mutationOptions({
      onSettled: (data, err) => {
        if (err) {
          toast.danger(`Something wrong`);
          return;
        }

        if (data?.data) {
          toast.success(`New clinic added`);
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
        city: "",
        postcode: "",
        state: "",
        note: "",
      },
    } as InferredClinicCreateSchema,
    onSubmitInvalid(props) {
      console.log(props);
    },
    canSubmitWhenInvalid: true,
    onSubmit({ value }) {
      clinicsMutation.mutate(sanitizeForm(value));
    },
    validators: {
      onSubmitAsync: zClinicCreateSchema,
    },
  });

  return (
    <AppPageLayout className="flex justify-center">
      <form.AppForm>
        <form
          className="bg-white flex flex-col w-full gap-3 md:max-w-2xl p-6 rounded-xl shadow-2xl"
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
              <HouseIcon size={18} />
              <Typography type="h5">Address</Typography>
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
                  <field.AppSelectField
                    options={statesOptions}
                    getLabel={(v) => v}
                    getValue={(v) => v}
                    label="State"
                    isRequired
                  />
                )}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Add</Button>
          </div>
        </form>
      </form.AppForm>
    </AppPageLayout>
  );
}
