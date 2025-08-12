import { Table } from "@tanstack/react-table";
import React from "react";
import Select from "../elements/Select";
import Button from "../elements/Button";

type Props = {
    table: Table<any>;
};

const Paginator = ({ table }: Props) => {
    return (
        <div className="flex gap-2 justify-center mt-4">
            <Button
                onClick={() => table.firstPage()}
                size="sm"
                disabled={!table.getCanPreviousPage()}
            >
                {"<<"}
            </Button>
            <Button
                onClick={() => table.previousPage()}
                size="sm"
                disabled={!table.getCanPreviousPage()}
            >
                {"<"}
            </Button>

            <Select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                }}
                sizing="sm"
                options={[10, 20, 30, 40, 50].map((pageSize) => ({
                    value: pageSize,
                    label: pageSize,
                }))}
                label={{ text: "Rows per page" }}
            />
            <Button
                onClick={() => table.nextPage()}
                size="sm"
                disabled={!table.getCanNextPage()}
            >
                {">"}
            </Button>
            <Button
                onClick={() => table.lastPage()}
                size="sm"
                disabled={!table.getCanNextPage()}
            >
                {">>"}
            </Button>
        </div>
    );
};

export default Paginator;
