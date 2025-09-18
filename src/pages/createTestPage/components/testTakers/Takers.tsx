import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import AddTakers from "./AddTakers";
import Button from "../../../../components/elements/Button";
import { useAppSelector } from "../../../../hooks/hooks";
import { TakerItf } from "../../../../types/types";
import { useDispatch } from "react-redux";
import { createTestActions } from "../../../../stores/createTest";
import { shorten } from "../../../../utils/text";

const Takers = () => {
    const [isAddingTakers, setIsAddingTakers] = useState<boolean>(false);
    const { selectedTestTakers } = useAppSelector((state) => state.createTest);
    const dispatch = useDispatch();
    const { removeSelectedTestTakers } = createTestActions;

    const handleRemoveTaker = (taker: TakerItf) => {
        dispatch(removeSelectedTestTakers(taker));
    };

    return (
        <div className="mt-4">
            <div className="space-y-2">
                <div className="max-h-60 overflow-y-scroll space-y-1 sm:space-y-2">
                    {selectedTestTakers &&
                        selectedTestTakers.map((taker, index) => (
                            <div
                                className="px-4 py-2 bg-orange-100 flex justify-between items-center"
                                key={taker.id}
                            >
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        name={taker.user.email}
                                        id={taker.user.email}
                                        checked={true}
                                        readOnly
                                    />
                                    <label
                                        htmlFor={taker.user.email}
                                        className="cursor-pointer"
                                    >
                                        <span>{taker.name}</span>
                                        <span className="text-gray-600">
                                            {" "}
                                            - {taker.user.email}
                                        </span>
                                    </label>
                                    {taker.group && (
                                        <span className="text-orange-600 bg-orange-50 px-2 rounded-full py-0 border border-orange-600">
                                            {shorten(taker.group.name, 15)}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleRemoveTaker(taker)}
                                >
                                    <FontAwesomeIcon
                                        className="text-gray-500 hover:text-gray-600"
                                        icon={faTimes}
                                    />
                                </button>
                            </div>
                        ))}
                </div>

                <Button
                    size="lg"
                    secondary
                    className="w-full"
                    onClick={() => {
                        setIsAddingTakers(true);
                    }}
                >
                    Add
                </Button>
            </div>
            {isAddingTakers && (
                <AddTakers onClose={() => setIsAddingTakers(false)} />
            )}
        </div>
    );
};

export default Takers;
