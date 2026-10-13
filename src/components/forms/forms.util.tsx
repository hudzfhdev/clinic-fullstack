import { LOCALE_DATEPICKER } from "#/libs/date.ts";
import {
  Description,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
  ComboBox,
  DatePicker,
  DateField,
  Calendar,
  I18nProvider,
  Header,
  Separator,
  Autocomplete,
  useFilter,
  SearchField,
  EmptyState,
  TextArea,
} from "@heroui/react";
import type {
  AutocompleteProps,
  DatePickerProps,
  DateValue,
  SelectProps,
  TextAreaProps,
  TextFieldProps,
} from "@heroui/react";
import type { ComboBoxProps } from "@heroui/react/combo-box";
import { CalendarDate } from "@internationalized/date";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { ChevronDownIcon, CalendarIcon } from "lucide-react";
import { useMemo } from "react";

export const formHookContexts = createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext: formHookContexts.fieldContext,
  formContext: formHookContexts.formContext,
  fieldComponents: {
    AppTextField,
    AppSelectField,
    AppComboBoxField,
    AppDatePickerField,
    AppAutoCompleteField,
    AppTextAreaField,
  },
  formComponents: {},
});

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
  const error = field.state.meta.errors.find((err) => {
    if (err.path.length > 1) {
      return err.path.join(".") === field.name;
    }
    return err.path.includes(field.name);
  });
  const isInvalid =
    !!error?.message &&
    !field.state.meta.isValid &&
    field.state.meta.isTouched &&
    !field.state.meta.isBlurred;

  return (
    <TextField
      {...props}
      name={field.name}
      value={field.state.value}
      onChange={(e) => field.handleChange(e)}
      onBlur={field.handleBlur}
      id={field.name}
      isInvalid={isInvalid}
      validationBehavior="aria"
    >
      <Label>{label}</Label>
      <Input placeholder={placeholder} />
      {description ? <Description>{description}</Description> : null}
      <FieldError>{error?.message}</FieldError>
    </TextField>
  );
}

