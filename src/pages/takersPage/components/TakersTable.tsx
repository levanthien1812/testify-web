import { flexRender, Table } from "@tanstack/react-table";
import React from "react";
import { TakerItf } from "../../../types/types";
import Paginator from "../../../components/table/Paginator";

type TakersTableProps = {
    table: Table<TakerItf>;
};

const TakersTable = ({ table }: TakersTableProps) => {
    return (
        <>
            <table className="w-full mt-2">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className={`py-1 px-1 border align-middle border-slate-400 bg-orange-100 ${
                                        header.column.getCanSort()
                                            ? "cursor-pointer"
                                            : ""
                                    }`}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {header.column.getIsSorted()
                                        ? header.column.getIsSorted() === "asc"
                                            ? " 🔼"
                                            : " 🔽"
                                        : ""}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className={`py-1 px-1 align-middle border text-center border-slate-400 ${
                                        row.getIsSelected()
                                            ? "bg-orange-100"
                                            : ""
                                    }`}
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Paginator table={table} />
        </>
    );
};

export default TakersTable;
