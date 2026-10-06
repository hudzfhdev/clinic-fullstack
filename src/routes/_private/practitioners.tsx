import { AppPageLayout } from "#/components/app-layouts";
import { buttonVariants, Table } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Link, PlusCircleIcon } from "lucide-react";

export const Route = createFileRoute("/_private/practitioners")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppPageLayout>Practitinoer list</AppPageLayout>
    // <AppPageLayout className="space-y-3">
    //       <div className="flex justify-end">
    //         <Link
    //           className={buttonVariants({ fullWidth: false })}
    //           to="/clinics/new"
    //         >
    //           <PlusCircleIcon />
    //           Add Clinic
    //         </Link>
    //       </div>
    //       <Table>
    //         <Table.ScrollContainer>
    //           <Table.Content aria-label="list of clinics">
    //             {table.getHeaderGroups().map((headerGroup) => (
    //               <Table.Header key={headerGroup.id}>
    //                 {headerGroup.headers.map((header) => (
    //                   <Table.Column
    //                     isRowHeader={header.id === "id"}
    //                     key={header.id}
    //                   >
    //                     {header.isPlaceholder ? null : (
    //                       <table.FlexRender header={header} />
    //                     )}
    //                   </Table.Column>
    //                 ))}
    //               </Table.Header>
    //             ))}
    //             <Table.Body renderEmptyState={() => <EmptyTable />}>
    //               {table.getRowModel().rows.map((row) => (
    //                 <Table.Row key={row.id}>
    //                   {row.getAllCells().map((cell) => (
    //                     <Table.Cell key={cell.id}>
    //                       <table.FlexRender cell={cell} />
    //                     </Table.Cell>
    //                   ))}
    //                 </Table.Row>
    //               ))}
    //             </Table.Body>
    //           </Table.Content>
    //         </Table.ScrollContainer>
    //       </Table>
    //     </AppPageLayout>
  );
}
