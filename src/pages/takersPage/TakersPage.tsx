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
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowSelectionState,
    useReactTable,
} from "@tanstack/react-table";
import { TakerGroupItf, TakerItf } from "../../types/types";
import defaultUserPhoto from "../../assets/images/default-user-photo.png";
import _ from "lodash";
import Checkbox from "../../components/elements/Checkbox";
import IconButton from "../../components/elements/IconButton";
import { useQuery } from "react-query";
import { getTakerGroups, getTakers } from "../../services/user";
import { QUERY_KEYS } from "../../config/constants/queryMutationKeys";
import Loading from "../../components/loadings/Loading";
import { TAKER_FIELDS, USER_GENDER } from "../../config/constants/users";
import TakerFilters from "./components/TakerFilters";
import { dateRangeFilter } from "../../utils/filters";
import AddTakers from "./components/AddTakers";
import { format } from "date-fns";
import { formatImageUrl } from "../../utils/formatImageUrl";
import AddGroup from "./components/AddGroup";
import TakersTable from "./components/TakersTable";
import SelectPanel from "./components/SelectPanel";
import TakerGroups from "./components/TakerGroups";
import InlineLoading from "../../components/loadings/InlineLoading";

const TakersPage = () => {
    const [currentIdToShowActionModal, setCurrentIdToShowActionModal] =
        useState<string | null>(null);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<any>("");
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [pagination, setPagination] = useState<{
        pageIndex: number;
        pageSize: number;
    }>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [isAddingTakers, setIsAddingTakers] = useState(false);
    const [isAddingGroup, setIsAddingGroup] = useState(false);
    const [isViewingGroups, setIsViewingGroups] = useState(false);
    const [currentTakerBeingViewed, setCurrentTakerBeingViewed] =
        useState<TakerItf | null>(null);

    const { data: takerGroups, isLoading: isLoadingTakerGroups } = useQuery<
        TakerGroupItf[]
    >({
        queryFn: async () => {
            const data = await getTakerGroups();
            return data.taker_groups;
        },
        queryKey: [QUERY_KEYS.GET_TAKER_GROUPS],
    });

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
                        onChange={table.getToggleAllRowsSelectedHandler()}
                        className="mx-auto"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        disabled={!row.getCanSelect()}
                        className="mx-auto"
                    />
                ),
                enableColumnFilter: false,
                enableSorting: false,
            },
            {
                header: "Name",
                accessorKey: TAKER_FIELDS.NAME,
                id: TAKER_FIELDS.NAME,
                cell: ({ row }) => {
                    const photo = row.original.user.photo;
                    const src = photo || defaultUserPhoto;
                    return (
                        <div className="flex items-center justify-start gap-2 rounded-full py-1 px-2 shadow-sm border border-gray-300 bg-white w-[80%] mx-auto">
                            <img
                                className="w-5 h-5 rounded-full object-cover"
                                src={formatImageUrl(src)}
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
                accessorKey: TAKER_FIELDS.EMAIL,
                id: TAKER_FIELDS.EMAIL,
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center justify-center gap-1 mx-auto">
                            <span>{row.original.user.email}</span>
                            <a
                                className="bg-transparent border-none"
                                href={`mailto:${row.original.user.email}`}
                            >
                                <FontAwesomeIcon
                                    icon={faArrowUpRightFromSquare}
                                    className="text-gray-400 hover:text-gray-500 transition-all duration-150"
                                />
                            </a>
                        </div>
                    );
                },
                filterFn: "includesString",
            },
            {
                header: "Gender",
                accessorKey: TAKER_FIELDS.GENDER,
                id: TAKER_FIELDS.GENDER,
                cell: ({ row }) => {
                    return row.original.user.gender ? (
                        <div>
                            <FontAwesomeIcon
                                icon={
                                    row.original.user.gender ===
                                    USER_GENDER.FEMALE
                                        ? faVenus
                                        : faMars
                                }
                                className="text-gray-700"
                            />
                        </div>
                    ) : (
                        "N/A"
                    );
                },
                filterFn: "equalsString",
            },
            {
                header: "Birthday",
                accessorKey: TAKER_FIELDS.BIRTHDAY,
                id: TAKER_FIELDS.BIRTHDAY,
                cell: ({ row }) => {
                    return row.original.user.birthday
                        ? format(
                              new Date(row.original.user.birthday),
                              "dd/MM/yyyy"
                          )
                        : "N/A";
                },
                filterFn: dateRangeFilter,
            },
            {
                header: "Phone number",
                accessorKey: TAKER_FIELDS.PHONE_NUMBER,
                id: TAKER_FIELDS.PHONE_NUMBER,
                cell: ({ row }) => {
                    return row.original.user.phone_number
                        ? row.original.user.phone_number
                        : "N/A";
                },
                filterFn: "includesString",
            },
            {
                header: "Group",
                accessorKey: TAKER_FIELDS.GROUP,
                id: TAKER_FIELDS.GROUP,
                cell: ({ row }) => {
                    if (row.original.group) {
                        return (
                            <div className="text-sm rounded-full border border-gray-300 px-2 py-1">
                                {row.original.group.name}
                            </div>
                        );
                    }
                    return "";
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
                                    <Button
                                        className="w-full"
                                        size="md"
                                        onClick={() => {
                                            setCurrentTakerBeingViewed(
                                                row.original
                                            );
                                            setCurrentIdToShowActionModal(null);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                },
                enableColumnFilter: false,
                enableSorting: false,
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
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            columnFilters,
            globalFilter,
            rowSelection,
            pagination,
        },
    });

    return (
        <div className="xl:w-2/3 md:w-5/6 mx-auto py-10">
            <div className="flex items-center gap-2">
                <h2 className="text-4xl">Your takers</h2>
                <Button
                    className="ml-auto"
                    onClick={() => setIsAddingGroup(true)}
                >
                    <FontAwesomeIcon icon={faPlus} className="text-sm mr-1" />
                    <span>Add group</span>
                </Button>
                <Button onClick={() => setIsAddingTakers(true)}>
                    <FontAwesomeIcon icon={faPlus} className="text-sm mr-1" />
                    <span>Add taker</span>
                </Button>
            </div>
            <div className="flex justify-end">
                <InlineLoading
                    isLoading={isLoadingTakerGroups}
                    loadingText={{ text: "Loading groups..." }}
                />
                {takerGroups && takerGroups.length > 0 && (
                    <Button
                        link
                        onClick={() => setIsViewingGroups((prev) => !prev)}
                    >
                        {isViewingGroups ? "Hide groups" : "View groups"}
                    </Button>
                )}
            </div>
            {isViewingGroups && takerGroups && (
                <TakerGroups groups={takerGroups} table={table} />
            )}
            <Loading
                isLoading={isLoadingTakers}
                loadingText={{ text: "Loading top takers..." }}
            />
            {takers && takers.length > 0 && (
                <TakerFilters table={table} initialGroups={takerGroups || []} />
            )}
            {takers && table.getRowModel().rows.length > 0 && (
                <TakersTable table={table} />
            )}
            {takers &&
                table.getRowModel().rows.length === 0 &&
                !isLoadingTakers && (
                    <p className="text-center text-lg text-gray-500 mt-4">
                        No takers found
                    </p>
                )}
            {isAddingTakers && (
                <AddTakers
                    onClose={() => setIsAddingTakers(false)}
                    takerGroups={takerGroups}
                />
            )}
            {currentTakerBeingViewed && (
                <AddTakers
                    onClose={() => setCurrentTakerBeingViewed(null)}
                    taker={currentTakerBeingViewed}
                    takerGroups={takerGroups}
                />
            )}
            {takers && table.getSelectedRowModel().rows.length > 0 && (
                <SelectPanel table={table} />
            )}
            {isAddingGroup && (
                <AddGroup
                    takers={takers}
                    onClose={() => setIsAddingGroup(false)}
                />
            )}
        </div>
    );
};

export default TakersPage;
