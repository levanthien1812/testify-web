import { Table } from "@tanstack/react-table";
import React from "react";
import Select from "../elements/Select";

type Props = {
    table: Table<any>;
};

const Paginator = ({ table }: Props) => {
    return (
        <div className="flex gap-2 justify-center mt-4">
            <button
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
                className="text-sm bg-orange-600 text-white py-0.5 hover:bg-orange-700 w-10 disabled:bg-gray-600"
            >
                {"<<"}
            </button>
            <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="text-sm bg-orange-600 text-white py-0.5 hover:bg-orange-700 w-10 disabled:bg-gray-600"
            >
                {"<"}
            </button>

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
            <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="text-sm bg-orange-600 text-white py-0.5 hover:bg-orange-700 w-10 disabled:bg-gray-600"
            >
                {">"}
            </button>
            <button
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
                className="text-sm bg-orange-600 text-white py-0.5 hover:bg-orange-700 w-10 disabled:bg-gray-600"
            >
                {">>"}
            </button>
        </div>
    );
};

export default Paginator;
