import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAppForm } from "#/components/forms/forms.util";
import {
  Button,
  buttonVariants,
  EmptyState,
  Form,
  Modal,
  Surface,
  toast,
  Typography,
} from "@heroui/react";
import {
  DatabaseIcon,
  HouseIcon,
  PhoneIcon,
  PlusCircleIcon,
  PlusIcon,
  TagPlusIcon,
} from "lucide-react";
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

export const Route = createFileRoute("/_private/(patients)/patients_/new")({
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
  contacts: [],
  clinic_id: "",
};

function RouteComponent() {
  const nav = useNavigate();
  const qc = useQueryClient();

  const form = useAppForm({
    defaultValues,
    onSubmit({ value }) {
      console.log("submitted", value, sanitizeForm(value));
      patientMutation.mutate({ body: sanitizeForm(value) });
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
      <Surface className="w-full md:max-w-2xl xl:max-w-3xl p-6">
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
            <form.AppField
              name="email"
              children={(field) => (
                <field.AppTextField label="Email" variant="secondary" />
              )}
            />
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b py-2 border-b-accent-soft">
                <PhoneIcon size={17} />
                <Typography>Personal Contacts</Typography>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <form.AppField name="contacts" mode="array">
                  {(field) => {
                    if (!field.state.value.length) {
                      return (
                        <EmptyState className="bg-surface-secondary flex min-h-50 col-span-2 flex-col items-center justify-center gap-4 text-center">
                          <PhoneIcon className="size-6 text-muted" />
                          <span className="text-sm text-muted">
                            No Personal Contacts Added.
                          </span>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              field.pushValue({
                                country_code: "",
                                is_primary: false,
                                phone_number: "",
                                type: "phone",
                              });
                            }}
                          >
                            <PlusIcon />
                            Add
                          </Button>
                        </EmptyState>
                      );
                    }
                    return <div>hehe</div>;
                  }}
                </form.AppField>
              </div>
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
                          variant="secondary"
                          isRequired
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
            <div className="flex justify-end gap-2 mt-5">
              <Button type="reset" variant="ghost">
                Reset
              </Button>
              <form.Subscribe
                selector={(s) => [s.isValid, s.canSubmit, s.isDirty]}
              >
                {([isValid, canSubmit, isDirty]) => (
                  <Button
                    type="submit"
                    isDisabled={
                      patientMutation.isPending ||
                      !canSubmit ||
                      !isValid ||
                      !isDirty
                    }
                  >
                    Submit
                  </Button>
                )}
              </form.Subscribe>
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
    orpc.listClinics.queryOptions({ input: { filters: { status: "active" } } }),
  );

  if (isError || isLoading || !data) {
    return null;
  }

  return children({ clinics: data });
}
