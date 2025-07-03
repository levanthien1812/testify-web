import { useState } from "react";
import Select from "../../../components/elements/Select";
import Input from "../../../components/elements/Input";
import Button from "../../../components/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Table } from "@tanstack/react-table";
import { TakerItf } from "../../../types/types";

type TakerFiltersProps = {
    table: Table<TakerItf>;
};

const TakerFilters = ({ table }: TakerFiltersProps) => {
    const fields = {
        NAME: "name",
        EMAIL: "email",
        GENDER: "gender",
        BIRTHDAY: "birthday",
        PHONE_NUMBER: "phone_number",
    };
    const options = [
        { value: "", label: "Select field" },
        { value: fields.NAME, label: "Name" },
        { value: fields.EMAIL, label: "Email" },
        { value: fields.GENDER, label: "Gender" },
        { value: fields.BIRTHDAY, label: "Birthday" },
        { value: fields.PHONE_NUMBER, label: "Phone number" },
    ];

    const [currentField, setCurrentField] = useState<string>(options[0].value);
    const [inputValue, setInputValue] = useState<string>("");
    const [selectValue, setSelectValue] = useState<string>("");
    const [dateRange, setDateRange] = useState<string[]>(["", ""]);

    const handleClickApply = () => {
        if (!currentField) return;

        const column = table.getColumn(currentField);
        if (!column) return;

        const filterValue =
            currentField === fields.BIRTHDAY
                ? dateRange
                : currentField === fields.GENDER
                ? selectValue
                : inputValue;
        if (!filterValue || filterValue.toString().trim() === "") return;

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

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Select
                    options={options}
                    label={{ text: "Select field" }}
                    value={currentField}
                    onChange={(e) => setCurrentField(e.target.value)}
                />
            </div>
            {currentField === fields.BIRTHDAY ? (
                <div className="flex gap-2">
                    <div className="flex gap-2">
                        <Input
                            type="date"
                            value={dateRange[0]}
                            onChange={(e) =>
                                setDateRange([e.target.value, dateRange[1]])
                            }
                        />
                    </div>
                    <div className="flex gap-2">
                        <Input
                            type="date"
                            value={dateRange[1]}
                            onChange={(e) =>
                                setDateRange([dateRange[0], e.target.value])
                            }
                        />
                    </div>
                </div>
            ) : currentField === fields.GENDER ? (
                <div className="flex gap-2">
                    <Select
                        options={[
                            { value: "", label: "Select gender" },
                            { value: "male", label: "Male" },
                            { value: "female", label: "Female" },
                        ]}
                        label={{ text: "Select gender" }}
                        value={selectValue}
                        onChange={(e) => setSelectValue(e.target.value)}
                    />
                </div>
            ) : (
                <div className="flex gap-2 items-center">
                    <Input
                        type="text"
                        label={{ text: "Search by name" }}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>
            )}
            <Button className="ml-auto" size="sm" onClick={handleClickApply}>
                Apply
            </Button>
            {table.getState().columnFilters.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {table.getState().columnFilters.map((filter) => (
                        <div
                            className="bg-gray-100 rounded-full px-2 py-1 text-sm w-fit flex items-center gap-2 border"
                            key={filter.id}
                        >
                            <span>
                                {filter.id}: {filter.value as string}
                            </span>
                            <button
                                className="bg-white p-1 w-6 h-6 flex items-center rounded-full justify-center leading-none"
                                onClick={() => handleClickRemove(filter.id)}
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
    );
};

export default TakerFilters;
