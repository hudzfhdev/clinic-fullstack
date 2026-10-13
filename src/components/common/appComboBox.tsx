import {
  ComboBox,
  Description,
  FieldError,
  Input,
  Label,
  ListBox,
} from "@heroui/react";
import type { ComboBoxProps } from "@heroui/react";

type ComboBoxOption = { label: string; value: string };
type ComboBoxMode = "single" | "multiple";

export type AppComboBoxProps<
  TItem extends ComboBoxOption,
  TMode extends ComboBoxMode = "single",
> = ComboBoxProps<TItem, TMode> & {
  placeholder?: string;
  error?: string;
  label?: string;
  description?: string;
  options: TItem[];
};

export function AppComboBox<
  TItem extends ComboBoxOption,
  TMode extends ComboBoxMode = "single",
>({
  label,
  description,
  error,
  placeholder = "Select",
  options,
  ...props
}: AppComboBoxProps<TItem, TMode>) {
  return (
    <ComboBox {...props}>
      {label && <Label>{label}</Label>}
      <ComboBox.InputGroup>
        <Input placeholder={placeholder} />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {options.map((opt) => {
            return (
              <ListBox.Item
                key={opt.value}
                id={opt.value}
                textValue={opt.label}
              >
                {opt.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            );
          })}
        </ListBox>
      </ComboBox.Popover>
      {description && <Description>{description}</Description>}
      <FieldError>{error}</FieldError>
    </ComboBox>
  );
}

export function toComboBoxOptions<T extends any[]>(
  input: T,
  configs: { valueKey: keyof T[number]; labelKey: keyof T[number] },
): ComboBoxOption[] {
  return input.map((v) => ({
    label: v[configs.labelKey],
    value: v[configs.valueKey],
  }));
}
