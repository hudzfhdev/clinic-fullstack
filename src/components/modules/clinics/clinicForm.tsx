import { EntityIcon } from "#/components/entityIcons.tsx";
import { useAppForm } from "#/components/forms/forms.util.tsx";
import { zClinicCreateSchema as zClinicFormSchema } from "#/isomorphic/schema/clinics.schema.ts";
import type {
  Clinic,
  ClinicCreateSchema as ClinicFormSchema,
} from "#/isomorphic/schema/clinics.schema.ts";
import { states } from "#/libs/address.ts";
import { Button, buttonVariants, Form, Typography } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { Clock9Icon, HouseIcon } from "lucide-react";

type ClinicFormProps<TFormValue> = {
  onSubmit: (value: TFormValue) => void;
  clinicData?: Clinic;
  isSubmitting?: boolean;
};

const statesOptions = states.map((v) => ({ label: v.state, value: v.state }));

export function ClinicForm({
  onSubmit,
  isSubmitting,
  clinicData,
}: ClinicFormProps<ClinicFormSchema>) {
  const mode = clinicData ? "edit" : "new";

  let defaultValues: ClinicFormSchema = {
    name: "",
    status: "active",
    start_time: "",
    end_time: "",
  };
  if (clinicData) {
    defaultValues = {
      name: clinicData.name,
      address: clinicData.address,
      end_time: clinicData.end_time,
      start_time: clinicData.start_time,
      status: clinicData.status,
    };
  }

  const form = useAppForm({
    defaultValues,
    onSubmit({ value }) {
      onSubmit(value);
    },
    validators: {
      onChangeAsync: zClinicFormSchema,
      onSubmitAsync: zClinicFormSchema,
    },
  });

  return (
    <form.AppForm>
      <Form
        className="flex flex-col w-full gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(e);
        }}
      >
        <div className="mb-3 flex gap-2 items-center">
          <EntityIcon entity="clinics" />
          <Typography type="h3">
            {mode === "edit" ? "Edit Clinic" : "New Clinic"}
          </Typography>
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
                  { label: "Inactive", value: "inactive" },
                ]}
                variant="secondary"
              />
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b py-2 border-b-accent-soft">
            <Clock9Icon size={17} />
            <Typography>Working Hours</Typography>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <form.AppField
              name="start_time"
              children={(field) => (
                <field.AppTimeField
                  isRequired
                  variant="secondary"
                  label="Start Time"
                />
              )}
            />
            <form.AppField
              name="end_time"
              children={(field) => (
                <field.AppTimeField
                  isRequired
                  variant="secondary"
                  label="End Time"
                />
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
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
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
          <Link to="/clinics" className={buttonVariants({ variant: "ghost" })}>
            Back
          </Link>
          <form.Subscribe selector={(s) => [s.isValid, s.canSubmit, s.isDirty]}>
            {([isValid, canSubmit, isDirty]) => (
              <Button
                type="submit"
                isDisabled={isSubmitting || !canSubmit || !isValid || !isDirty}
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
