import { useEffect, useState } from "react";
import { userItf } from "../../../../types/types";
import Input from "../../../../components/elements/Input";

type TakersChoserProps = {
    takers: userItf[];
    label?: string;
    onAfterSelect: (selectedTakers: string[]) => void;
};

const TakersChoser = ({
    takers,
    label = "Choose takers",
    onAfterSelect,
}: TakersChoserProps) => {
    const [filteredTakers, setFilteredTakers] = useState<userItf[]>([]);
    const [search, setSearch] = useState("");
    const [selectedTakers, setSelectedTakers] = useState<string[]>([]);
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

    useEffect(() => {
        onAfterSelect(selectedTakers);
    }, [selectedTakers]);

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
                {!takers ||
                    (takers.length === 0 && (
                        <p className="text-center">No takers found!</p>
                    ))}
            </div>
        </div>
    );
};

export default TakersChoser;
