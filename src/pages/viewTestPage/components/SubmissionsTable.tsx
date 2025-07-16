import { useMemo, useState } from "react";
import { SubmissionItf, TakerItf } from "../../../types/types";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/elements/Button";
import Input from "../../../components/elements/Input";
import Select from "../../../components/elements/Select";
import { useDispatch } from "react-redux";
import { viewTestActions } from "../../../stores/viewTest";
import { useAppSelector } from "../../../hooks/hooks";
import Paginator from "../../../components/table/Paginator";
import { getRound } from "../../../utils/primitives";

type SubmissionsTableProps = {
    submissions: SubmissionItf[];
    refetch: () => void;
};

const SubmissionsTable = ({ submissions, refetch }: SubmissionsTableProps) => {
    const columns = useMemo<ColumnDef<SubmissionItf>[]>(
        () => [
            {
                header: "Name",
                accessorKey: "taker.name",
                cell: ({ row }) => {
                    return _.capitalize(row.original.taker.name);
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
                cell: ({ row }) => {
                    return getRound(row.original.score || 0);
                },
                filterFn: "inNumberRange",
            },
        ],
        []
    );

    const [enableFilter, setEnableFilter] = useState(false);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const { currentSubmissionBeingViewed } = useAppSelector(
        (state) => state.viewTest
    );
    const dispatch = useDispatch();

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
                    id: "taker.name",
                    desc: false,
                },
            ],
        },
        onColumnFiltersChange: setFilters,
    });

    return (
        <div>
            <div className="flex justify-end items-center gap-3">
                <button onClick={refetch}>
                    <FontAwesomeIcon
                        className="text-gray-600 active:text-orange-600"
                        icon={faRotateRight}
                    />
                </button>
                <Button
                    size="sm"
                    onClick={(e) => {
                        if (!enableFilter) {
                            setEnableFilter(true);
                        } else {
                            table.resetColumnFilters();
                        }
                    }}
                >
                    {!enableFilter ? "Filter columns" : "Clear all filters"}
                </Button>
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
                                            <Input
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
                                                className="w-full border-slate-300"
                                                sizing="sm"
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
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        dispatch(
                                            viewTestActions.setCurrentSubmissionBeingViewed(
                                                row.original
                                            )
                                        );
                                    }}
                                >
                                    Detail
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Paginator table={table} />
            {currentSubmissionBeingViewed && <TakerSubmissionDetail />}
        </div>
    );
};

export default SubmissionsTable;
