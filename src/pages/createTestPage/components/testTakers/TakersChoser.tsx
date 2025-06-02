import { useEffect, useState } from "react";
import { TakerItf } from "../../../../types/types";
import Input from "../../../../components/elements/Input";

type TakersChoserProps = {
    label?: string;
    takers: TakerItf[];
    selectedTestTakers: TakerItf[];
    onSelect: (takers: TakerItf[]) => void;
};

const TakersChoser = ({
    label = "Choose takers",
    takers = [],
    selectedTestTakers = [],
    onSelect,
}: TakersChoserProps) => {
    const [filteredTakers, setFilteredTakers] = useState<TakerItf[]>([]);
    const [search, setSearch] = useState("");
    const [selectAll, setSelectAll] = useState<boolean>(false);

    useEffect(() => {
        if (takers) {
            if (search.length > 0) {
                setFilteredTakers(
                    takers.filter(
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
                setFilteredTakers(takers);
            }
        }
    }, [search, takers]);

    const handleSelectAllTakers = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectAll(e.target.checked);
        if (e.target.checked) {
            // dispatch(
            //     saveSelectedTestTakers({ selectedTestTakers: filteredTakers })
            // );
            onSelect(filteredTakers);
        } else {
            // dispatch(saveSelectedTestTakers({ selectedTestTakers: [] }));
            onSelect([]);
        }
    };

    const handleSelectTaker = (taker: TakerItf) => {
        // dispatch(addSelectedTestTakers([taker]));
        onSelect([taker]);
    };

    return (
        <div>
            <p>{label}</p>

            <div className="flex gap-4 items-end">
                <div>
                    <input
                        type="checkbox"
                        name="select-all"
                        id="select-all"
                        checked={selectAll}
                        onChange={handleSelectAllTakers}
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
                                    checked={selectedTestTakers.some(
                                        (t) => t.id === taker.id
                                    )}
                                    onChange={() => handleSelectTaker(taker)}
                                />
                                <label
                                    htmlFor={taker.id}
                                    className="cursor-pointer"
                                >
                                    <span>{taker.name}</span>
                                    <span className="text-gray-600">
                                        {" "}
                                        - {taker.email}
                                    </span>
                                </label>
                            </div>
                        </div>
                    ))}
                {!filteredTakers ||
                    (filteredTakers.length === 0 && (
                        <p className="text-center">No takers found!</p>
                    ))}
            </div>
        </div>
    );
};

export default TakersChoser;
