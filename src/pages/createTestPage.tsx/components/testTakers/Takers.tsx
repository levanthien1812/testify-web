import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import AddTakers from "./AddTakers";
import { TestItf, userItf } from "../../../../types/types";
import Button from "../../../../components/elements/Button";

type TakersProps = {
    test: TestItf;
    onAfterUpdate: () => void;
};

const Takers = ({ test, onAfterUpdate }: TakersProps) => {
    const [isAddingTakers, setIsAddingTakers] = useState<boolean>(false);

    return (
        <div className="mt-4">
            <div className="space-y-2">
                {test.taker_ids!.map((taker, index) => (
                    <div
                        className="px-4 py-2 bg-orange-100 flex justify-between items-center"
                        key={Math.random()}
                    >
                        <div className="flex gap-2 items-center">
                            <input
                                type="checkbox"
                                name={(taker as userItf).email}
                                id={(taker as userItf).email}
                                checked={true}
                            />
                            <label
                                htmlFor={(taker as userItf).email}
                                className="cursor-pointer"
                            >
                                <span>{(taker as userItf).name}</span>
                                <span className="text-gray-600">
                                    {" "}
                                    - {(taker as userItf).email}
                                </span>
                            </label>
                        </div>
                        <button>
                            <FontAwesomeIcon
                                className="text-gray-500 hover:text-gray-600"
                                icon={faTimes}
                            />
                        </button>
                    </div>
                ))}
                <Button
                    size="lg"
                    primary={false}
                    className="w-full"
                    onClick={() => {
                        setIsAddingTakers(true);
                    }}
                >
                    Add
                </Button>
            </div>
            {isAddingTakers && (
                <AddTakers
                    onClose={() => setIsAddingTakers(false)}
                    testId={test._id}
                    onAfterUpdate={onAfterUpdate}
                />
            )}
        </div>
    );
};

export default Takers;
