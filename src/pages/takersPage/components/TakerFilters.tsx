import { useMemo, useState } from "react";
import Select from "../../../components/elements/Select";
import Input from "../../../components/elements/Input";
import Button from "../../../components/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Table } from "@tanstack/react-table";
import { TakerGroupItf, TakerItf } from "../../../types/types";
import { GENDER_OPTIONS, TAKER_FIELDS } from "../../../config/constants/users";
import { getDistinctValues } from "../../../utils/filters";

type TakerFiltersProps = {
    table: Table<TakerItf>;
    initialGroups: TakerGroupItf[];
};

const TakerFilters = ({ table, initialGroups }: TakerFiltersProps) => {
    const [openFilters, setOpenFilters] = useState(false);

    const columnsToFilter = useMemo(() => {
        return table.getAllColumns().filter((col) => col.getCanFilter());
    }, [table]);

    const options = columnsToFilter.map((col) => ({
        value: col.id,
        label: col.columnDef.header ? col.columnDef.header.toString() : "",
    }));

    const distinctGroups = getDistinctValues(table, TAKER_FIELDS.GROUP);
    const groupOptions = distinctGroups.map((group) => ({
        value: group,
        label: initialGroups.find((g) => g.id === group)?.name || group,
    }));

    const [currentField, setCurrentField] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");
    const [selectValue, setSelectValue] = useState<string>("");
    const [dateRange, setDateRange] = useState<string[]>(["", ""]);

    const handleClickApply = () => {
        if (!currentField) return;
        const column = table.getColumn(currentField);

        if (!column) return;

        const filterValue =
            currentField === TAKER_FIELDS.BIRTHDAY
                ? dateRange
                : currentField === TAKER_FIELDS.GENDER ||
                  currentField === TAKER_FIELDS.GROUP
                ? selectValue
                : inputValue;
        if (!filterValue || filterValue.toString().trim() === "") return;
        console.log(column, filterValue);

        column.setFilterValue(filterValue);
        setInputValue("");
        setDateRange(["", ""]);
        setSelectValue("");
    };

    const handleClickRemove = (field: string) => {
        const column = table.getColumn(field);
        if (!column) return;

        column.setFilterValue(null);
    };

    const getColumnNameByFitlerId = (id: string) => {
        const column = table.getColumn(id);
        if (!column) return "";
        return column.columnDef.header
            ? column.columnDef.header.toString()
            : "";
    };

    const getDisplayValueByFilterValue = (id: string, value: any) => {
        switch (id) {
            case TAKER_FIELDS.BIRTHDAY:
                return `${value[0]} - ${value[1]}`;
            case TAKER_FIELDS.GENDER:
                return (
                    GENDER_OPTIONS.find((g) => g.value === value)?.label || ""
                );
            case TAKER_FIELDS.GROUP:
                return initialGroups.find((g) => g.id === value)?.name || "";
            default:
                return value;
        }
    };

    return (
        <div className="mt-2">
            <div className="flex gap-2">
                <button
                    className="flex justify-between items-center gap-1 bg-gray-200 hover:bg-gray-300 px-2 py-1 w-[80px]"
                    onClick={() => setOpenFilters(!openFilters)}
                >
                    <span>Filters</span>
                    <FontAwesomeIcon
                        icon={faChevronRight}
                        className={`text-sm text-gray-500 transition-all duration-150 ease-in-out ${
                            openFilters ? "rotate-90" : ""
                        }`}
                    />
                </button>
                <div className="ml-auto">
                    <Input
                        name="search"
                        placeholder="Search for takers"
                        value={table.getState().globalFilter}
                        onChange={(e) => table.setGlobalFilter(e.target.value)}
                    />
                </div>
            </div>
            {openFilters && (
                <div className="space-y-2 mt-2 bg-gray-200 px-4 py-2 border border-gray-300">
                    <div className="flex items-center gap-2">
                        <Select
                            options={options}
                            label={{ text: "Select field" }}
                            value={currentField}
                            onChange={(e) => setCurrentField(e.target.value)}
                        />
                    </div>
                    {currentField === TAKER_FIELDS.BIRTHDAY ? (
                        <div className="flex gap-2">
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    value={dateRange[0]}
                                    onChange={(e) =>
                                        setDateRange([
                                            e.target.value,
                                            dateRange[1],
                                        ])
                                    }
                                    label={{ text: "From" }}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    value={dateRange[1]}
                                    onChange={(e) =>
                                        setDateRange([
                                            dateRange[0],
                                            e.target.value,
                                        ])
                                    }
                                    label={{ text: "To" }}
                                />
                            </div>
                        </div>
                    ) : currentField === TAKER_FIELDS.GENDER ? (
                        <div className="flex gap-2">
                            <Select
                                options={GENDER_OPTIONS}
                                label={{ text: "Select gender" }}
                                value={selectValue}
                                onChange={(e) => setSelectValue(e.target.value)}
                            />
                        </div>
                    ) : currentField === TAKER_FIELDS.GROUP ? (
                        <div className="flex gap-2">
                            <Select
                                options={groupOptions}
                                label={{ text: "Select group" }}
                                value={selectValue}
                                onChange={(e) => setSelectValue(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <Input
                                type="text"
                                label={{ text: "Value to search" }}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="flex justify-end gap-2">
                        {table.getState().columnFilters.length > 0 && (
                            <Button
                                size="sm"
                                secondary
                                onClick={() => table.resetColumnFilters()}
                            >
                                Clear filters
                            </Button>
                        )}
                        <Button size="sm" onClick={handleClickApply}>
                            Apply
                        </Button>
                    </div>
                    {table.getState().columnFilters.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {table.getState().columnFilters.map((filter) => (
                                <div
                                    className="bg-gray-100 rounded-full px-2 py-1 text-sm w-fit flex items-center gap-2 border"
                                    key={filter.id}
                                >
                                    <span>
                                        {getColumnNameByFitlerId(filter.id)}:{" "}
                                        {getDisplayValueByFilterValue(
                                            filter.id,
                                            filter.value
                                        )}
                                    </span>
                                    <button
                                        className="bg-white p-1 w-6 h-6 flex items-center rounded-full justify-center leading-none shadow-sm"
                                        onClick={() =>
                                            handleClickRemove(filter.id)
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            className="text-gray-400 hover:text-gray-500 transition-all duration-150"
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TakerFilters;
