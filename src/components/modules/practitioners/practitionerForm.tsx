import { AppTooltip } from "#/components/common/appTooltip.tsx";
import { EntityIcon } from "#/components/entityIcons.tsx";
import { useAppForm } from "#/components/forms/forms.util.tsx";
import type { Clinic } from "#/isomorphic/schema/clinics.schema.ts";
import { zPractitionerFormSchema } from "#/isomorphic/schema/practitioners.schema.ts";
import type {
  Practitioner,
  PractitionerFormSchema,
} from "#/isomorphic/schema/practitioners.schema.ts";
import { states } from "#/libs/address.ts";
import { toClientDateFormat } from "#/libs/datetime.ts";
import { orpc } from "#/orpc/client.ts";
import { Button, Form, Typography } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { CircleAlertIcon, HouseIcon, TagPlusIcon } from "lucide-react";
import { useMemo } from "react";
import type { ReactNode } from "react";

const statesOptions = states.map((v) => ({ label: v.state, value: v.state }));

export function PractitionerForm({
  practitionerData,
  onSubmit,
  isMutating,
}: {
  onSubmit: (value: PractitionerFormSchema) => void;
  practitionerData?: Practitioner;
  isMutating?: boolean;
}) {
  const mode = practitionerData ? "edit" : "add";
  const defaultValues: PractitionerFormSchema = {
    dob: practitionerData?.dob ? toClientDateFormat(practitionerData.dob) : "",
    email: practitionerData?.email ?? "",
    gender: practitionerData?.gender ?? "male",
    identification_no: practitionerData?.identification_no ?? "",
    name: practitionerData?.name ?? "",
    phone_number: practitionerData?.phone_number ?? "",
    clinic_id: practitionerData?.clinic_id ?? "",
    specialty_id: practitionerData?.specialty_id ?? "",
    status: practitionerData?.status ?? "active",
    title: practitionerData?.title ?? "MR",
    address: practitionerData?.address,
  };

  const form = useAppForm({
    defaultValues,
    onSubmit({ value }) {
      onSubmit(value);
    },
    validators: {
      onChangeAsync: zPractitionerFormSchema,
      onSubmitAsync: zPractitionerFormSchema,
    },
  });

  return (
    <form.AppForm>
      <Form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(e);
        }}
      >
        <div className="mb-3 flex gap-2 items-center">
          <EntityIcon entity="practitioners" />
          <Typography type="h3">
            {mode === "add" ? "New Practitioner" : "Edit Practitioner"}
          </Typography>
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
              children={(field) =>
                mode === "add" ? (
                  <PopulateClinicsOptions>
                    {({ clinics }) => (
                      <field.AppComboBoxField
                        isRequired
                        variant="secondary"
                        label="Employed By"
                        options={clinics.map((v) => ({
                          label: v.name,
                          value: v.id,
                        }))}
                      />
                    )}
                  </PopulateClinicsOptions>
                ) : (
                  <AppTooltip
                    renderTrigger={
                      <PopulateClinicsOptions>
                        {({ clinics }) => (
                          <field.AppComboBoxField
                            isRequired
                            isReadOnly={!!field.state.value}
                            isDisabled={!!field.state.value}
                            variant="secondary"
                            label="Employed By"
                            options={clinics.map((v) => ({
                              label: v.name,
                              value: v.id,
                            }))}
                          />
                        )}
                      </PopulateClinicsOptions>
                    }
                    renderContent={
                      <div className="flex gap-2 break-normal">
                        <CircleAlertIcon className="stroke-danger" size={23} />
                        <Typography type="body-sm">
                          You cannot assigned practitioner to other clinic once
                          created.
                        </Typography>
                      </div>
                    }
                  />
                )
              }
            />
            <form.AppField
              name="specialty_id"
              children={(field) => (
                <PopulateSpecialtiesOptions>
                  {({ options }) => (
                    <field.AppAutoCompleteField
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
                <field.AppTextField label="Address one" variant="secondary" />
              )}
            />
            <form.AppField
              name="address.address_two"
              children={(field) => (
                <field.AppTextField label="Address two" variant="secondary" />
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
          <form.Subscribe selector={(s) => [s.isValid, s.canSubmit, s.isDirty]}>
            {([isValid, canSubmit, isDirty]) => (
              <Button
                type="submit"
                isDisabled={isMutating || !canSubmit || !isValid || !isDirty}
              >
                Submit
              </Button>
            )}
          </form.Subscribe>
        </div>
      </Form>
    </form.AppForm>
  );
}

export function PopulateClinicsOptions({
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

type Option = { section: string; items: { label: string; value: string }[] };
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
    // return data.flatMap<Option>((o) => {
    //   return o.fields.map((field) => ({ label: field.name, value: field.id }));
    // });
    return data.reduce<Option[]>((acc, item) => {
      const obj = { section: item.category, items: [] } as Option;
      obj.items = item.fields.map((field) => {
        return { label: field.name, value: field.id };
      });
      acc.push(obj);
      return acc;
    }, []);
  }, [data]);

  if (isError || isLoading || !data) {
    return null;
  }

  return children({ options });
}
