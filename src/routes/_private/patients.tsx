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
} from "@heroui/react";
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { PlusCircleIcon, StethoscopeIcon, UsersRoundIcon } from "lucide-react";
import { AppPageLayout } from "#/components/app-layouts.tsx";
import { EmptyTable } from "#/components/empty-table";
import type { Practitioner } from "#/orpc/schema";

export const Route = createFileRoute("/_private/patients")({
  component: RouteComponent,
  errorComponent: ErrorComponent,
  pendingComponent: () => <Spinner />,
  loader: ({ context }) =>
    context.queryClient.query(orpc.listPractitioners.queryOptions()),
});

const features = tableFeatures({});

const columnHelper = createColumnHelper<typeof features, Practitioner>();
const columns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: "Unique ID",
    cell: (props) => (
      <Typography type="body-sm" truncate>
        {props.getValue()}
      </Typography>
    ),
  }),
  columnHelper.accessor("name", {
    header: "Full Name",
    cell: (rowInfo) => rowInfo.getValue(),
  }),
  columnHelper.accessor("identification_no", {
    header: "Identity Card",
    cell: (rowInfo) => rowInfo.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("gender", {
    header: "Gender",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("dob", {
    header: "Date of Birth",
    cell: (info) => info.getValue(),
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
  columnHelper.display({
    id: "address",
    header: "Address",
    cell: ({ row }) => {
      const { address_one, city, postcode, state, address_two } =
        row.original.address ?? {};
      return (
        <Typography type="body-sm" truncate>
          {[address_one, address_two, city, state, postcode]
            .filter(Boolean)
            .join(", ")}
        </Typography>
      );
    },
  }),
]);

function RouteComponent() {
  const practitionersList = useLoaderData({
    from: "/_private/patients",
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
            <UsersRoundIcon aria-hidden />
            <Typography type="h3">Patients</Typography>
            <Typography className="col-start-2" type="body" color="muted">
              List of patients
            </Typography>
          </div>
          <Link
            className={buttonVariants({ fullWidth: false })}
            to="/patients/new"
          >
            <PlusCircleIcon />
            Add Patient
          </Link>
        </div>

        <div>
          <SearchField
            className="md:w-96"
            variant="secondary"
            aria-label="search patients"
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
