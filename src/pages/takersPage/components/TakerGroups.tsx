import React from "react";
import { TakerGroupItf, TakerItf } from "../../../types/types";
import { shorten } from "../../../utils/text";
import IconButton from "../../../components/elements/IconButton";
import { faEllipsis, faUser } from "@fortawesome/free-solid-svg-icons";
import { Table } from "@tanstack/react-table";
import { TAKER_FIELDS } from "../../../config/constants/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    table: Table<TakerItf>;
    groups: TakerGroupItf[];
};

const TakerGroups = ({ groups, table }: Props) => {
    return (
        <div className="flex gap-2 relative overflow-x-scroll">
            {groups &&
                groups.map((group) => (
                    <div
                        className="flex flex-col bg-white shadow-md shadow-gray-300 border-t relative overflow-hidden w-[250px] shrink-0"
                        key={group.id}
                    >
                        <div className="p-2 space-y-2 bg-wave grow">
                            <p className="font-bold text-xl">{group.name}</p>
                            {group.description && (
                                <p className="text-gray-500 text-sm">
                                    {shorten(group.description, 50)}
                                </p>
                            )}
                            <div className="text-orange-600 flex gap-1 items-center">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-xs"
                                />
                                {group.takers ? group.takers.length : 0} takers
                            </div>
                        </div>
                        <button
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-75 ease-in-out"
                            onClick={() => {
                                table.resetColumnFilters();
                                table.resetRowSelection();
                                table.setColumnFilters([
                                    {
                                        id: TAKER_FIELDS.GROUP,
                                        value: group.id,
                                    },
                                ]);
                                // table.setGlobalFilter(group.id);
                            }}
                        >
                            View takers
                        </button>
                        <div className="absolute top-0 right-0 p-1">
                            <IconButton icon={faEllipsis} onClick={() => {}} />
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default TakerGroups;
