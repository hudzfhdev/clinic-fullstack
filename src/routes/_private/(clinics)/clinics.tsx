import { createFileRoute, ErrorComponent, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "#/orpc/client";
import {
  Table,
  Spinner,
  Typography,
  buttonVariants,
  Surface,
  SearchField,
  Link as HeroLink,
} from "@heroui/react";
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { PlusCircleIcon } from "lucide-react";
import { ClinicStatusChips } from "#/components/modules/clinics/clinicStatusChips.tsx";
import { AppPageLayout } from "#/components/appLayouts.tsx";
import { EmptyTable } from "#/components/emptyTable.tsx";
import { EntityIcon } from "#/components/entityIcons.tsx";
import type { Clinic } from "#/isomorphic/schema/clinics.schema.ts";

export const Route = createFileRoute("/_private/(clinics)/clinics")({
  component: RouteComponent,
  errorComponent: ErrorComponent,
  pendingComponent: () => <Spinner />,
  loader: ({ context }) =>
    context.queryClient.query(orpc.listClinics.queryOptions()),
});

const features = tableFeatures({});

const columnHelper = createColumnHelper<typeof features, Clinic>();
const columns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: "Unique ID",
    cell: (props) => (
      <HeroLink
        render={(p) => (
          <span {...p}>
            <Link
              to={`/clinics/$id/details`}
              params={{ id: props.row.original.id }}
            >
              {props.getValue()}
            </Link>
          </span>
        )}
      />
    ),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (rowInfo) => rowInfo.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell(rowInfo) {
      return <ClinicStatusChips status={rowInfo.getValue()} />;
    },
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
  const { data: clinics } = useSuspenseQuery(orpc.listClinics.queryOptions());
  const table = useTable({
    features,
    columns,
    data: clinics,
    getRowId: (row) => row.id,
  });

  return (
    <AppPageLayout>
      <Surface className="space-y-5 p-5">
        <div className="flex justify-between items-center">
          <div className="grid items-center grid-cols-[35px_auto] grid-rows-1">
            <EntityIcon entity="clinics" aria-hidden />
            <Typography type="h3">Clinics</Typography>
            <Typography className="col-start-2" type="body" color="muted">
              List of clinics
            </Typography>
          </div>
          <Link
            className={buttonVariants({ fullWidth: false })}
            to="/clinics/new"
          >
            <PlusCircleIcon />
            Add Clinic
          </Link>
        </div>

        <SearchField
          className="md:w-96"
          variant="secondary"
          aria-label="search clinics"
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="list of clinics">
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
