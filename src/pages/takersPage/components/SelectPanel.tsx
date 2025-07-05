import { Table } from "@tanstack/react-table";
import React, { useState } from "react";
import { TakerItf } from "../../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "../../../components/elements/IconButton";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../../../components/modals/ConfirmModal";
import { toast } from "react-toastify";

type SelectPanelProps = {
    table: Table<TakerItf>;
};

const SelectPanel = ({ table }: SelectPanelProps) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const handleDeleteTakers = () => {
        if (!table.getSelectedRowModel().rows.length) {
            toast.warning("Please select at least one taker");
            return;
        }
        setIsConfirmingDelete(false);
    };

    return (
        <div className="sticky left-0 bottom-2 w-full flex justify-center item mt-2">
            <div className="bg-orange-400 rounded-md px-4 py-2 flex gap-2 shadow-md shadow-gray-300 items-center">
                <span>{table.getSelectedRowModel().rows.length} selected</span>
                <button
                    className="bg-transparent hover:bg-white hover:bg-opacity-35 text-gray-700 hover:text-gray-800 px-2 text-sm rounded-md"
                    onClick={() => setIsConfirmingDelete(true)}
                >
                    <FontAwesomeIcon icon={faTrash} className="text-sm mr-1" />
                    Delete
                </button>
                <IconButton
                    icon={faTimes}
                    onClick={() => table.resetRowSelection()}
                    size="sm"
                />
            </div>
            {isConfirmingDelete && (
                <ConfirmModal
                    title="Delete takers"
                    message="Are you sure you want to delete these takers?"
                    onConfirm={handleDeleteTakers}
                    onClose={() => setIsConfirmingDelete(false)}
                />
            )}
        </div>
    );
};

export default SelectPanel;