function AppSelectField<T extends { label: string; value: string }>({
  label,
  description,
  placeholder = "Select One",
  options,
  ...props
}: SelectProps<T, "single"> & {
  label: string;
  description?: string;
  placeholder?: string;
  options: T[];
}) {
  const field = formHookContexts.useFieldContext<string>();
  const error = field.state.meta.errors.find((err) =>
    err.path.includes(field.name),
  );

  const isInvalid =
    !!error?.message &&
    !field.state.meta.isValid &&
    field.state.meta.isTouched &&
    !field.state.meta.isBlurred;
  return (
    <Select
      {...props}
      placeholder={placeholder}
      value={field.state.value}
      onChange={(key) => field.handleChange(key)}
      isInvalid={isInvalid}
      onBlur={field.handleBlur}
      name={field.name}
    >
      <Label>{label}</Label>
      {description && <Description>{description}</Description>}
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map(({ label: _label, value }) => {
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

function AppComboBoxField<
  TOption extends
    | { label: string; value: string }
    | { section: string; items: Array<{ label: string; value: string }> },
  TMode extends "single" | "multiple" = "single",
  TItem extends object = object,
>({
  label,
  description,
  options,
  allowEmpty = false,
  ...props
}: ComboBoxProps<TItem, TMode> & {
  label: string;
  description?: string;
  options: TOption[];
  /** @deprecated not used */
  allowEmpty?: boolean;
}) {
  const field = formHookContexts.useFieldContext<any>();
  const error = field.state.meta.errors.find((err) =>
    err.path.includes(field.name),
  );

  const isInvalid =
    !!error?.message &&
    !field.state.meta.isValid &&
    field.state.meta.isTouched &&
    !field.state.meta.isBlurred;

  return (
    <ComboBox
      {...props}
      isInvalid={isInvalid}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(v) => {
        console.log({ v });
        if (v) field.handleChange(v);
        else field.handleChange("");
      }}
    >
      <Label>{label}</Label>
      <ComboBox.InputGroup>
        <Input placeholder="Select one..." />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {options.map((v) => {
            // FIXME: FIND WORKAROUND TO FIX THIS BUG WHEN SECTION ARE RENDERED, SEARCH WOULD BREAKS
            // https://github.com/heroui-inc/heroui/issues/6231
            // if ("section" in v) {
            //   return (
            //     <Fragment key={v.section}>
            //       <ListBox.Item isDisabled>{v.section}</ListBox.Item>
            //       <Separator />
            //       {v.items.map(({ label: labelOpt, value: valueOpt }) => (
            //         <ListBox.Item
            //           key={valueOpt}
            //           id={valueOpt}
            //           textValue={labelOpt}
            //         >
            //           {labelOpt}
            //           <ListBox.ItemIndicator />
            //         </ListBox.Item>
            //       ))}
            //     </Fragment>
            //   );
            // }
            if (!("section" in v)) {
              const { label: labelOpt, value: valueOpt } = v;
              return (
                <ListBox.Item key={valueOpt} id={valueOpt} textValue={labelOpt}>
                  {labelOpt}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              );
            }
          })}
        </ListBox>
      </ComboBox.Popover>
      {description && <Description>{description}</Description>}
      <FieldError>{error?.message}</FieldError>
    </ComboBox>
  );
}

function AppDatePickerField({
  label,
  description,
  variant,
  ...props
}: {
  label: string;
  description?: string;
  variant?: DateField["GroupProps"]["variant"];
} & DatePickerProps<DateValue>) {
  const field = formHookContexts.useFieldContext<any>();
  const error = field.state.meta.errors.find((err) =>
    err.path.includes(field.name),
  );

  const isInvalid =
    !!error?.message &&
    !field.state.meta.isValid &&
    field.state.meta.isTouched &&
    !field.state.meta.isBlurred;

  const value = useMemo(() => {
    let _value: CalendarDate | null = null;
    if (field.state.value && typeof field.state.value === "string") {
      const [d, m, y] = field.state.value.split("/").map(Number);
      _value = new CalendarDate(y, m, d);
    }
    return _value;
  }, [field.state.value]);

  const onChange: DatePicker["Props"]["onChange"] = (v) => {
    if (v) {
      const [day, month, year] = [v.day, v.month, v.year];
      field.handleChange(`${day}/${month}/${year}`);
    } else {
      field.handleChange("");
    }
  };

  return (
    <I18nProvider locale={LOCALE_DATEPICKER}>
      <DatePicker
        {...props}
        name={field.name}
        onBlur={field.handleBlur}
        id={field.name}
        value={value}
        onChange={onChange}
        isInvalid={isInvalid}
      >
        <Label>{label}</Label>
        <DateField.Group variant={variant}>
          <DateField.Prefix>
            <CalendarIcon className="size-4 text-muted" />
          </DateField.Prefix>
          <DateField.Input>
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
          <DateField.Suffix>
            <DatePicker.Trigger>
              <ChevronDownIcon className="size-4 text-muted" />
            </DatePicker.Trigger>
          </DateField.Suffix>
        </DateField.Group>
        {description ? <Description>{description}</Description> : null}
        <FieldError>{error?.messsage}</FieldError>

        <DatePicker.Popover>
          <Calendar aria-label="Event date">
            <Calendar.Header>
              <Calendar.YearPickerTrigger>
                <Calendar.YearPickerTriggerHeading />
                <Calendar.YearPickerTriggerIndicator />
              </Calendar.YearPickerTrigger>
              <Calendar.NavButton slot="previous" />
              <Calendar.NavButton slot="next" />
            </Calendar.Header>

            <Calendar.Grid>
              <Calendar.GridHeader>
                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
              </Calendar.GridHeader>
              <Calendar.GridBody>
                {(date) => <Calendar.Cell date={date} />}
              </Calendar.GridBody>
            </Calendar.Grid>

            <Calendar.YearPickerGrid>
              <Calendar.YearPickerGridBody>
                {({ year }) => <Calendar.YearPickerCell year={year} />}
              </Calendar.YearPickerGridBody>
            </Calendar.YearPickerGrid>
          </Calendar>
        </DatePicker.Popover>
      </DatePicker>
    </I18nProvider>
  );
}

function AppAutoCompleteField<
  TItem extends
    | { label: string; value: string }
    | { section: string; items: Array<{ label: string; value: string }> },
  TMode extends "single" | "multiple" = "single",
>({
  label,
  description,
  options,
  ...props
}: AutocompleteProps<TItem, TMode> & {
  label: string;
  description?: string;
  options: TItem[];
}) {
  const filter = useFilter({ sensitivity: "base" });
  const field = formHookContexts.useFieldContext<any>();

  const error = field.state.meta.errors.find((err) =>
    err.path.includes(field.name),
  );

  const isInvalid =
    !!error?.message &&
    !field.state.meta.isValid &&
    field.state.meta.isTouched &&
    !field.state.meta.isBlurred;

  return (
    <Autocomplete
      {...props}
      name={field.name}
      id={field.name}
      isInvalid={isInvalid}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(value) => {
        if (!value) {
          if (Array.isArray(value)) field.handleChange([]);
          else if (typeof value === "string") field.handleChange("");
          else field.handleChange(value);
          return;
        }
        field.handleChange(value);
      }}
    >
      <Label>{label}</Label>
      <Autocomplete.Trigger>
        <Autocomplete.Value />
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Autocomplete.Popover>
        <Autocomplete.Filter filter={filter.contains}>
          <SearchField aria-label={`search ${label}`}>
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ListBox
            renderEmptyState={() => <EmptyState>No results found</EmptyState>}
          >
            {options.map((option, index) => {
              if ("section" in option) {
                return (
                  <ListBox.Section
                    key={option.section}
                    className={index > 0 ? "mt-3.5" : ""}
                  >
                    <Header>{option.section}</Header>
                    {option.items.map((item) => (
                      <ListBox.Item id={item.value} textValue={item.label}>
                        {item.label}
                      </ListBox.Item>
                    ))}
                    {index === options.length - 1 ? <Separator /> : null}
                  </ListBox.Section>
                );
              }
              return (
                <ListBox.Item id={option.value} textValue={option.label}>
                  {option.label}
                </ListBox.Item>
              );
            })}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  );
}

function AppTextAreaField({
  label,
  description,
  placeholder,
  ...props
}: TextAreaProps & {
  label: string;
  placeholder?: string;
  description?: string;
}) {
  const field = formHookContexts.useFieldContext<any>();

  const error = field.state.meta.errors.find((err) =>
    err.path.includes(field.name),
  );

  const isInvalid =
    !!error?.message &&
    !field.state.meta.isValid &&
    field.state.meta.isTouched &&
    !field.state.meta.isBlurred;

  return (
    <TextField
      isInvalid={isInvalid}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(v) => field.handleChange(v)}
      id={field.name}
    >
      <Label>{label}</Label>
      <TextArea {...props} />
      {description && <Description>{description}</Description>}
      <FieldError>{error?.message}</FieldError>
    </TextField>
  );
}
