import { ChangeEvent, useEffect } from "react";
import Select from "../../../../components/elements/Select";
import {
    PASSCODE_FORMAT,
    PASSCODE_METHOD,
    PASSCODE_METHOD_LABEL,
} from "../../../../config/constants/passcode";
import { useDispatch } from "react-redux";
import { createTestActions } from "../../../../stores/createTest";
import Input from "../../../../components/elements/Input";
import Button from "../../../../components/elements/Button";
import { useMutation } from "react-query";
import { MUTATION_KEYS } from "../../../../config/constants/queryMutationKeys";
import { generatePasscode } from "../../../../services/test";
import { PASSCODE_VALID_UNIT } from "../../../../config/constants/tests";
import { useAppSelector } from "../../../../hooks/hooks";
import { format } from "date-fns";

const Passcode = () => {
    const { passcode } = useAppSelector((state) => state.createTest);
    const { testId } = useAppSelector((state) => state.createTest);
    const { validate, setPasscode } = createTestActions;
    const dispatch = useDispatch();

    const handlePasscodeChange = (
        e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        dispatch(
            setPasscode({
                [e.target.name]: e.target.value,
            })
        );
        // dispatch(validate());
    };

    const { mutate, isLoading: isGeneratingPasscode } = useMutation({
        mutationFn: async () => {
            const responseData = await generatePasscode(testId!, {
                format: passcode.format,
            });

            return responseData.passcode;
        },
        mutationKey: MUTATION_KEYS.GENERATE_PASSCODE,
        onSuccess: (res) => {
            dispatch(createTestActions.setPasscode({ code: res }));
        },
    });

    const handleGeneratePasscode = () => {
        mutate();
    };

    useEffect(() => {
        if (passcode) {
            dispatch(validate());
        }
    }, [dispatch, validate, passcode]);

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
                        label: PASSCODE_METHOD_LABEL[method],
                        value: method,
                    }))}
                    guideOption="Select a method"
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
                                (format) => ({
                                    label: format,
                                    value: format,
                                })
                            )}
                            helperText="X is number, Y is letter"
                        />
                    </div>

                    <div className="mt-4 flex justify-center">
                        <Button
                            onClick={handleGeneratePasscode}
                            disabled={isGeneratingPasscode}
                        >
                            {!isGeneratingPasscode
                                ? "Generate passcode"
                                : "Generating passcode"}
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

            {passcode.method && (
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end mt-4">
                    <div className="flex items-end gap-2">
                        <Input
                            type="number"
                            name="valid_in"
                            step={1}
                            min={1}
                            value={passcode?.valid_in}
                            onChange={handlePasscodeChange}
                            label={{ text: "Valid in" }}
                        />
                        <Select
                            options={[
                                {
                                    label: "minutes",
                                    value: PASSCODE_VALID_UNIT.MINUTES,
                                },
                                {
                                    label: "hours",
                                    value: PASSCODE_VALID_UNIT.HOURS,
                                },
                                {
                                    label: "days",
                                    value: PASSCODE_VALID_UNIT.DAYS,
                                },
                            ]}
                            name="valid_unit"
                            value={passcode?.valid_unit}
                            onChange={handlePasscodeChange}
                        />
                    </div>
                    <div className="flex items-end gap-2">
                        <Input
                            type="datetime-local"
                            name="valid_till"
                            value={format(
                                new Date(passcode?.valid_till || ""),
                                "yyyy-MM-dd'T'HH:mm"
                            )}
                            onChange={handlePasscodeChange}
                            label={{ text: "Valid till" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Passcode;
