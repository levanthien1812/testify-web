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
import { useMutation, useQuery } from "react-query";
import {
    MUTATION_KEYS,
    QUERY_KEYS,
} from "../../../../config/constants/queryMutationKeys";
import { generatePasscode, getPasscode } from "../../../../services/test";
import { SHARE_OPTIONS } from "../../../../config/constants/tests";
import Loading from "../../../../components/loadings/Loading";
import { useAppSelector } from "../../../../hooks/hooks";

const Passcode = () => {
    const { passcode } = useAppSelector((state) => state.createTest);
    const { testId, shareOption } = useAppSelector((state) => state.createTest);
    const { validate, setPasscode } = createTestActions;
    const dispatch = useDispatch();

    const handlePasscodeChange = (
        e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        dispatch(
            setPasscode({
                ...passcode,
                [e.target.name]: e.target.value,
            })
        );
        dispatch(validate());
    };

    const { isLoading: isLoadingPasscode } = useQuery({
        queryFn: async () => {
            const data = await getPasscode(testId!);

            return data.passcode;
        },
        queryKey: [QUERY_KEYS.GET_PASSCODE, { testId: testId }],
        onSuccess: (data) => {
            if (!data) return;
            dispatch(setPasscode(data));
        },
        enabled: shareOption === SHARE_OPTIONS.PASSCODE,
    });

    const { mutate, isLoading: isGeneratingPasscode } = useMutation({
        mutationFn: async () => {
            const responseData = await generatePasscode(testId!, {
                format: passcode.format,
                test_id: testId!,
            });

            return responseData.passcode;
        },
        mutationKey: MUTATION_KEYS.GENERATE_PASSCODE,
        onSuccess: (res) => {
            dispatch(createTestActions.setPasscode(res));
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

            {isLoadingPasscode && (
                <Loading
                    isLoading={isLoadingPasscode}
                    loadingText={{ text: "Loading passcode info..." }}
                />
            )}
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
                    value={passcode?.valid_till}
                    onChange={handlePasscodeChange}
                />
            </div>
        </div>
    );
};

export default Passcode;
