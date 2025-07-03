import { useMemo, useState } from "react";
import Button from "../../components/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowUpRightFromSquare,
    faEllipsis,
    faMars,
    faPlus,
    faVenus,
} from "@fortawesome/free-solid-svg-icons";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { TakerItf } from "../../types/types";
import defaultUserPhoto from "../../assets/images/default-user-photo.png";
import _ from "lodash";
import Checkbox from "../../components/elements/Checkbox";
import IconButton from "../../components/elements/IconButton";
import { INITIAL_TAKERS_COLUMN_FILTERS } from "../../config/constants/initialValues";
import { useQuery } from "react-query";
import { getTakers } from "../../services/user";
import { QUERY_KEYS } from "../../config/constants/queryMutationKeys";
import Loading from "../../components/loadings/Loading";
import { USER_GENDER } from "../../config/constants/users";
import TakerFilters from "./components/TakerFilters";
import { dateRangeFilter } from "../../utils/filters";

const TakersPage = () => {
    const [currentIdToShowActionModal, setCurrentIdToShowActionModal] =
        useState<string | null>(null);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const { data: takers, isLoading: isLoadingTakers } = useQuery({
        queryFn: async () => {
            const data = await getTakers();
            return data.takers;
        },
        queryKey: [QUERY_KEYS.GET_TAKERS],
    });

    const columns = useMemo<ColumnDef<TakerItf>[]>(
        () => [
            {
                id: "select-col",
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllRowsSelected()}
                        onChange={() => table.toggleAllRowsSelected()}
                        className="mx-auto"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onChange={() => row.getToggleExpandedHandler()}
                        disabled={!row.getCanSelect()}
                        name={row.original.id}
                        className="mx-auto"
                    />
                ),
            },
            {
                header: "Name",
                accessorKey: "name",
                cell: ({ row }) => {
                    const photo = row.original.photo;
                    const src =
                        photo && photo.length > 0 ? photo : defaultUserPhoto;
                    return (
                        <div className="flex items-center justify-start gap-2 rounded-full py-1 px-2 shadow-sm border border-gray-300 bg-white w-[80%] mx-auto">
                            <img
                                className="w-5 h-5 rounded-full"
                                src={src}
                                alt=""
                            />
                            <span>{_.capitalize(row.original.name)}</span>
                        </div>
                    );
                },
                filterFn: "includesString",
            },
            {
                header: "Email",
                accessorKey: "email",
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center justify-center gap-1 mx-auto">
                            <span>{row.original.email}</span>
                            <button className="bg-transparent border-none">
                                <FontAwesomeIcon
                                    icon={faArrowUpRightFromSquare}
                                    className="text-gray-400 hover:text-gray-500 transition-all duration-150"
                                />
                            </button>
                        </div>
                    );
                },
                filterFn: "includesString",
            },
            {
                header: "Gender",
                accessorKey: "gender",
                cell: ({ row }) => {
                    return (
                        <div>
                            <FontAwesomeIcon
                                icon={
                                    row.original.gender === USER_GENDER.FEMALE
                                        ? faVenus
                                        : faMars
                                }
                                className="text-gray-700"
                            />
                        </div>
                    );
                },
                filterFn: "equalsString",
            },
            {
                header: "Birthday",
                accessorKey: "birthday",
                cell: ({ row }) => {
                    return row.original.birthday;
                },
                filterFn: dateRangeFilter,
            },
            {
                header: "Phone number",
                accessorKey: "phone_number",
                cell: ({ row }) => {
                    return row.original.phone_number;
                },
                filterFn: "includesString",
            },
            {
                header: "",
                accessorKey: "id",
                cell: ({ row }) => {
                    return (
                        <div className="relative flex justify-center">
                            <IconButton
                                icon={faEllipsis}
                                onClick={() => {
                                    if (
                                        currentIdToShowActionModal ===
                                        row.original.id
                                    ) {
                                        setCurrentIdToShowActionModal(null);
                                        return;
                                    }
                                    setCurrentIdToShowActionModal(
                                        row.original.id!
                                    );
                                }}
                            />
                            {currentIdToShowActionModal === row.original.id && (
                                <div className="absolute top-6 bg-gray-100 z-10 shadow-md shadow-gray-300 px-2 py-2 flex flex-col gap-2 w-[120px]">
                                    <Button className="w-full" size="md">
                                        Delete
                                    </Button>
                                    <Button className="w-full" size="md">
                                        Edit
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                },
            },
        ],
        [currentIdToShowActionModal]
    );

    const table = useReactTable({
        columns,
        data: takers,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableMultiRowSelection: true,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        initialState: {
            pagination: {
                pageSize: 10,
            },
            columnFilters: INITIAL_TAKERS_COLUMN_FILTERS,
        },
        state: {
            columnFilters,
        },
    });

    return (
        <div className="xl:w-2/3 md:w-5/6 mx-auto py-10">
            <div className="flex items-center">
                <h2 className="text-4xl">Your takers</h2>
                <Button className="ml-auto">
                    <FontAwesomeIcon icon={faPlus} className="text-sm mr-1" />
                    <span>Add taker</span>
                </Button>
            </div>
            {isLoadingTakers && (
                <Loading
                    isLoading={isLoadingTakers}
                    loadingText={{ text: "Loading top takers..." }}
                />
            )}

            {takers && takers.length > 0 && <TakerFilters table={table} />}

            {takers && takers.length > 0 && (
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TakersPage;
