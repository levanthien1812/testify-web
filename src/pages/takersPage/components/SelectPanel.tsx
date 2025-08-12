import { Table } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import {
    AddTakersToGroup,
    TakerGroupItf,
    TakerItf,
} from "../../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "../../../components/elements/IconButton";
import { faTimes, faTrash, faUsers } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../../../components/modals/ConfirmModal";
import { toast } from "react-toastify";
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "../../../components/modals/Modal";
import Select from "../../../components/elements/Select";
import Checkbox from "../../../components/elements/Checkbox";
import { useForm } from "react-hook-form";
import Button from "../../../components/elements/Button";
import { useMutation } from "react-query";
import { MUTATION_KEYS } from "../../../config/constants/queryMutationKeys";
import { addTakersToGroup } from "../../../services/user";

type SelectPanelProps = {
    table: Table<TakerItf>;
    takerGroups?: TakerGroupItf[];
};

const SelectPanel = ({ table, takerGroups }: SelectPanelProps) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [isAddingToGroup, setIsAddingToGroup] = useState(false);

    const {
        register,
        formState: { errors },
        watch,
        setValue,
    } = useForm<AddTakersToGroup>({
        defaultValues: {
            selectedGroup: null,
            removeCurrentGroup: false,
            takerIds: table
                .getSelectedRowModel()
                .rows.map((row) => row.original.id),
        },
    });

    const allValues = watch();

    useEffect(() => {
        setValue(
            "takerIds",
            table.getSelectedRowModel().rows.map((row) => row.original.id)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table.getSelectedRowModel().rows]);

    const handleDeleteTakers = () => {
        if (!table.getSelectedRowModel().rows.length) {
            toast.warning("Please select at least one taker");
            return;
        }
        setIsConfirmingDelete(false);
    };

    const takerGroupOptions = takerGroups
        ? takerGroups.map((group) => ({
              value: group.id,
              label: group.name,
          }))
        : [];

    const {
        mutate: addTakersToGroupMutate,
        isLoading: addTakersToGroupLoading,
    } = useMutation({
        mutationKey: MUTATION_KEYS.ADD_TAKER_TO_GROUP,
        mutationFn: async (data: AddTakersToGroup) => {
            const response = await addTakersToGroup(data);
            return response;
        },
        onSuccess: () => {
            setIsAddingToGroup(false);
            toast.success("Takers added to group successfully");
        },
    });

    const handleSubmit = () => {
        addTakersToGroupMutate(allValues);
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
                <button
                    className="bg-transparent hover:bg-white hover:bg-opacity-35 text-gray-700 hover:text-gray-800 px-2 text-sm rounded-md"
                    onClick={() => setIsAddingToGroup(true)}
                >
                    <FontAwesomeIcon icon={faUsers} className="text-sm mr-1" />
                    Add to group
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
            {isAddingToGroup && (
                <Modal onClose={() => setIsAddingToGroup(false)}>
                    <ModalHeader title="Add to group" />
                    <ModalBody>
                        {takerGroups && (
                            <div className="flex flex-col">
                                <Select
                                    label={{ text: "Choose group to add to:" }}
                                    options={takerGroupOptions}
                                    disabled={takerGroups.length === 0}
                                    defaultValue={""}
                                    helperText={
                                        takerGroups.length === 0
                                            ? "No group available!"
                                            : ""
                                    }
                                    {...register("selectedGroup", {
                                        required: true,
                                    })}
                                    error={errors.selectedGroup?.message}
                                />
                            </div>
                        )}
                        <div className="mt-2">
                            <Checkbox
                                label={{
                                    text: "Remove current group(s) if any",
                                }}
                                {...register("removeCurrentGroup")}
                                defaultChecked={false}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={() => handleSubmit()}
                            disabled={addTakersToGroupLoading}
                        >
                            {addTakersToGroupLoading ? "Adding..." : "Add"}
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </div>
    );
};

export default SelectPanel;
