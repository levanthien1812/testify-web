import { useEffect, useState } from "react";
import { TakerGroupItf, TakerItf } from "../../../../types/types";
import Input from "../../../../components/elements/Input";
import Select from "../../../../components/elements/Select";
import { useQuery } from "react-query";
import { getTakerGroups } from "../../../../services/user";
import { QUERY_KEYS } from "../../../../config/constants/queryMutationKeys";
import { shorten } from "../../../../utils/text";

type TakersChoserProps = {
    label?: string;
    takers: TakerItf[];
    selectedTestTakers: TakerItf[];
    onCheck: (takers: TakerItf, checked: boolean) => void;
    onCheckAll: (takers: TakerItf[], checked: boolean) => void;
};

const TakersChoser = ({
    label = "Choose takers",
    takers = [],
    selectedTestTakers = [],
    onCheck,
    onCheckAll,
}: TakersChoserProps) => {
    const [filteredTakers, setFilteredTakers] = useState<TakerItf[]>([]);
    const [search, setSearch] = useState("");
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [selectedGroup, setSelectedGroup] = useState<TakerGroupItf | null>(
        null
    );

    const { data: takerGroups, isLoading: isLoadingTakerGroups } = useQuery<
        TakerGroupItf[]
    >({
        queryFn: async () => {
            const data = await getTakerGroups();
            return data.taker_groups;
        },
        queryKey: [QUERY_KEYS.GET_TAKER_GROUPS],
    });

    useEffect(() => {
        if (takers) {
            if (search.length > 0) {
                setFilteredTakers(
                    takers.filter(
                        (taker) =>
                            taker.name
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            taker.user.email
                                .toLowerCase()
                                .includes(search.toLowerCase())
                    )
                );
            } else {
                setFilteredTakers(takers);
            }
        }
    }, [search, takers]);

    let groupOptions = takerGroups
        ? takerGroups.map((group) => ({
              value: group.id,
              label: group.name,
          }))
        : [];

    groupOptions.unshift({ value: "", label: "Select group" });

    const handleSelectAllTakers = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectAll(e.target.checked);
        if (e.target.checked) {
            onCheckAll(takers, true);
        } else {
            onCheckAll(takers, false);
        }
    };

    useEffect(() => {
        if (selectedGroup) {
            setFilteredTakers(
                takers.filter((taker) => taker.group_id === selectedGroup.id)
            );
            setSelectAll(false);
        } else {
            setFilteredTakers(takers);
        }
    }, [selectedGroup, takers]);

    const handleSelectTaker = (taker: TakerItf) => {
        onCheck(taker, !selectedTestTakers.some((t) => t.id === taker.id));
    };

    useEffect(() => {
        const isAllSelected = filteredTakers.every((taker) =>
            selectedTestTakers.some((t) => t.id === taker.id)
        );
        setSelectAll(isAllSelected);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTestTakers, filteredTakers]);

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
                {takerGroups && takerGroups.length > 0 && (
                    <div className="flex gap-2">
                        <Select
                            value={selectedGroup?.id}
                            onChange={(e) =>
                                setSelectedGroup(
                                    takerGroups.find(
                                        (group) => group.id === e.target.value
                                    )!
                                )
                            }
                            options={groupOptions}
                            defaultValue={"Select group"}
                            name="select-group"
                        />
                    </div>
                )}
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
                                        - {taker.user.email}
                                    </span>
                                </label>
                                {taker.group && (
                                    <span className="text-orange-600 bg-orange-50 px-2 rounded-full py-0 border border-orange-600">
                                        {shorten(taker.group.name, 15)}
                                    </span>
                                )}
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
