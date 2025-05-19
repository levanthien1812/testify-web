import React from "react";
import { PasscodeItf, TestItf } from "../../../types/types";
import { format } from "date-fns";
import { useAppSelector } from "../../../hooks/hooks";
import { SHARE_OPTIONS } from "../../../config/constants/tests";
import { getPasscode } from "../../../services/test";
import { QUERY_KEYS } from "../../../config/constants/queryMutationKeys";
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

const TestInfo = () => {
    const { test } = useAppSelector((state) => state.viewTest);
    const [passcode, setPasscode] = React.useState<PasscodeItf | null>(null);
    const [isPasscodeRevealed, setIsPasscodeRevealed] =
        React.useState<boolean>(false);
    const [isPasscodeCopied, setIsPasscodeCopied] =
        React.useState<boolean>(false);

    const { isLoading: isLoadingPasscode, refetch: refetchPasscode } = useQuery(
        {
            queryFn: async () => {
                const data = await getPasscode(test!.id);

                return data.passcode;
            },
            queryKey: [QUERY_KEYS.GET_PASSCODE],
            onSuccess: (data) => {
                if (!data) return;
                setPasscode(data);
            },
            onError: () => {},
            enabled: !!test && test.share_option === SHARE_OPTIONS.PASSCODE,
            retry: false,
        }
    );

    if (!test) return null;

    const handleClickRevealPasscode = () => {
        if (!isPasscodeRevealed) {
            setIsPasscodeRevealed(true);
            refetchPasscode();
        } else {
            setIsPasscodeRevealed(false);
        }
    };

    const handleClickCopyPasscode = () => {
        navigator.clipboard.writeText(passcode!.code);
        setIsPasscodeCopied(true);
    };

    return (
        <div>
            <p className="text-center text-[44px]">{test.title}</p>

            <p className="text-xl text-center mt-2">
                Duration:{" "}
                <span className=" font-bold text-orange-600 underline">
                    {test.duration} minutes
                </span>
            </p>

            <p className="text-xl text-center mt-2">
                Parts:{" "}
                <span className=" font-bold text-orange-600 underline"></span>{" "}
                {test.num_parts}
            </p>

            <p className="text-xl text-center mt-2">
                Questions:{" "}
                <span className=" font-bold text-orange-600 underline"></span>{" "}
                {test.num_questions}
            </p>

            <p className="text-xl text-center mt-2">
                Max score: {test.max_score}
            </p>

            {test.level && (
                <p className="text-xl text-center mt-2">
                    Level: <span className="capitalize">{test.level}</span>
                </p>
            )}

            <p className="text-xl text-center mt-2">
                Time start:{" "}
                <span className="font-bold px-2 text-orange-600 underline">
                    {format(new Date(test.datetime), "dd/MM/yyyy HH:mm")}
                </span>
            </p>

            {test.options.allow_close_time.enable && (
                <p className="text-xl text-center mt-2">
                    Time close:{" "}
                    <span className="font-bold px-2 text-orange-600 underline">
                        {format(
                            new Date(test.options.allow_close_time.close_time!),
                            "dd/MM/yyyy HH:mm"
                        )}
                    </span>
                </p>
            )}

            {test.share_option === SHARE_OPTIONS.PASSCODE && (
                <div className="flex justify-center mt-2 gap-2">
                    <p className="text-lg">
                        Passcode:{" "}
                        {passcode &&
                        isPasscodeRevealed &&
                        !isLoadingPasscode ? (
                            <span className="text-orange-600">
                                {passcode.code}
                            </span>
                        ) : (
                            <span className="text-orange-600 tracking-wide">
                                ******
                            </span>
                        )}
                    </p>
                    {!isLoadingPasscode && (
                        <button
                            onClick={handleClickRevealPasscode}
                            className="hover:underline text-gray-500 hover:text-gray-600"
                        >
                            {isPasscodeRevealed ? "Hide" : "Reveal"}
                        </button>
                    )}
                    {isLoadingPasscode && <p>Loading...</p>}
                    {!isLoadingPasscode && passcode && (
                        <button
                            onClick={handleClickCopyPasscode}
                            className="hover:underline text-gray-500 hover:text-gray-600"
                        >
                            {isPasscodeCopied ? "Copied" : "Copy"}
                        </button>
                    )}
                </div>
            )}

            {test.description && (
                <div className="bg-gray-100 px-6 py-4 mt-2">
                    <p className="text-md">
                        Description:{" "}
                        <span className="italic">{test.description}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default TestInfo;
