import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import AddTakers from "./AddTakers";
import { TestItf, userItf } from "../../../../types/types";
import Button from "../../../../components/elements/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../../../stores/rootState";

const Takers = () => {
    const [isAddingTakers, setIsAddingTakers] = useState<boolean>(false);
    const { testTakers } = useSelector((state: RootState) => state.createTest);

    return (
        <div className="mt-4">
            <div className="space-y-2">
                {testTakers!.map((taker, index) => (
                    <div
                        className="px-4 py-2 bg-orange-100 flex justify-between items-center"
                        key={Math.random()}
                    >
                        <div className="flex gap-2 items-center">
                            <input
                                type="checkbox"
                                name={taker.email}
                                id={taker.email}
                                checked={true}
                                readOnly
                            />
                            <label
                                htmlFor={taker.email}
                                className="cursor-pointer"
                            >
                                <span>{taker.name}</span>
                                <span className="text-gray-600">
                                    {" "}
                                    - {taker.email}
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
                <AddTakers onClose={() => setIsAddingTakers(false)} />
            )}
        </div>
    );
};

export default Takers;
