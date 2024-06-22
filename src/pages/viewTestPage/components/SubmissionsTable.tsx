import { useMemo, useState } from "react";
import { SubmissionItf, userItf } from "../../../types/types";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getSortedRowModel,
    ColumnDef,
    getPaginationRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { formatTime } from "../../../utils/time";
import _ from "lodash";
import TakerSubmissionDetail from "./TakerSubmissionDetail";

type SubmissionsTableProps = {
    submissions: SubmissionItf[];
};

const SubmissionsTable = ({ submissions }: SubmissionsTableProps) => {
    const columns = useMemo<ColumnDef<SubmissionItf>[]>(
        () => [
            {
                header: "Name",
                accessorKey: "taker_id.name",
                cell: ({ row }) => {
                    return _.capitalize(
                        (row.original.taker_id as Omit<userItf, "role">).name
                    );
                },
                sortingFn: "alphanumeric",
                filterFn: "includesString",
            },
            {
                header: "Start time",
                accessorKey: "start_time",
                cell: ({ row }) => {
                    return format(
                        new Date(row.original.start_time),
                        "dd/MM/yyyy HH:mm:ss"
                    );
                },
                sortingFn: (rowA, rowB) =>
                    new Date(rowA.original.start_time).getTime() -
                    new Date(rowB.original.start_time).getTime(),
                filterFn: "includesString",
            },
            {
                header: "Submit time",
                accessorKey: "submit_time",
                cell: ({ row }) => {
                    return format(
                        new Date(row.original.submit_time),
                        "dd/MM/yyyy HH:mm:ss"
                    );
                },
                sortingFn: (rowA, rowB) =>
                    new Date(rowA.original.submit_time).getTime() -
                    new Date(rowB.original.submit_time).getTime(),
                filterFn: "includesString",
            },
            {
                header: "Duration",
                accessorKey: "duration",
                cell: ({ row }) => {
                    return formatTime(
                        (new Date(row.original.submit_time).getTime() -
                            new Date(row.original.start_time).getTime()) /
                            1000
                    );
                },
                sortingFn: (rowA, rowB) =>
                    new Date(rowA.original.submit_time).getTime() -
                    new Date(rowA.original.start_time).getTime() -
                    (new Date(rowB.original.submit_time).getTime() -
                        new Date(rowB.original.start_time).getTime()),
                enableColumnFilter: false,
            },
            {
                header: "Correct answers",
                accessorKey: "correct_answers",
                sortingFn: "alphanumeric",
                filterFn: "inNumberRange",
            },
            {
                header: "Wrong answers",
                accessorKey: "wrong_answers",
                sortingFn: "alphanumeric",
                filterFn: "inNumberRange",
            },
            {
                header: "Score",
                accessorKey: "score",
                sortingFn: "alphanumeric",
                filterFn: "inNumberRange",
            },
        ],
        []
    );

    const [enableFilter, setEnableFilter] = useState(false);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [selectedTakerId, setSelectedTakerId] = useState<string | null>();

    const table = useReactTable({
        columns: columns,
        data: submissions,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters: filters,
        },
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 10,
            },
            sorting: [
                {
                    id: "taker_id_name",
                    desc: false,
                },
            ],
        },
        onColumnFiltersChange: setFilters,
    });

    // console.log(table.getHeaderGroups()[0].headers[0].column);

    return (
        <div>
            <div className="flex justify-end">
                <button
                    className="bg-orange-600 text-white hover:bg-orange-700 px-4"
                    onClick={(e) => {
                        if (!enableFilter) {
                            setEnableFilter(true);
                        } else {
                            table.resetColumnFilters();
                        }
                    }}
                >
                    {!enableFilter ? "Filter columns" : "Clear all filters"}
                </button>
            </div>
            <table className="w-full mt-2">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className={`py-1 px-1 align-top border border-slate-400 bg-orange-100 ${
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
                                    {enableFilter &&
                                        header.column.getCanFilter() && (
                                            <input
                                                value={
                                                    (header.column.getFilterValue() as string) ??
                                                    ""
                                                }
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                onChange={(e) => {
                                                    header.column.setFilterValue(
                                                        e.target.value
                                                    );
                                                }}
                                                className="w-full border border-slate-300 px-2 py-0.5 focus:border-orange-600 outline-none grow leading-5"
                                            />
                                        )}
                                </th>
                            ))}
                            <th
                                className={`py-1 px-1 align-top border border-slate-400 bg-orange-100`}
                            >
                                Actions
                            </th>
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="text-center py-1 px-1 border border-slate-400"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                            <td className="text-center py-1 px-1 border border-slate-400">
                                <button
                                    className="text-sm bg-orange-600 text-white px-3 py-0.5 hover:bg-orange-700"
                                    onClick={() =>
                                        setSelectedTakerId(
                                            (row.original.taker_id as userItf)
                                                .id
                                        )
                                    }
                                >
                                    Detail
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                    className="border border-orange-600 "
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            {selectedTakerId && (
                <TakerSubmissionDetail
                    submission={
                        submissions.find(
                            (submission) =>
                                (submission.taker_id as Omit<userItf, "role">)
                                    .id === selectedTakerId
                        )!
                    }
                    takerId={selectedTakerId}
                    onClose={() => setSelectedTakerId(null)}
                />
            )}
        </div>
    );
};

export default SubmissionsTable;
