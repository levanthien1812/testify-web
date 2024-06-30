import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { getTakersStatistics } from "../../../services/user";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { TakerStatistics } from "../../../types/types";
import _ from "lodash";
import Button from "../../../components/elements/Button";
import { Link, useNavigate } from "react-router-dom";
import defaultUserPhoto from "../../../assets/images/default-user-photo.png";

const TopTakers = () => {
    const { data: topTakers, isLoading: isLoadingTopTakers } = useQuery({
        queryKey: ["topTakers"],
        queryFn: async () => {
            const responseData = await getTakersStatistics();
            return responseData.takers;
        },
    });

    const columns = useMemo<ColumnDef<TakerStatistics>[]>(
        () => [
            {
                header: "Photo",
                accessorKey: "taker.photo",
                cell: ({ row }) => {
                    const photo = row.original.taker.photo;
                    const src =
                        photo && photo.length > 0 ? photo : defaultUserPhoto;
                    return (
                        <img
                            className="w-7 h-7 rounded-full mx-auto"
                            src={src}
                            alt=""
                        />
                    );
                },
            },
            {
                header: "Name",
                accessorKey: "taker.name",
                cell: ({ row }) => {
                    return _.capitalize(row.original.taker.name);
                },
            },
            {
                header: "Email",
                accessorKey: "taker.email",
            },
            {
                header: "Total tests assigned",
                accessorKey: "total_tests_assigned",
                cell: ({ row }) => {
                    return row.original.total_tests_assigned;
                },
            },
            {
                header: "Total submissions",
                accessorKey: "total_submissions",
                cell: ({ row }) => {
                    return row.original.total_submissions;
                },
            },
            {
                header: "Average score",
                accessorKey: "average_score",
                cell: ({ row }) => {
                    return row.original.average_score;
                },
            },
        ],
        []
    );

    const table = useReactTable({
        columns,
        data: topTakers,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
            sorting: [
                {
                    id: "average_score",
                    desc: true,
                },
            ],
        },
    });

    return (
        <div className="mt-4">
            <h2 className="text-2xl">Top Takers</h2>

            {isLoadingTopTakers && (
                <p className="mt-2 text-gray-600 text-xl text-center">
                    Loading top takers...
                </p>
            )}

            {topTakers && topTakers.length > 0 && (
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
                                            ? header.column.getIsSorted() ===
                                              "asc"
                                                ? " 🔼"
                                                : " 🔽"
                                            : ""}
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
                                        className={`py-1 px-1 align-middle border text-center border-slate-400`}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                                <td className="text-center py-1 px-1 border border-slate-400">
                                    <Link
                                        to={`/takers/${row.original.taker.id}`}
                                    >
                                        <Button size="sm">Detail</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TopTakers;
