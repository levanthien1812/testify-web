import React, { ChangeEvent } from "react";
import Select from "../../../../components/elements/Select";
import { RootState } from "../../../../stores/rootState";
import { useSelector } from "react-redux";
import {
    PASSCODE_FORMAT,
    PASSCODE_METHOD,
} from "../../../../config/constants/passcode";
import { useDispatch } from "react-redux";
import { createTestActions } from "../../../../stores/createTest";
import Input from "../../../../components/elements/Input";
import Button from "../../../../components/elements/Button";

const Passcode = () => {
    const { passcode } = useSelector((state: RootState) => state.createTest);
    const dispatch = useDispatch();

    const handlePasscodeChange = (
        e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        dispatch(
            createTestActions.setPasscode({
                ...passcode,
                [e.target.name]: e.target.value,
            })
        );
    };

    const handleGeneratePasscode = () => {};

    return (
        <div>
            <div className="flex gap-4 items-end mt-4">
                <label
                    htmlFor="method"
                    className="w-1/4 shrink-0 whitespace-nowrap overflow-hidden text-ellipsis"
                >
                    Select method:{" "}
                </label>
                <Select
                    className="w-0 grow capitalize"
                    name="method"
                    value={passcode?.method}
                    onChange={handlePasscodeChange}
                    options={Object.values(PASSCODE_METHOD).map((method) => ({
                        label: method,
                        value: method,
                    }))}
                />
            </div>
            {passcode.method === PASSCODE_METHOD.AUTO_GENERATED && (
                <div>
                    <div className="flex gap-4 items-end mt-4">
                        <label
                            htmlFor="format"
                            className="w-1/4 shrink-0 whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                            Select passcode format:{" "}
                        </label>
                        <Select
                            className="w-0 grow capitalize"
                            name="format"
                            value={passcode?.format}
                            onChange={handlePasscodeChange}
                            options={Object.values(PASSCODE_FORMAT).map(
                                (method) => ({
                                    label: method,
                                    value: method,
                                })
                            )}
                        />
                    </div>

                    <div className="mt-4 flex justify-center">
                        <Button onClick={handleGeneratePasscode}>
                            Generate passcode
                        </Button>
                    </div>
                </div>
            )}

            {(passcode.method === PASSCODE_METHOD.MANUALLY_ENTERED ||
                passcode.code?.length > 0) && (
                <div className="flex gap-4 items-end mt-4">
                    <label htmlFor="code" className="w-1/5 shrink-0">
                        Passcode:{" "}
                    </label>
                    <Input
                        type="text"
                        name="code"
                        value={passcode?.code}
                        onChange={handlePasscodeChange}
                    />
                </div>
            )}

            <div className="flex gap-4 items-end mt-4">
                <label htmlFor="valid-in" className="w-1/5 shrink-0">
                    Valid in:{" "}
                </label>
                <Input
                    type="number"
                    name="valid_in"
                    step={10}
                    min={10}
                    value={passcode?.valid_in}
                    onChange={handlePasscodeChange}
                />
                <label htmlFor="valid-till" className="w-1/5 shrink-0">
                    Valid till:{" "}
                </label>
                <Input
                    type="datetime-local"
                    name="valid_till"
                    min={10}
                    value={passcode?.valid_till?.toISOString()}
                    onChange={handlePasscodeChange}
                />
            </div>
        </div>
    );
};

export default Passcode;
