import {
  createFileRoute,
  ErrorComponent,
  Link,
  useLoaderData,
} from "@tanstack/react-router";
import { orpc } from "#/orpc/client";
import {
  Table,
  Spinner,
  Typography,
  buttonVariants,
  SearchField,
  Surface,
  Tooltip,
  linkVariants,
} from "@heroui/react";
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { PlusCircleIcon } from "lucide-react";
import { AppPageLayout } from "#/components/appLayouts.tsx";
import { EmptyTable } from "#/components/emptyTable.tsx";
import { EntityIcon } from "#/components/entityIcons.tsx";
import type { Practitioner } from "#/isomorphic/schema/practitioners.schema.ts";
import { toReadableTitle } from "#/utils/common.ts";
import { toReadableTimestamp } from "#/utils/date-time.ts";
import { PractitionerStatusChips } from "#/components/modules/practitioners/practitionerStatusChips.tsx";
import { capitalize } from "#/utils/string.ts";

export const Route = createFileRoute("/_private/(practitioners)/practitioners")(
  {
    component: RouteComponent,
    errorComponent: ErrorComponent,
    pendingComponent: () => <Spinner />,
    loader: ({ context }) =>
      context.queryClient.query(orpc.listPractitioners.queryOptions()),
  },
);

const features = tableFeatures({});

const columnHelper = createColumnHelper<typeof features, Practitioner>();
const columns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: "Unique ID",
    cell: (props) => (
      <Link
        className={linkVariants().base({ className: "w-20" })}
        to="/practitioners/$id/details"
        params={{ id: props.row.original.id }}
      >
        <Typography type="body-sm" truncate>
          {props.getValue()}
        </Typography>
      </Link>
    ),
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: (rowInfo) => toReadableTitle(rowInfo.getValue()),
  }),
  columnHelper.accessor("name", {
    header: "Full Name",
    cell: (rowInfo) => <div className="w-32">{rowInfo.getValue()}</div>,
  }),
  columnHelper.accessor("identification_no", {
    header: "Identity Card",
    cell: (rowInfo) => rowInfo.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <PractitionerStatusChips status={info.getValue()} />,
  }),
  columnHelper.accessor("gender", {
    header: "Gender",
    cell: (info) => capitalize(info.getValue()),
  }),
  columnHelper.accessor("dob", {
    header: "Date of Birth",
    cell: (info) => <div className="w-20">{info.getValue()}</div>,
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) =>
      info.getValue() || (
        <Typography type="body-sm" className="text-muted">
          Not Available
        </Typography>
      ),
  }),
  columnHelper.accessor("phone_number", {
    header: "Phone Number",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("practitioners_specialties.name", {
    header: "Field Specialty",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("clinics.name", {
    header: "Clinic Name",
    cell: (info) =>
      info.getValue() || (
        <Typography type="body-sm" className="text-muted">
          Not Available
        </Typography>
      ),
  }),
  columnHelper.accessor("created_at", {
    header: "Created At",
    cell({ getValue }) {
      return toReadableTimestamp(getValue());
    },
  }),
  columnHelper.accessor("updated_at", {
    header: "Updated At",
    cell({ getValue }) {
      return toReadableTimestamp(getValue());
    },
  }),
  columnHelper.display({
    id: "address",
    header: "Address",
    cell: ({ row }) => {
      const { address_one, city, postcode, state, address_two } =
        row.original.address ?? {};

      const address = [address_one, address_two, city, state, postcode]
        .filter(Boolean)
        .join(", ");

      if (!address.length) {
        return (
          <Typography type="body-sm" color="muted">
            Not Available
          </Typography>
        );
      }

      return (
        <Tooltip delay={0}>
          <Tooltip.Trigger>
            <Typography
              type="body-sm"
              truncate
              className={address ? "max-w-48" : undefined}
            >
              {address}
            </Typography>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Arrow />
            <div>
              <Typography type="body-sm">{address_one},</Typography>
              {address_two ? (
                <Typography type="body-sm">{address_two},</Typography>
              ) : null}
              <Typography type="body-sm">
                {city} {postcode},
              </Typography>
              <Typography type="body-sm">{state}.</Typography>
            </div>
          </Tooltip.Content>
        </Tooltip>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell(info) {
      const { id } = info.row.original;
      return (
        <div>
          <Link to="/practitioners/$id/edit" params={{ id }}>
            Edit
          </Link>
        </div>
      );
    },
  }),
]);

function RouteComponent() {
  const practitionersList = useLoaderData({
    from: "/_private/(practitioners)/practitioners",
    strict: true,
  });
  const table = useTable({
    features,
    columns,
    data: practitionersList,
    getRowId: (row) => row.id,
  });

  return (
    <AppPageLayout>
      <Surface className="p-5 space-y-5">
        <div className="flex justify-between items-center">
          <div className="grid items-center grid-cols-[35px_auto] grid-rows-1">
            <EntityIcon entity="practitioners" aria-hidden />
            <Typography type="h3">Practitioners</Typography>
            <Typography className="col-start-2" type="body" color="muted">
              List of practitioners
            </Typography>
          </div>
          <Link
            className={buttonVariants({ fullWidth: false })}
            to="/practitioners/new"
          >
            <PlusCircleIcon />
            Add Practitioner
          </Link>
        </div>

        <div>
          <SearchField
            variant="secondary"
            className="md:w-96"
            aria-label="search practitioners"
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
        </div>

        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="list of practitioners">
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Header key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Column
                      isRowHeader={header.id === "id"}
                      key={header.id}
                    >
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </Table.Column>
                  ))}
                </Table.Header>
              ))}
              <Table.Body renderEmptyState={() => <EmptyTable />}>
                {table.getRowModel().rows.map((row) => (
                  <Table.Row key={row.id}>
                    {row.getAllCells().map((cell) => (
                      <Table.Cell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Surface>
    </AppPageLayout>
  );
}
