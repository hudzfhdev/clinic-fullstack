import {
  Description,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
  ComboBox,
} from "@heroui/react";
import type { SelectProps, TextFieldProps } from "@heroui/react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

export const formHookContexts = createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext: formHookContexts.fieldContext,
  formContext: formHookContexts.formContext,
  fieldComponents: {
    AppTextField,
    AppSelectField,
  },
  formComponents: {},
});

function getFieldError(field: any) {
  return field.state.meta.errors.find((err) => {
    if (err.path.length > 1) {
      return err.path.join(".") === field.name;
    }
    return err.path.includes(field.name);
  });
}

function AppTextField({
  label,
  description,
  placeholder,
  ...props
}: TextFieldProps & {
  placeholder?: string;
  label: string;
  description?: string | null;
}) {
  const field = formHookContexts.useFieldContext<string>();
  const error = getFieldError(field);
  return (
    <TextField
      {...props}
      name={field.name}
      value={field.state.value}
      onChange={(e) => field.handleChange(e)}
      onBlur={field.handleBlur}
      id={field.name}
      isInvalid={!!error?.message}
    >
      <Label>{label}</Label>
      <Input placeholder={placeholder} />
      {description ? <Description>{description}</Description> : null}
      <FieldError>{error?.message}</FieldError>
    </TextField>
  );
}

function AppSelectField<T extends any[]>({
  label,
  description,
  placeholder = "Select One",
  options,
  getLabel,
  getValue,
  ...props
}: SelectProps<T, "single"> & {
  label: string;
  description?: string;
  placeholder?: string;
  options: T;
  getLabel: (value: T[number]) => any;
  getValue: (value: T[number]) => any;
}) {
  const field = formHookContexts.useFieldContext<string>();
  const error = field.state.meta.errors.find((err) =>
    err.path.includes(field.name),
  );
  return (
    <Select
      {...props}
      placeholder={placeholder}
      value={field.state.value}
      onChange={(key) => field.handleChange(key)}
      isInvalid={!!error?.message}
    >
      <Label>{label}</Label>
      {description && <Description>{description}</Description>}
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((opt) => {
            const value = getValue(opt);
            const _label = getLabel(opt);
            return (
              <ListBox.Item key={value} id={value} textValue={_label}>
                {_label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            );
          })}
        </ListBox>
      </Select.Popover>
      <FieldError>{error?.message}</FieldError>
    </Select>
  );
}
