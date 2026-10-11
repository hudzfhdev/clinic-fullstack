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
import { HouseIcon, TagPlusIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "#/orpc/client";
import { sanitizeForm } from "#/utils/common";
import { AppPageLayout } from "#/components/appLayouts.tsx";
import { RouteErrorComponent } from "#/components/routeErrorComponent.tsx";
import { states } from "#/libs/address.ts";
import { useMemo } from "react";
import type { ReactNode } from "react";
import type { Clinic } from "#/isomorphic/schema/clinics.schema.ts";
import { zCreatePatientSchema } from "#/isomorphic/schema/patients.schema.ts";
import type {
  CreatePatientSchema,
  Patient,
} from "#/isomorphic/schema/patients.schema.ts";
import { EntityIcon } from "#/components/entityIcons.tsx";

export const Route = createFileRoute("/_private/patients_/new")({
  component: RouteComponent,
  errorComponent: RouteErrorComponent,
  ssr: "data-only",
});

const statesOptions = states.map((v) => ({ label: v.state, value: v.state }));

const defaultValues: CreatePatientSchema = {
  name: "",
  dob: "",
  gender: "male",
  title: "MR",
  identification_card: "",
  email: "",
  phone_number: "",
  clinic_id: "",
};

function RouteComponent() {
  const nav = useNavigate();
  const qc = useQueryClient();

  const form = useAppForm({
    defaultValues,
    onSubmit({ value }) {
      console.log("submitted", value, sanitizeForm(value));
      patientMutation.mutate(sanitizeForm(value));
    },
    validators: {
      onChangeAsync: zCreatePatientSchema,
      onSubmitAsync: zCreatePatientSchema,
    },
  });

  const patientMutation = useMutation(
    orpc.createPatient.mutationOptions({
      onSettled: (data, err) => {
        if (err) {
          toast.danger(`Error`, {
            description: err.message || "Something wrong...",
          });
          return;
        }
        if (data) {
          toast.success(`Success`, {
            description: "New patient has been added.",
          });
          qc.invalidateQueries({ queryKey: orpc.listPatients.queryKey() });
          nav({ to: "/patients" });
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
            <div className="mb-3 flex gap-2 items-center">
              <EntityIcon entity="patients" />
              <Typography type="h3">New Patient</Typography>
            </div>

            <div className="flex gap-4">
              <form.AppField
                name="title"
                children={(field) => (
                  <field.AppSelectField
                    isRequired
                    className="w-32"
                    label="Title"
                    variant="secondary"
                    options={[
                      { label: "Mr.", value: "MR" },
                      { label: "Mrs.", value: "MRS" },
                    ]}
                  />
                )}
              />
              <form.AppField
                name="name"
                children={(field) => (
                  <field.AppTextField
                    isRequired
                    fullWidth
                    label="Full Name"
                    description="Must follow IC name"
                    variant="secondary"
                  />
                )}
              />
            </div>

            <form.AppField
              name="identification_card"
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
                        value: Patient["gender"];
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

            <div className="grid grid-cols-2 gap-4">
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

              <form.AppField
                name="email"
                children={(field) => (
                  <field.AppTextField label="Email" variant="secondary" />
                )}
              />
            </div>

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
                          label="Clinic"
                          options={clinics.map((v) => ({
                            label: v.name,
                            value: v.id,
                          }))}
                        />
                      )}
                    </PopulateClinicsOptions>
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
                    <field.AppTextField label="City" variant="secondary" />
                  )}
                />
                <form.AppField
                  name="address.postcode"
                  children={(field) => (
                    <field.AppTextField label="Postcode" variant="secondary" />
                  )}
                />
                <form.AppField
                  name="address.state"
                  children={(field) => (
                    <field.AppComboBoxField
                      options={statesOptions}
                      label="State"
                      variant="secondary"
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Link
                to="/patients"
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
