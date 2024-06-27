import { userItf } from "../../../../types/types";
import { useQuery } from "react-query";
import { getAvailableTakers } from "../../../../services/test";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { on } from "events";
import Input from "../../../../components/elements/Input";

type AvailableTakersProps = {
    testId: string;
    onAfterSelect: (selectedTakers: string[]) => void;
};

const AvailableTakers = ({ testId, onAfterSelect }: AvailableTakersProps) => {
    const [filteredTakers, setFilteredTakers] = useState<userItf[]>([]);
    const [search, setSearch] = useState("");
    const [selectedTakers, setSelectedTakers] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);

    const { data: availableTakers, isFetching } = useQuery<userItf[]>({
        queryFn: async () => {
            const data = await getAvailableTakers(testId);
            return data.takers;
        },
        queryKey: ["getAvailableTakers", { testId: testId }],
        onError: (err) => {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        },
    });

    useEffect(() => {
        if (availableTakers) {
            setFilteredTakers(availableTakers);
        } else {
            setFilteredTakers([]);
        }
    }, [availableTakers]);

    useEffect(() => {
        if (availableTakers) {
            if (search.length > 0) {
                setFilteredTakers(
                    availableTakers.filter(
                        (taker) =>
                            taker.name
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            taker.email
                                .toLowerCase()
                                .includes(search.toLowerCase())
                    )
                );
            } else {
                setFilteredTakers(availableTakers);
            }
        }
    }, [search, availableTakers]);

    useEffect(() => {
        onAfterSelect(selectedTakers);
    }, [selectedTakers]);

    return (
        <div>
            <p>Choose from available takers:</p>

            <div className="flex gap-4 items-end">
                <div>
                    <input
                        type="checkbox"
                        name="select-all"
                        id="select-all"
                        checked={selectAll}
                        onChange={(e) => {
                            setSelectAll(e.target.checked);
                            if (e.target.checked) {
                                setSelectedTakers(
                                    filteredTakers.map((taker) => taker.id)
                                );
                            } else {
                                setSelectedTakers([]);
                            }
                        }}
                    />
                    <label htmlFor="select-all" className="ms-2">
                        Select all
                    </label>
                </div>
                <div className="grow">
                    <Input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search takers"
                        className="w-full grow"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="max-h-52 overflow-y-scroll scrollbar-thin mt-2">
                {isFetching && !availableTakers && (
                    <p className="text-center">Loading available takers...</p>
                )}
                {filteredTakers &&
                    filteredTakers.map((taker, index) => (
                        <div
                            className="px-4 py-1 bg-orange-100 flex justify-between items-center"
                            key={taker.id}
                        >
                            <div className="flex gap-2 items-center">
                                <input
                                    type="checkbox"
                                    name={taker.id}
                                    id={taker.id}
                                    checked={selectedTakers.includes(taker.id)}
                                    onChange={(e) => {
                                        if (
                                            !selectedTakers.includes(taker.id)
                                        ) {
                                            setSelectedTakers([
                                                ...selectedTakers,
                                                taker.id,
                                            ]);
                                        } else {
                                            setSelectedTakers(
                                                selectedTakers.filter(
                                                    (id) => id !== taker.id
                                                )
                                            );
                                        }
                                    }}
                                />
                                <label
                                    htmlFor={taker.id}
                                    className="cursor-pointer"
                                >
                                    <span>{(taker as userItf).name}</span>
                                    <span className="text-gray-600">
                                        {" "}
                                        - {(taker as userItf).email}
                                    </span>
                                </label>
                            </div>
                        </div>
                    ))}
                {!availableTakers ||
                    (availableTakers.length === 0 && (
                        <p className="text-center">No takers available</p>
                    ))}
            </div>
        </div>
    );
};

export default AvailableTakers;
