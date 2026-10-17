import { EntityIcon } from "#/components/entityIcons.tsx";
import { useAppForm } from "#/components/forms/forms.util.tsx";
import {
  zCreateAppointmentSchema,
  zUpdateAppointmentSchema,
} from "#/isomorphic/schema/appointment.schema.ts";
import type {
  Appointment,
  CreateAppointmentSchema,
  UpdateAppointmentSchema,
} from "#/isomorphic/schema/appointment.schema.ts";
import { Button, buttonVariants, Form, Typography } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";

export const isCreateForm = (
  formValues: CreateAppointmentSchema | UpdateAppointmentSchema,
): formValues is CreateAppointmentSchema => {
  return !!formValues;
};

export const isUpdateForm = (
  formValues: CreateAppointmentSchema | UpdateAppointmentSchema,
): formValues is UpdateAppointmentSchema => {
  return !!formValues;
};

export function AppointmentsForm({
  appointmentData,
  onSubmit,
  isMutating,
}: {
  isMutating?: boolean;
  onSubmit: (value: CreateAppointmentSchema | UpdateAppointmentSchema) => void;
  appointmentData?: Appointment;
}) {
  const mode = appointmentData ? "edit" : "add";
  const defaultValues: CreateAppointmentSchema | UpdateAppointmentSchema = {
    clinic_id: appointmentData?.clinic_id ?? "",
    end_time: appointmentData?.end_time ?? "",
    patient_id: appointmentData?.patient_id ?? "",
    practitioner_id: appointmentData?.practitioner_id ?? "",
    room_id: appointmentData?.room_id ?? "",
    service_id: appointmentData?.service_id ?? "",
    start_time: appointmentData?.start_time ?? "",
    status: appointmentData?.status ?? "pending",
  };

  const schema =
    mode === "edit" ? zUpdateAppointmentSchema : zCreateAppointmentSchema;

  const form = useAppForm({
    defaultValues,
    onSubmit({ value }) {
      onSubmit(value);
    },
    validators: {
      onChangeAsync: schema,
      onSubmitAsync: schema,
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
        <Link
          to="/appointments"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ChevronLeftIcon />
          Back
        </Link>
        <div className="mb-3 flex gap-2 items-center">
          <EntityIcon entity="appointments" />
          <Typography type="h3">New Appointment</Typography>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit">Add</Button>
        </div>
      </Form>
    </form.AppForm>
  );
}
