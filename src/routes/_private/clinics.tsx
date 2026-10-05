import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { AppPageLayout } from "../_private";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "#/orpc/client";
import { Table, Spinner, Typography } from "@heroui/react";
import {
  createColumnHelper,
  createCoreRowModel,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type { InferRouterOutputs } from "@orpc/server";
import type router from "#/orpc/router";

export const Route = createFileRoute("/_private/clinics")({
  component: RouteComponent,
  errorComponent: ErrorComponent,
  pendingComponent: () => <Spinner />,
  loader: ({ context }) =>
    context.queryClient.query(orpc.listClinics.queryOptions()),
});

const features = tableFeatures({
  coreRowModel: createCoreRowModel(),
});

const columnHelper = createColumnHelper<
  typeof features,
  InferRouterOutputs<typeof router>["listClinics"]["data"][number]
>();
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
    header: "Name",
    cell: (rowInfo) => rowInfo.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell(rowInfo) {
      return rowInfo.getValue();
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
    data: clinics.data,
    getRowId: (row) => row.id,
  });

  return (
    <AppPageLayout>
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
            <Table.Body>
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
    </AppPageLayout>
  );
}
