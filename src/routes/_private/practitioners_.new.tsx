import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAppForm } from "#/components/forms/forms.util";
import {
  Button,
  buttonVariants,
  Form,
  Surface,
  toast,
  Typography,
} from "@heroui/react";
import { HouseIcon, StethoscopeIcon, TagPlusIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "#/orpc/client";
import { sanitizeForm } from "#/utils/common";
import { zPractitionerCreateSchema } from "#/orpc/schema.ts";
import type {
  Clinic,
  Practitioner,
  PractitionerCreateSchema,
} from "#/orpc/schema.ts";
import { AppPageLayout } from "#/components/app-layouts.tsx";
import { RouteErrorComponent } from "#/components/routeErrorComponent.tsx";
import { states } from "#/libs/address.ts";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { isDefinedError } from "@orpc/client";

export const Route = createFileRoute("/_private/practitioners_/new")({
  component: RouteComponent,
  errorComponent: RouteErrorComponent,
  ssr: "data-only",
});

const statesOptions = states.map((v) => ({ label: v.state, value: v.state }));

const defaultValues: PractitionerCreateSchema = {
  name: "",
  status: "active",
  dob: "",
  gender: "male",
  identification_no: "",
  phone_number: "",
  specialty_id: "",
  clinic_id: "",
  address: {
    address_one: "",
    address_two: "",
    city: "",
    postcode: "",
    state: "",
  },
};

function RouteComponent() {
  const nav = useNavigate();
  const qc = useQueryClient();

  const form = useAppForm({
    defaultValues,
    onSubmit({ value }) {
      console.log("submitted", value, sanitizeForm(value));
      practitionerMutation.mutate(sanitizeForm(value));
    },
    validators: {
      onChangeAsync: zPractitionerCreateSchema,
      onSubmitAsync: zPractitionerCreateSchema,
    },
  });

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
      <Surface className="w-full md:max-w-2xl xl:max-w-3xl p-6 rounded-xl shadow-xl">
        <form.AppForm>
          <Form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(e);
            }}
          >
            <div className="mb-3 flex gap-4 items-center">
              <StethoscopeIcon />
              <Typography type="h3">New Practitioner</Typography>
            </div>

            <form.AppField
              name="status"
              children={(field) => (
                <field.AppSelectField
                  label="Status"
                  isRequired
                  options={
                    [
                      { label: "Active", value: "active" },
                      { label: "Suspended", value: "suspended" },
                      { label: "Inactive", value: "inactive" },
                    ] as Array<{ label: string; value: Practitioner["status"] }>
                  }
                  variant="secondary"
                />
              )}
            />

            <form.AppField
              name="name"
              children={(field) => (
                <field.AppTextField
                  isRequired
                  label="Full Name"
                  description="Must follow IC name"
                  variant="secondary"
                />
              )}
            />

            <form.AppField
              name="identification_no"
              children={(field) => (
                <field.AppTextField
                  isRequired
                  label="Identification Card (IC)"
                  variant="secondary"
                />
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <form.AppField
                name="gender"
                children={(field) => (
                  <field.AppSelectField
                    label="Gender"
                    isRequired
                    options={
                      [
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        { label: "Other", value: "other" },
                      ] as Array<{
                        label: string;
                        value: Practitioner["gender"];
                      }>
                    }
                    variant="secondary"
                  />
                )}
              />
              <form.AppField
                name="dob"
                children={(field) => (
                  <field.AppDatePickerField
                    label="Date of Birth"
                    variant="secondary"
                    isRequired
                  />
                )}
              />
            </div>

            <form.AppField
              name="phone_number"
              children={(field) => (
                <field.AppTextField
                  isRequired
                  label="Phone Number"
                  variant="secondary"
                />
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b py-2 border-b-accent-soft">
                <TagPlusIcon size={17} />
                <Typography>Associations</Typography>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <form.AppField
                  name="clinic_id"
                  children={(field) => (
                    <PopulateClinicsOptions>
                      {({ clinics }) => (
                        <field.AppComboBoxField
                          allowEmpty
                          variant="secondary"
                          label="Employed By"
                          options={clinics.map((v) => ({
                            label: v.name,
                            value: v.id,
                          }))}
                        />
                      )}
                    </PopulateClinicsOptions>
                  )}
                />
                <form.AppField
                  name="specialty_id"
                  children={(field) => (
                    <PopulateSpecialtiesOptions>
                      {({ options }) => (
                        <field.AppComboBoxField
                          isRequired
                          variant="secondary"
                          label="Specialty"
                          options={options}
                        />
                      )}
                    </PopulateSpecialtiesOptions>
                  )}
                />
              </div>
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
                      variant="secondary"
                      isRequired
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
              <div className="grid grid-cols-2 grid-rows-2 gap-3">
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
                to="/practitioners"
                className={buttonVariants({ variant: "ghost" })}
              >
                Back
              </Link>
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </form.AppForm>
      </Surface>
    </AppPageLayout>
  );
}

function PopulateClinicsOptions({
  children,
}: {
  children: (params: { clinics: Clinic[] }) => ReactNode;
}) {
  const { data, isError, isLoading } = useQuery(
    orpc.listClinics.queryOptions(),
  );

  if (isError || isLoading || !data) {
    return null;
  }

  return children({ clinics: data });
}

type Option = { label: string; value: string }[];
function PopulateSpecialtiesOptions({
  children,
}: {
  children: (params: { options: Option[] }) => ReactNode;
}) {
  const { data, isError, isLoading } = useQuery(
    orpc.populateSpecialtiesOptions.queryOptions(),
  );

  const options = useMemo(() => {
    if (!data) return [];
    return data.flatMap<Option>((o) => {
      return o.fields.map((field) => ({ label: field.name, value: field.id }));
    });
  }, [data]);

  if (isError || isLoading || !data) {
    return null;
  }

  return children({ options });
}
