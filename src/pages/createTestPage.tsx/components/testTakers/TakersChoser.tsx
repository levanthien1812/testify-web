import { useEffect, useState } from "react";
import { TakerItf, userItf } from "../../../../types/types";
import Input from "../../../../components/elements/Input";
import { useSelector } from "react-redux";
import { RootState } from "../../../../stores/rootState";
import { createTestActions } from "../../../../stores/createTest";
import { useDispatch } from "react-redux";

type TakersChoserProps = {
    label?: string;
};

const TakersChoser = ({ label = "Choose takers" }: TakersChoserProps) => {
    const [filteredTakers, setFilteredTakers] = useState<TakerItf[]>([]);
    const [search, setSearch] = useState("");
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const dispatch = useDispatch();

    const { testTakers, availableTakers } = useSelector(
        (state: RootState) => state.createTest
    );
    const { saveTestTakers, addTestTakers } = createTestActions;

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

    const handleSelectAllTakers = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectAll(e.target.checked);
        if (e.target.checked) {
            dispatch(saveTestTakers({ testTakers: filteredTakers }));
        } else {
            dispatch(saveTestTakers({ testTakers: [] }));
        }
    };

    const handleSelectTaker = (taker: TakerItf) => {
        dispatch(addTestTakers([taker]));
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
                                    checked={testTakers.some(
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
                {!test ||
                    (test.length === 0 && (
                        <p className="text-center">No takers found!</p>
                    ))}
            </div>
        </div>
    );
};

export default TakersChoser;
